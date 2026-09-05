<template>
  <div class="other-dimensions">
    <!-- 顶部操作栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索标题、备注或标签..."
          clearable
          style="width: 260px;"
        >
          <template #prefix><el-icon><Search /></el-icon></template>
        </el-input>
      </div>
      <div class="toolbar-center">
        <!-- 类型快捷筛选 -->
        <div class="type-filters">
          <div
            :class="['type-filter-chip', { active: currentFilter === 'all' }]"
            @click="currentFilter = 'all'"
          >
            <el-icon><Grid /></el-icon>
            <span>全部</span>
          </div>
          <div
            v-for="t in availableTypes"
            :key="t.value"
            :class="['type-filter-chip', { active: currentFilter === t.value }]"
            @click="currentFilter = t.value"
          >
            <el-icon :style="{ color: t.color }"><component :is="getIconComponent(t.icon)" /></el-icon>
            <span>{{ t.label }}</span>
            <span v-if="getTypeCount(t.value) > 0" class="chip-count">{{ getTypeCount(t.value) }}</span>
          </div>
          <div class="type-filter-chip manage-chip" @click="openTypeDialog">
            <el-icon><Setting /></el-icon>
            <span>管理类型</span>
          </div>
        </div>
      </div>
      <div class="toolbar-right">
        <!-- 视图切换 -->
        <div class="view-toggle">
          <div
            :class="['view-btn', { active: viewMode === 'card' }]"
            @click="viewMode = 'card'"
            title="卡片视图"
          ><el-icon><Grid /></el-icon></div>
          <div
            :class="['view-btn', { active: viewMode === 'list' }]"
            @click="viewMode = 'list'"
            title="列表视图"
          ><el-icon><List /></el-icon></div>
          <div
            :class="['view-btn', { active: viewMode === 'group' }]"
            @click="viewMode = 'group'"
            title="按类型分组"
          ><el-icon><CollectionTag /></el-icon></div>
        </div>
        <el-button type="primary" :icon="Plus" @click="openAddDialog">添加收藏</el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-bar" v-if="stats.total > 0">
      <div class="stat-card stat-total">
        <div class="stat-num">{{ stats.total }}</div>
        <div class="stat-label">总收藏</div>
      </div>
      <div class="stat-card stat-wish" v-if="stats.wish > 0">
        <div class="stat-num">{{ stats.wish }}</div>
        <div class="stat-label">待看</div>
      </div>
      <div class="stat-card stat-doing" v-if="stats.doing > 0">
        <div class="stat-num">{{ stats.doing }}</div>
        <div class="stat-label">进行中</div>
      </div>
      <div class="stat-card stat-done" v-if="stats.done > 0">
        <div class="stat-num">{{ stats.done }}</div>
        <div class="stat-label">已完成</div>
      </div>
      <div class="stat-card stat-pinned" v-if="stats.pinned > 0">
        <div class="stat-num">{{ stats.pinned }}</div>
        <div class="stat-label">置顶</div>
      </div>
    </div>

    <!-- ===== 卡片网格视图 ===== -->
    <template v-if="viewMode === 'card' && paginatedList.length > 0">
      <div class="cards-grid">
        <div
          v-for="item in paginatedList"
          :key="item.id"
          :class="['collect-card', 'status-' + item.status, { pinned: item.pinned }]"
          :style="{ '--status-color': statusColor(item.status) }"
        >
          <div v-if="item.pinned" class="pin-badge">
            <el-icon><Position /></el-icon>
          </div>
          <div v-if="item.pictureUrl" class="card-img-wrap">
            <el-image :src="item.pictureUrl" fit="cover" class="card-img" :preview-src-list="[item.pictureUrl]">
              <template #error>
                <div class="card-img-fallback">
                  <el-icon :style="{ color: getTypeInfo(item.type).color, fontSize: '26px' }">
                    <component :is="getIconComponent(getTypeInfo(item.type).icon)" />
                  </el-icon>
                </div>
              </template>
            </el-image>
          </div>
          <div v-else class="card-icon-wrap" :style="{ background: getTypeInfo(item.type).color + '22' }">
            <el-icon :style="{ color: getTypeInfo(item.type).color, fontSize: '26px' }">
              <component :is="getIconComponent(getTypeInfo(item.type).icon)" />
            </el-icon>
          </div>
          <div class="card-main">
            <div class="card-header">
              <span class="card-type-tag" :style="{ background: getTypeInfo(item.type).color + '1a', color: getTypeInfo(item.type).color }">
                {{ getTypeInfo(item.type).label }}
              </span>
              <div class="card-header-actions">
                <a
                  v-if="item.linkUrl"
                  :href="item.linkUrl"
                  target="_blank"
                  class="card-link"
                  title="打开链接"
                >
                  <el-icon><Link /></el-icon>
                </a>
                <el-dropdown trigger="click" @command="(cmd) => handleCommand(cmd, item)">
                  <el-icon class="card-more"><MoreFilled /></el-icon>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item :command="'pin'">{{ item.pinned ? '取消置顶' : '置顶' }}</el-dropdown-item>
                      <el-dropdown-item :command="'share'">{{ item.share ? '取消分享' : '分享到首页' }}</el-dropdown-item>
                      <el-dropdown-item :command="'edit'">编辑</el-dropdown-item>
                      <el-dropdown-item :command="'delete'" divided>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
            <div class="card-title" :title="item.title">{{ item.title }}</div>
            <div class="card-note" v-if="item.note">{{ item.note }}</div>
            <div class="card-progress" v-if="item.status === 'doing'">
              <el-progress :percentage="item.progress || 0" :stroke-width="8" :show-text="true" />
            </div>
            <div class="card-tags" v-if="item.tags && item.tags.length > 0">
              <span v-for="tag in item.tags" :key="tag" class="card-tag">#{{ tag }}</span>
            </div>
            <div class="card-footer">
              <el-tag :type="statusTagType(item.status)" size="small" effect="plain" round>
                {{ statusLabel(item.status) }}
              </el-tag>
              <span class="card-time">{{ formatTime(item.createTime) }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ===== 列表视图 ===== -->
    <template v-if="viewMode === 'list'">
      <el-table
        v-if="paginatedList.length > 0"
        class="list-table"
        :data="paginatedList"
        :row-class-name="listRowClassName"
        border
      >
        <el-table-column label="#" width="55" align="center">
          <template #default="{ $index }">{{ (currentPage - 1) * pageSize + $index + 1 }}</template>
        </el-table-column>
        <el-table-column label="类型" width="90" align="center">
          <template #default="{ row }">
            <el-icon :style="{ color: getTypeInfo(row.type).color, fontSize: '20px' }">
              <component :is="getIconComponent(getTypeInfo(row.type).icon)" />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column label="封面" width="80" align="center">
          <template #default="{ row }">
            <el-image
              v-if="row.pictureUrl"
              :src="row.pictureUrl"
              fit="cover"
              style="width:48px;height:48px;border-radius:6px;"
              :preview-src-list="[row.pictureUrl]"
            >
              <template #error>
                <div style="width:48px;height:48px;background:#f5f7fa;display:flex;align-items:center;justify-content:center;color:#c0c4cc;font-size:11px;">无图</div>
              </template>
            </el-image>
            <span v-else style="color:#c0c4cc;font-size:12px;">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="180">
          <template #default="{ row }">
            <a
              v-if="row.linkUrl"
              :href="row.linkUrl"
              target="_blank"
              :title="row.linkUrl"
              class="list-title-link"
            >{{ row.title }}</a>
            <span v-else>{{ row.title }}</span>
            <el-tag
              v-if="row.pinned"
              type="primary"
              size="small"
              effect="dark"
              round
              style="margin-left: 6px;"
            >置顶</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)" size="small" effect="plain" round>
              {{ statusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="进度" width="140">
          <template #default="{ row }">
            <el-progress
              v-if="row.status === 'doing'"
              :percentage="row.progress || 0"
              :stroke-width="6"
            />
            <span v-else class="list-note">{{ row.status === 'done' ? '✓ 已完成' : '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标签" min-width="140">
          <template #default="{ row }">
            <span v-if="row.tags && row.tags.length > 0" class="list-tags">
              <span v-for="tag in row.tags" :key="tag" class="list-tag">#{{ tag }}</span>
            </span>
            <span v-else class="list-note">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="note" label="备注" min-width="160" show-overflow-tooltip />
        <el-table-column label="时间" width="110">
          <template #default="{ row }">
            <span class="list-time">{{ formatTime(row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button size="small" link @click="openEditDialog(row)">编辑</el-button>
            <el-button
              size="small"
              link
              type="danger"
              @click="handleCommand('delete', row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!-- ===== 分页器（卡片/列表视图） ===== -->
    <div
      v-if="(viewMode === 'card' || viewMode === 'list') && filteredList.length > 0"
      class="pagination-wrap"
    >
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[8, 12, 24, 48]"
        :total="filteredList.length"
        background
        layout="total, sizes, prev, pager, next, jumper"
      />
    </div>

    <!-- ===== 按类型分组视图 ===== -->
    <template v-if="viewMode === 'group'">
      <div v-if="filteredList.length > 0" class="grouped-view">
        <div
          v-for="g in groupedList"
          :key="g.type"
          class="group-section"
        >
          <!-- 分组标题 -->
          <div class="group-header" :style="{ '--g-color': getTypeInfo(g.type).color }">
            <div class="group-color-bar"></div>
            <div class="group-header-left">
              <div class="group-icon" :style="{ background: getTypeInfo(g.type).color + '22' }">
                <el-icon :style="{ color: getTypeInfo(g.type).color, fontSize: '18px' }">
                  <component :is="getIconComponent(getTypeInfo(g.type).icon)" />
                </el-icon>
              </div>
              <span class="group-label">{{ getTypeInfo(g.type).label }}</span>
              <el-tag size="small" round effect="plain" :color="getTypeInfo(g.type).color + '15'" :style="{ color: getTypeInfo(g.type).color, borderColor: getTypeInfo(g.type).color + '40' }">
                {{ g.items.length }}
              </el-tag>
            </div>
            <div class="group-header-right">
              <el-button
                size="small"
                link
                :icon="Plus"
                @click="quickAddInType(g.type)"
                :style="{ color: getTypeInfo(g.type).color }"
              >新增</el-button>
            </div>
          </div>
          <!-- 分组内容：紧凑条目 -->
          <div class="group-items">
            <div
              v-for="item in g.items"
              :key="item.id"
              :class="['group-item', 'status-' + item.status, { pinned: item.pinned }]"
            >
              <span class="gi-dot" :style="{ background: getTypeInfo(item.type).color }"></span>
              <div class="gi-main">
                <div class="gi-title-row">
                  <span class="gi-title" :class="{ done: item.status === 'done' }" :title="item.title">{{ item.title }}</span>
                  <el-tag
                    v-if="item.pinned"
                    type="primary"
                    size="small"
                    effect="dark"
                    round
                    class="gi-pin"
                  >置顶</el-tag>
                </div>
                <div class="gi-sub">
                  <el-tag
                    :type="statusTagType(item.status)"
                    size="small"
                    effect="plain"
                    round
                  >{{ statusLabel(item.status) }}</el-tag>
                  <el-progress
                    v-if="item.status === 'doing'"
                    :percentage="item.progress || 0"
                    :stroke-width="4"
                    class="gi-progress"
                  />
                  <span v-if="item.tags && item.tags.length > 0" class="gi-tags">
                    <span v-for="tag in item.tags" :key="tag" class="gi-tag">#{{ tag }}</span>
                  </span>
                  <span v-if="item.note" class="gi-note" :title="item.note">{{ item.note }}</span>
                </div>
              </div>
              <div class="gi-time">{{ formatTime(item.createTime) }}</div>
              <div class="gi-actions">
                <a
                  v-if="item.linkUrl"
                  :href="item.linkUrl"
                  target="_blank"
                  class="gi-link"
                  title="打开"
                ><el-icon><Link /></el-icon></a>
                <el-dropdown trigger="click" @command="(cmd) => handleCommand(cmd, item)">
                  <el-icon class="gi-more"><MoreFilled /></el-icon>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item :command="'pin'">{{ item.pinned ? '取消置顶' : '置顶' }}</el-dropdown-item>
                      <el-dropdown-item :command="'share'">{{ item.share ? '取消分享' : '分享到首页' }}</el-dropdown-item>
                      <el-dropdown-item :command="'edit'">编辑</el-dropdown-item>
                      <el-dropdown-item :command="'delete'" divided>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 空状态 -->
    <div v-if="filteredList.length === 0" class="empty-state">
      <el-icon class="empty-icon"><Files /></el-icon>
      <div class="empty-text">
        {{ searchKeyword || currentFilter !== 'all' ? '没有找到匹配的收藏' : '还没有收藏任何东西' }}
      </div>
      <div class="empty-sub" v-if="!searchKeyword && currentFilter === 'all'">
        点击右上角 <b>添加收藏</b> 开始记录你的书籍、电影、音乐、名言...
      </div>
      <el-button type="primary" :icon="Plus" @click="openAddDialog">立即添加</el-button>
    </div>

    <!-- ===== 添加/编辑收藏弹窗 ===== -->
    <el-dialog v-model="dialogVisible" :title="isEditing ? '编辑收藏' : '添加收藏'" width="520px" destroy-on-close>
      <el-form :model="form" label-position="top">
        <!-- 类型选择：横向 chip 栏 -->
        <el-form-item label="类型" required>
          <div class="type-chips-wrap">
            <div
              v-for="t in availableTypes"
              :key="t.value"
              :class="['type-chip', { active: form.type === t.value }]"
              :style="form.type === t.value ? {
                borderColor: t.color,
                background: t.color + '15',
                color: t.color,
                boxShadow: '0 0 0 3px ' + t.color + '1a',
              } : {}"
              @click="form.type = t.value"
            >
              <el-icon><component :is="getIconComponent(t.icon)" /></el-icon>
              <span>{{ t.label }}</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="标题" required>
          <el-input v-model="form.title" placeholder="例如：《三体》、盗梦空间、Lofi 歌单..." maxlength="80" show-word-limit />
        </el-form-item>
        <el-form-item label="链接">
          <el-input v-model="form.linkUrl" placeholder="https://...（可选）" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.note" type="textarea" :rows="3" placeholder="简单记点什么..." maxlength="200" show-word-limit />
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="form.tagsInput" placeholder="用逗号或空格分隔，如：科幻, 经典, 治愈" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio value="wish">待看/待读</el-radio>
            <el-radio value="doing">进行中</el-radio>
            <el-radio value="done">已完成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="进度" v-if="form.status === 'doing'">
          <el-slider v-model="form.progress" :max="100" show-input />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.pinned">置顶显示</el-checkbox>
        </el-form-item>
        <el-form-item label="封面图片">
          <div style="display:flex; align-items:center; gap:12px;">
            <el-upload
              :auto-upload="false"
              :show-file-list="false"
              accept="image/*"
              :on-change="(file) => { form.file = file.raw; form.pictureUrl = URL.createObjectURL(file.raw) }"
            >
              <el-button :icon="Upload" size="small">选择图片</el-button>
            </el-upload>
            <el-image v-if="form.pictureUrl" :src="form.pictureUrl" :preview-src-list="[form.pictureUrl]" fit="cover" style="width:64px;height:64px;border-radius:8px;overflow:hidden;">
              <template #error><div style="width:64px;height:64px;background:#f5f7fa;display:flex;align-items:center;justify-content:center;color:#c0c4cc;font-size:12px;">无图</div></template>
            </el-image>
            <span v-else style="color:#909399;font-size:12px;">暂无图片</span>
          </div>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.share">分享到首页（其他用户可见）</el-checkbox>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">{{ isEditing ? '保存' : '添加' }}</el-button>
      </template>
    </el-dialog>

    <!-- ===== 类型管理弹窗 ===== -->
    <el-dialog v-model="typeDialogVisible" title="管理收藏类型" width="520px" destroy-on-close>
      <div class="type-manage-list">
        <div v-for="t in availableTypes" :key="t.value" class="type-manage-item">
          <div class="type-manage-preview" :style="{ background: t.color + '22' }">
            <el-icon :style="{ color: t.color, fontSize: '20px' }">
              <component :is="getIconComponent(t.icon)" />
            </el-icon>
          </div>
          <el-input v-model="t.label" class="type-manage-input" size="small" />
          <el-color-picker v-model="t.color" size="small" />
          <el-button
            size="small"
            link
            :icon="Delete"
            type="danger"
            @click="removeType(t)"
          />
        </div>
        <div v-if="availableTypes.length === 0" class="type-manage-empty">还没有任何类型，添加一个吧</div>
      </div>

      <el-divider content-position="left">添加新类型</el-divider>
      <div class="type-manage-add">
        <el-input v-model="newType.label" placeholder="类型名称（如：播客、漫画、动漫...）" size="small" style="width: 160px;" />
        <el-select v-model="newType.icon" placeholder="图标" size="small" style="width: 120px;">
          <el-option
            v-for="(name, comp) in ICON_LABEL_MAP"
            :key="comp"
            :label="name"
            :value="comp"
          >
            <div style="display:flex;align-items:center;gap:6px;">
              <el-icon><component :is="getIconComponent(comp)" /></el-icon>
              <span>{{ name }}</span>
            </div>
          </el-option>
        </el-select>
        <el-color-picker v-model="newType.color" size="small" />
        <el-button type="primary" size="small" :icon="Plus" @click="addNewType">添加</el-button>
      </div>
      <template #footer>
        <el-button @click="typeDialogVisible = false">完成</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus, Search, Grid, Link, Files, MoreFilled, Position, List, Setting, Delete,
  Reading, Film, Headset, Document, Connection, Star,
  Opportunity, CollectionTag, User, Book, Coffee, Music, Tickets,
  Camera, PictureFilled, MagicStick, Flag, Notebook, Upload, Share
} from '@element-plus/icons-vue'
import ocapi from '@/api/otherCollection'

// ===== 图标常量 =====
const ICON_MAP = {
  Reading, Film, Headset, Document, Connection, Star,
  Opportunity, CollectionTag, User, Book, Coffee, Music, Tickets,
  Camera, MagicStick, Flag, PictureFilled, Notebook,
}
const ICON_LABEL_MAP = {
  Reading: '书', Film: '电影', Headset: '耳机', Document: '文档',
  Connection: '链接', Star: '星', Opportunity: '灯泡', CollectionTag: '标签',
  User: '人', Book: '书简', Coffee: '咖啡', Music: '音符', Tickets: '票',
  Camera: '相机', MagicStick: '魔法棒', Flag: '旗', PictureFilled: '图', Notebook: '笔记',
}

// 首次进入的示例类型（非锁定，用户可自由删除）
const SEED_TYPES = [
  { value: 'book',    label: '书籍', icon: 'Reading',       color: '#6366f1' },
  { value: 'movie',   label: '电影', icon: 'Film',          color: '#ef4444' },
  { value: 'music',   label: '音乐', icon: 'Headset',       color: '#ec4899' },
  { value: 'quote',   label: '名言', icon: 'Star',          color: '#f59e0b' },
  { value: 'idea',    label: '灵感', icon: 'Opportunity',   color: '#84cc16' },
  { value: 'person',  label: '人物', icon: 'User',          color: '#06b6d4' },
  { value: 'article', label: '文章', icon: 'Document',      color: '#3b82f6' },
  { value: 'tool',    label: '工具', icon: 'Connection',    color: '#14b8a6' },
  { value: 'other',   label: '其他', icon: 'CollectionTag',  color: '#64748b' },
]

const STATUS_LABEL = { wish: '待看', doing: '进行中', done: '已完成' }
const STATUS_TAG = { wish: 'info', doing: 'warning', done: 'success' }

// ===== 按当前用户生成独立的 storage key =====
const getUserKeys = function() {
  const uid = localStorage.getItem('userId') || 'default'
  return {
    listKey: `other_collections_${uid}`,
    typesKey: `other_collections_types_${uid}`,
  }
}

export default {
  name: 'OtherDimensions',
  components: {
    Plus, Search, Grid, Link, Files, MoreFilled, Position, List, Setting, Delete,
    Reading, Film, Headset, Document, Connection, Star,
    Opportunity, CollectionTag, User, Upload, Share,
  },
  setup() {
    const list = ref([])
    const types = ref([])
    const searchKeyword = ref('')
    const currentFilter = ref('all')
    const viewMode = ref('card')
    const currentPage = ref(1)
    const pageSize = ref(12)
    const dialogVisible = ref(false)
    const typeDialogVisible = ref(false)
    const isEditing = ref(false)
    const editingId = ref(null)

    const form = reactive({
      type: 'book', title: '', linkUrl: '', note: '',
      tagsInput: '', status: 'wish', progress: 0, pinned: false, share: false, file: null, pictureUrl: '',
    })
    const newType = reactive({ label: '', icon: 'Star', color: '#3b82f6' })

    // ===== 工具 =====
    const getIconComponent = function(name) {
      return ICON_MAP[name] || Star
    }
    const genId = function() {
      return 'c_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
    }

    // ===== 类型持久化（按用户隔离） =====
    const loadTypes = async function() {
      try {
        const res = await ocapi.listTypes()
        if (res.successful && res.resultValue && res.resultValue.length > 0) {
          types.value = res.resultValue.map(t => ({ ...t, value: t.typeValue || t.value }))
        } else {
          // 首次：创建示例类型
          types.value = SEED_TYPES.map(t => ({ ...t }))
          // 批量创建
          for (const t of SEED_TYPES) {
            try { await ocapi.addType(t) } catch(e) {}
          }
        }
      } catch (e) {
        types.value = SEED_TYPES.map(t => ({ ...t }))
      }
    }


    const addNewType = async function() {
      const label = newType.label.trim()
      if (!label) { ElMessage.warning('请填写类型名称'); return }
      const value = 't_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 4)
      const payload = { typeValue: value, label, icon: newType.icon, color: newType.color, sort: types.value.length }
      try {
        const res = await ocapi.addType(payload)
        if (res.successful) {
          types.value.push({ ...payload, value: payload.typeValue, id: res.resultValue?.id })
          newType.label = ''
          ElMessage.success('已添加类型')
        }
      } catch(e) {
        // 不阻塞前端
        types.value.push({ ...payload, value: payload.typeValue })
        newType.label = ''
        ElMessage.success('已添加类型（离线）')
      }
    }
    const removeType = function(t) {
      if (getTypeCount(t.value) > 0) {
        ElMessageBox.confirm(
          `「${t.label}」下还有 ${getTypeCount(t.value)} 条收藏，确定要把它们一起删除吗？`,
          '确认删除类型',
          { type: 'warning', confirmButtonText: '全部删除', cancelButtonText: '取消' }
        ).then(() => {
          // 删类型 + 类型下所有收藏
          list.value = list.value.filter(i => i.type !== t.value)
          doRemoveType(t)
          ElMessage.success('已删除')
        }).catch(() => {})
        return
      }
      doRemoveType(t)
      ElMessage.success('已删除类型')
    }
    const doRemoveType = async function(t) {
      try { await ocapi.deleteType(t.id || t.typeValue) } catch(e) {}
      const idx = types.value.findIndex(x => x.value === t.value)
      if (idx > -1) types.value.splice(idx, 1)
      if (currentFilter.value === t.value) currentFilter.value = 'all'
      if (form.type === t.value && types.value.length > 0) {
        form.type = types.value[0].value
      } else if (types.value.length === 0) {
        form.type = ''
      }
    }

    const loadData = async function() {
      try {
        const res = await ocapi.list()
        if (res.successful && res.resultValue) {
          // 后端 tags 是 JSON 字符串，转成数组
          list.value = res.resultValue.map(i => {
            let parsedTags = []
            try { parsedTags = i.tags ? JSON.parse(i.tags) : [] } catch(e) { parsedTags = [] }
            return { ...i, tags: parsedTags, type: i.typeValue || i.type }
          })
        } else {
          seedDemoData()
        }
      } catch (e) {
        seedDemoData()
      }
    }

    const seedDemoData = function() {
      const now = Date.now()
      list.value = [
        { id: genId(), type: 'book',  title: '《三体》',           linkUrl: '', note: '刘慈欣经典科幻',          tags: ['科幻','经典'], status: 'doing', progress: 65, pinned: true,  createTime: now - 86400000 * 3 },
        { id: genId(), type: 'movie', title: '盗梦空间',           linkUrl: '', note: '诺兰神作，关于梦的分层',  tags: ['烧脑','悬疑'], status: 'wish',  progress: 0,  pinned: false, createTime: now - 86400000 * 1 },
        { id: genId(), type: 'music', title: 'Lofi Hip Hop Radio', linkUrl: 'https://www.youtube.com/watch?v=jfKfPfyJRdk', note: '学习背景音', tags: ['BGM','学习'], status: 'wish', progress: 0, pinned: false, createTime: now - 86400000 * 2 },
        { id: genId(), type: 'quote', title: '"给岁月以文明"',     linkUrl: '', note: '—— 葛吉恩 《三体》', tags: ['名言','科幻'], status: 'done', progress: 100, pinned: false, createTime: now - 86400000 * 5 },
      ]
      persist()
    }
    

    // ===== 计算属性 =====
    const availableTypes = computed(() => types.value)

    const filteredList = computed(() => {
      let arr = [...list.value]
      if (currentFilter.value !== 'all') {
        arr = arr.filter(i => i.type === currentFilter.value)
      }
      if (searchKeyword.value.trim()) {
        const kw = searchKeyword.value.trim().toLowerCase()
        arr = arr.filter(i =>
          i.title.toLowerCase().includes(kw) ||
          (i.note && i.note.toLowerCase().includes(kw)) ||
          (i.tags && i.tags.some(t => t.toLowerCase().includes(kw)))
        )
      }
      arr.sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
        return b.createTime - a.createTime
      })
      return arr
    })

    // 分页后的列表（卡片/列表视图用）
    const paginatedList = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      return filteredList.value.slice(start, start + pageSize.value)
    })

    // 筛选/搜索变化时回到第 1 页
    watch([currentFilter, searchKeyword], () => { currentPage.value = 1 })
    // 删除后如果当前页空了，自动退到上一页
    watch(filteredList, () => {
      const maxPage = Math.max(1, Math.ceil(filteredList.value.length / pageSize.value))
      if (currentPage.value > maxPage) currentPage.value = maxPage
    }, { flush: 'post' })
    // 按类型分组（分组视图用）
    const groupedList = computed(() => {
      const bucket = {}
      filteredList.value.forEach(item => {
        if (!bucket[item.type]) bucket[item.type] = []
        bucket[item.type].push(item)
      })
      // 按类型在 availableTypes 里的顺序排，保持用户自定义顺序
      const typeOrder = types.value.map(t => t.value)
      return Object.entries(bucket)
        .map(([type, items]) => ({ type, items }))
        .sort((a, b) => {
          const ai = typeOrder.indexOf(a.type)
          const bi = typeOrder.indexOf(b.type)
          return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
        })
    })

    const stats = computed(() => {
      const s = { total: list.value.length, wish: 0, doing: 0, done: 0, pinned: 0 }
      list.value.forEach(i => {
        s[i.status] = (s[i.status] || 0) + 1
        if (i.pinned) s.pinned++
      })
      return s
    })

    // ===== 工具方法 =====
    const getTypeInfo = function(type) {
      return types.value.find(t => t.value === type) || { label: '未知', icon: 'Star', color: '#909399' }
    }
    const getTypeCount = function(type) {
      return list.value.filter(i => i.type === type).length
    }
    const statusLabel = function(s) { return STATUS_LABEL[s] || s }
    const statusTagType = function(s) { return STATUS_TAG[s] || 'info' }
    const statusColor = function(s) {
      return { wish: '#909399', doing: '#e6a23c', done: '#67c23a' }[s] || '#909399'
    }
    const formatTime = function(ts) {
      if (!ts) return ''
      const d = new Date(ts)
      const now = new Date()
      const diff = now - d
      if (diff < 86400000) return '今天 ' + d.toTimeString().slice(0, 5)
      if (diff < 86400000 * 7) return Math.floor(diff / 86400000) + ' 天前'
      return d.toLocaleDateString('zh-CN')
    }
    const parseTags = function(str) {
      if (!str) return []
      return str.split(/[,，\s]+/).map(s => s.trim()).filter(Boolean)
    }
    const listRowClassName = function({ rowIndex }) {
      return rowIndex % 2 === 0 ? 'row-even' : 'row-odd'
    }

    // ===== 弹窗操作 =====
    const resetForm = function() {
      const firstType = types.value[0]?.value || ''
      Object.assign(form, {
        type: firstType, title: '', linkUrl: '', note: '',
        tagsInput: '', status: 'wish', progress: 0, pinned: false,
        share: false, file: null, pictureUrl: '',
      })
    }
    const openAddDialog = function() {
      isEditing.value = false
      editingId.value = null
      resetForm()
      dialogVisible.value = true
    }
    // 分组视图里的「在此类型下新增」快捷入口
    const quickAddInType = function(typeValue) {
      isEditing.value = false
      editingId.value = null
      resetForm()
      form.type = typeValue
      dialogVisible.value = true
    }
    const openTypeDialog = function() {
      newType.label = ''
      newType.icon = 'Star'
      newType.color = '#3b82f6'
      typeDialogVisible.value = true
    }
    const openEditDialog = function(item) {
      isEditing.value = true
      editingId.value = item.id
      Object.assign(form, {
        type: item.type, title: item.title, linkUrl: item.linkUrl || '',
        note: item.note || '', tagsInput: (item.tags || []).join(', '),
        status: item.status, progress: item.progress || 0, pinned: !!item.pinned,
        share: !!item.share, pictureUrl: item.pictureUrl || '', file: null,
      })
      dialogVisible.value = true
    }
    const handleSubmit = async function() {
      if (!form.title.trim()) { ElMessage.warning('请填写标题'); return }
      if (!form.type) { ElMessage.warning('请先添加一个收藏类型'); return }
      const tags = parseTags(form.tagsInput)
      const fd = new FormData()
      if (isEditing.value && editingId.value) fd.append('id', editingId.value)
      fd.append('typeValue', form.type)
      fd.append('title', form.title.trim())
      fd.append('linkUrl', form.linkUrl.trim())
      fd.append('note', form.note.trim())
      fd.append('tags', JSON.stringify(tags))
      fd.append('status', form.status)
      fd.append('progress', form.progress || 0)
      fd.append('pinned', form.pinned ? '1' : '0')
      fd.append('share', form.share ? '1' : '0')
      if (form.file) fd.append('file', form.file)
      try {
        const res = isEditing.value 
          ? await ocapi.edit(fd) 
          : await ocapi.add(fd)
        if (res.successful) {
          if (isEditing.value) {
            const idx = list.value.findIndex(i => i.id === editingId.value)
            if (idx > -1) {
              list.value[idx] = {
                ...list.value[idx],
                type: form.type, title: form.title.trim(),
                linkUrl: form.linkUrl.trim(), note: form.note.trim(),
                tags, status: form.status, progress: form.progress,
                pinned: form.pinned, share: form.share,
                pictureUrl: form.file?.name ? res.resultValue?.pictureUrl || list.value[idx].pictureUrl : list.value[idx].pictureUrl,
              }
            }
            ElMessage.success('已更新')
          } else {
            const newItem = {
              id: res.resultValue?.id || ('c_' + Date.now()),
              type: form.type, title: form.title.trim(),
              linkUrl: form.linkUrl.trim(), note: form.note.trim(),
              tags, status: form.status, progress: form.progress || 0,
              pinned: form.pinned, share: form.share || false,
              pictureUrl: res.resultValue?.pictureUrl || '',
              createTime: new Date().toISOString().replace('T',' ').substring(0,19),
            }
            list.value.unshift(newItem)
            ElMessage.success('已添加')
          }
          dialogVisible.value = false
          resetForm()
        }
      } catch(e) {
        // 离线 fallback
        if (isEditing.value) {
          const idx = list.value.findIndex(i => i.id === editingId.value)
          if (idx > -1) {
            list.value[idx] = {
              ...list.value[idx],
              type: form.type, title: form.title.trim(),
              linkUrl: form.linkUrl.trim(), note: form.note.trim(),
              tags, status: form.status, progress: form.progress,
              pinned: form.pinned, share: form.share,
            }
          }
          ElMessage.success('已更新（离线）')
        } else {
          list.value.unshift({
            id: 'c_' + Date.now().toString(36),
            type: form.type, title: form.title.trim(),
            linkUrl: form.linkUrl.trim(), note: form.note.trim(),
            tags, status: form.status, progress: form.progress || 0,
            pinned: form.pinned, share: form.share || false,
            createTime: new Date().toISOString().replace('T',' ').substring(0,19),
          })
          ElMessage.success('已添加（离线）')
        }
        dialogVisible.value = false
        resetForm()
      }
    }
const handleCommand = async function(cmd, item) {
      if (cmd === 'pin') {
        item.pinned = !item.pinned
        try { await ocapi.edit({ id: item.id, pinned: item.pinned ? '1' : '0' }) } catch(e) {}
        ElMessage.success(item.pinned ? '已置顶' : '已取消置顶')
      } else if (cmd === 'share') {
        const newShare = !item.share
        try { await ocapi.toggleShare(item.id, newShare) } catch(e) {}
        item.share = newShare
        ElMessage.success(newShare ? '已分享到首页' : '已取消分享')
      } else if (cmd === 'edit') {
        openEditDialog(item)
      } else if (cmd === 'delete') {
        ElMessageBox.confirm(`确定删除「${item.title}」吗？`, '确认删除', {
          type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消',
        }).then(async () => {
          try { await ocapi.delete(item.id) } catch(e) {}
          list.value = list.value.filter(i => i.id !== item.id)
          ElMessage.success('已删除')
        }).catch(() => {})
      }
    }
onMounted(() => {
      loadTypes()
      loadData()
    })

    return {
      ICON_LABEL_MAP,
      list, types, filteredList, groupedList, paginatedList, stats, viewMode, currentPage, pageSize,
      searchKeyword, currentFilter, availableTypes,
      dialogVisible, typeDialogVisible, isEditing, form, newType,
      loadData, getIconComponent, getTypeInfo, getTypeCount,
      statusLabel, statusTagType, statusColor, formatTime,
      openAddDialog, openEditDialog, openTypeDialog, addNewType, removeType,
      quickAddInType,
      handleSubmit, handleCommand, listRowClassName,
      Plus, Search, Grid, Link, Files, MoreFilled, Position, List, Setting, Delete, CollectionTag, Upload, Share, Star,
    }
  }
}
</script>

<style scoped>
.other-dimensions {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 16px;
  background: var(--theme-bg-middle, #f7f9fc);
  overflow: auto;
  box-sizing: border-box;
}

/* ===== 操作栏 ===== */
.toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.toolbar-left { flex-shrink: 0; }
.toolbar-center { flex: 1; display: flex; justify-content: center; min-width: 200px; }
.toolbar-right { flex-shrink: 0; display: flex; align-items: center; gap: 10px; }

.type-filters {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
}
.type-filter-chip {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  background: var(--theme-bg-card);
  border: 1px solid var(--theme-border-lighter, #ebeef5);
  color: var(--theme-text-secondary, #909399);
  transition: all 0.2s ease;
  white-space: nowrap;
  user-select: none;
}
.type-filter-chip:hover {
  color: var(--theme-primary);
  border-color: var(--theme-primary-light, #e6f3ff);
  background: var(--theme-primary-bg, rgba(0,130,244,0.04));
  transform: translateY(-1px);
}
.type-filter-chip.active {
  background: var(--theme-primary);
  color: #fff;
  border-color: var(--theme-primary);
  box-shadow: 0 3px 10px var(--theme-primary-shadow, rgba(0,130,244,0.35));
}
.type-filter-chip .el-icon { font-size: 14px; }
.chip-count {
  font-size: 11px;
  padding: 0 6px;
  border-radius: 10px;
  background: rgba(0,0,0,0.1);
  min-width: 18px;
  text-align: center;
  font-weight: 600;
}
.type-filter-chip.active .chip-count { background: rgba(255,255,255,0.28); }
.type-filter-chip.manage-chip {
  border-style: dashed;
  color: var(--theme-primary);
}
.type-filter-chip.manage-chip:hover {
  background: var(--theme-primary-bg, rgba(0,130,244,0.08));
  border-color: var(--theme-primary);
}

/* ===== 视图切换 ===== */
.view-toggle {
  display: flex;
  background: var(--theme-bg-card);
  border: 1px solid var(--theme-border-lighter, #ebeef5);
  border-radius: 8px;
  overflow: hidden;
}
.view-btn {
  padding: 6px 10px;
  cursor: pointer;
  color: var(--theme-text-secondary, #909399);
  transition: all 0.2s;
  display: flex;
  align-items: center;
}
.view-btn + .view-btn { border-left: 1px solid var(--theme-border-lighter, #ebeef5); }
.view-btn:hover { color: var(--theme-primary); }
.view-btn.active {
  background: var(--theme-primary);
  color: #fff;
}

/* ===== 统计卡片 ===== */
.stats-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}
.stat-card {
  flex: 1;
  min-width: 100px;
  padding: 12px 16px;
  border-radius: 10px;
  background: var(--theme-bg-card);
  border: 1px solid var(--theme-border-lighter, #ebeef5);
  position: relative;
  overflow: hidden;
  transition: transform 0.2s;
}
.stat-card:hover { transform: translateY(-2px); }
.stat-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 4px; height: 100%;
  border-radius: 0 2px 2px 0;
}
.stat-num { font-size: 22px; font-weight: 700; line-height: 1.2; }
.stat-label { font-size: 12px; color: var(--theme-text-secondary, #909399); margin-top: 2px; }
.stat-total::before { background: var(--theme-primary); }
.stat-total .stat-num { color: var(--theme-primary); }
.stat-wish::before { background: #909399; }
.stat-wish .stat-num { color: #909399; }
.stat-doing::before { background: #e6a23c; }
.stat-doing .stat-num { color: #e6a23c; }
.stat-done::before { background: #67c23a; }
.stat-done .stat-num { color: #67c23a; }
.stat-pinned::before { background: #f56c6c; }
.stat-pinned .stat-num { color: #f56c6c; }

/* ===== 卡片网格 ===== */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}
.collect-card {
  --status-color: #909399;
  position: relative;
  background: var(--theme-bg-card);
  border: 1px solid var(--theme-border-lighter, #ebeef5);
  border-radius: 12px;
  padding: 16px 18px;
  display: flex;
  gap: 14px;
  transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: visible;
  border-left: 3px solid var(--status-color);
}
.collect-card::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 32px;
  background: linear-gradient(180deg, var(--status-color)14 0%, transparent 100%);
  border-radius: 11px 11px 0 0;
  pointer-events: none;
}
.collect-card:hover {
  border-color: var(--status-color);
  box-shadow: 0 10px 28px rgba(0,0,0,0.1), 0 0 0 1px var(--status-color)22;
  transform: translateY(-3px);
}
.pin-badge {
  position: absolute;
  top: -6px; left: 12px;
  width: 22px; height: 22px;
  background: var(--theme-primary);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 12px; z-index: 2;
  box-shadow: 0 2px 6px var(--theme-primary-shadow, rgba(0,130,244,0.35));
}
.card-icon-wrap {
  flex-shrink: 0;
  width: 50px; height: 50px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  position: relative; z-index: 1;
}
.card-img-wrap {
  flex-shrink: 0;
  width: 50px; height: 50px;
  border-radius: 12px;
  overflow: hidden;
  position: relative; z-index: 1;
}
.card-img {
  width: 100%;
  height: 100%;
  display: block;
  cursor: zoom-in;
}
.card-img-fallback {
  width: 50px; height: 50px;
  background: #f5f7fa;
  display: flex; align-items: center; justify-content: center;
  border-radius: 12px;
}
.card-main { flex: 1; min-width: 0; position: relative; z-index: 1; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.card-type-tag { font-size: 12px; padding: 2px 10px; border-radius: 12px; font-weight: 500; letter-spacing: 0.3px; }
.card-more { cursor: pointer; color: var(--theme-text-secondary, #909399); font-size: 16px; padding: 4px; border-radius: 4px; transition: all 0.2s; }
.card-more:hover { color: var(--theme-primary); background: var(--theme-primary-bg, rgba(0,130,244,0.06)); }
.card-title { font-size: 15px; font-weight: 600; color: var(--theme-text-primary); margin-bottom: 4px; line-height: 1.4; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.card-note { font-size: 13px; color: var(--theme-text-regular, #606266); line-height: 1.5; margin-bottom: 6px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.card-progress { margin: 8px 0 4px; }
.card-progress :deep(.el-progress-bar__outer) { border-radius: 10px; }
.card-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px; }
.card-tag { font-size: 11px; color: var(--theme-text-secondary, #909399); background: var(--theme-primary-bg, rgba(0,130,244,0.06)); padding: 1px 9px; border-radius: 10px; }
.card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; }
.card-time { font-size: 11px; color: var(--theme-text-secondary, #909399); }
.card-link { position: absolute; top: 14px; right: 14px; width: 30px; height: 30px; border-radius: 50%; background: var(--theme-primary-bg, rgba(0,130,244,0.06)); color: var(--theme-primary); display: flex; align-items: center; justify-content: center; text-decoration: none; transition: all 0.2s; z-index: 2; }
.card-link:hover { background: var(--theme-primary); color: #fff; transform: scale(1.08); }
.collect-card.done .card-title { text-decoration: line-through; color: var(--theme-text-secondary, #909399); opacity: 0.85; }

/* ===== 列表视图 ===== */
.list-table :deep(.el-table__body tr > td.el-table__cell) { background-color: transparent !important; }
.list-table :deep(.el-table__body tr.row-even > td.el-table__cell) { background-color: var(--theme-primary-bg, rgba(0,130,244,0.08)) !important; }
.list-table :deep(.el-table__body tr.row-odd > td.el-table__cell) { background-color: var(--theme-primary-bg-hover, rgba(0,130,244,0.12)) !important; }
.list-table :deep(.el-table__body tr:hover > td.el-table__cell) { box-shadow: inset 0 0 0 9999px var(--theme-primary-bg-hover, rgba(0,130,244,0.18)) !important; }
.list-title-link { color: var(--theme-primary); text-decoration: none; font-weight: 500; }
.list-title-link:hover { text-decoration: underline; }
.list-tag { font-size: 11px; color: var(--theme-text-secondary, #909399); background: var(--theme-primary-bg, rgba(0,130,244,0.06)); padding: 1px 8px; border-radius: 10px; margin-right: 4px; }
.list-note { color: var(--theme-text-secondary, #909399); font-size: 12px; }
.list-time { color: var(--theme-text-secondary, #909399); font-size: 12px; }

/* ===== 空状态 ===== */
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 20px; color: var(--theme-text-secondary, #909399); }
.empty-icon { font-size: 80px; margin-bottom: 16px; opacity: 0.25; color: var(--theme-primary); }
.empty-text { font-size: 16px; margin-bottom: 8px; color: var(--theme-text-regular, #606266); font-weight: 500; }
.empty-sub { font-size: 13px; margin-bottom: 22px; text-align: center; max-width: 420px; line-height: 1.7; }

/* ===== 添加收藏弹窗里的类型选择：横向 chip 栏 ===== */
.type-chips-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.type-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
  background: var(--theme-bg-middle, #f7f9fc);
  border: 1px solid var(--theme-border-lighter, #ebeef5);
  color: var(--theme-text-regular, #606266);
  transition: all 0.2s ease;
  user-select: none;
  font-weight: 500;
}
.type-chip .el-icon { font-size: 14px; }
.type-chip:hover {
  transform: translateY(-1px);
  border-color: var(--theme-border, #dcdfe6);
  background: var(--theme-bg-card);
}
.type-chip.active {
  font-weight: 600;
  border-width: 1.5px;
  transform: translateY(-1px);
}

/* ===== 类型管理弹窗 ===== */
.type-manage-list { max-height: 340px; overflow-y: auto; padding-right: 4px; }
.type-manage-item { display: flex; align-items: center; gap: 10px; padding: 8px 4px; border-bottom: 1px dashed var(--theme-border-lighter, #ebeef5); }
.type-manage-item:last-child { border-bottom: none; }
.type-manage-preview { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.type-manage-input { flex: 1; }
.type-manage-empty { text-align: center; color: var(--theme-text-secondary, #909399); padding: 40px 0; font-size: 13px; }
.type-manage-add { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }

/* ===== 分组视图 ===== */
.grouped-view {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.group-section {
  background: var(--theme-bg-card);
  border: 1px solid var(--theme-border-lighter, #ebeef5);
  border-radius: 12px;
  overflow: hidden;
}
.group-header {
  --g-color: var(--theme-primary);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  position: relative;
  background: var(--g-color)08;
  border-bottom: 1px solid var(--theme-border-lighter, #ebeef5);
}
.group-color-bar {
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 4px;
  background: var(--g-color);
}
.group-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}
.group-icon {
  width: 32px; height: 32px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}
.group-label {
  font-size: 15px;
  font-weight: 600;
  color: var(--theme-text-primary);
}
.group-header-right {
  flex-shrink: 0;
}
.group-items {
  padding: 6px 0;
}
.group-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 18px;
  transition: background 0.18s;
}
.group-item:hover {
  background: var(--theme-primary-bg, rgba(0,130,244,0.04));
}
.gi-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  opacity: 0.8;
}
.gi-main {
  flex: 1;
  min-width: 0;
}
.gi-title-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 2px;
}
.gi-title {
  font-size: 13.5px;
  font-weight: 500;
  color: var(--theme-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.gi-title.done {
  text-decoration: line-through;
  color: var(--theme-text-secondary, #909399);
  opacity: 0.75;
}
.gi-pin { flex-shrink: 0; }
.gi-sub {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--theme-text-secondary, #909399);
}
.gi-progress {
  width: 80px;
}
.gi-tags {
  display: inline-flex;
  gap: 3px;
}
.gi-tag {
  font-size: 11px;
  background: var(--theme-primary-bg, rgba(0,130,244,0.06));
  color: var(--theme-text-secondary, #909399);
  padding: 1px 7px;
  border-radius: 8px;
}
.gi-note {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 220px;
}
.gi-time {
  font-size: 11px;
  color: var(--theme-text-secondary, #909399);
  flex-shrink: 0;
  width: 60px;
  text-align: right;
}
.gi-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}
.gi-link {
  width: 26px; height: 26px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: var(--theme-text-secondary, #909399);
  transition: all 0.18s;
  text-decoration: none;
}
.gi-link:hover {
  color: var(--theme-primary);
  background: var(--theme-primary-bg, rgba(0,130,244,0.08));
}
.gi-more {
  cursor: pointer;
  color: var(--theme-text-secondary, #909399);
  font-size: 15px;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.18s;
}
.gi-more:hover {
  color: var(--theme-primary);
  background: var(--theme-primary-bg, rgba(0,130,244,0.08));
}
</style>
