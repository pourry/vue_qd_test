<template>
  <div class="permission-management">
    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索权限名称/编码/路径"
          clearable
          style="width: 240px;"
          @keyup.enter="handleSearch"
          @clear="handleSearch"
        />
        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" :icon="Plus" @click="openCreateDialog">新增权限</el-button>
        <el-button :icon="Refresh" @click="handleRefresh">刷新</el-button>
      </div>
    </div>

    <!-- 权限列表 -->
    <el-table
      class="colorful-table perm-table"
      :data="permissionList"
      v-loading="loading"
      :row-class-name="rowClassName"
      border
    >
      <el-table-column type="index" label="#" width="55" align="center" />
      <el-table-column prop="permissionName" label="权限名称" width="140" />
      <el-table-column prop="permissionCode" label="权限编码" width="170" />
      <el-table-column prop="path" label="路由路径" width="200" show-overflow-tooltip />
      <el-table-column prop="groupName" label="所属分组" width="100" />
      <el-table-column prop="sort" label="排序" width="70" />
      <el-table-column prop="description" label="描述" min-width="180" show-overflow-tooltip />
      <el-table-column label="内置" width="80">
        <template #default="{ row }">
          <el-tag v-if="row.isBuiltin === 1" type="info" size="small">内置</el-tag>
          <el-tag v-else type="success" size="small">自定义</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openEditDialog(row)">编辑</el-button>
          <el-button
            size="small"
            type="danger"
            :disabled="row.isBuiltin === 1"
            @click="handleDelete(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <div class="pagination-wrapper" v-if="total > 0">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20, 50]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增/编辑权限弹窗 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="isEditing ? '编辑权限' : '新增权限'"
      width="520px"
      @close="resetForm"
    >
      <el-form :model="permForm" label-width="100px">
        <el-form-item label="权限名称">
          <el-input v-model="permForm.permissionName" placeholder="如：动画收藏" />
        </el-form-item>
        <el-form-item label="权限编码">
          <el-input
            v-model="permForm.permissionCode"
            placeholder="如 page:favorites:animation"
            :disabled="isEditing && currentPerm?.isBuiltin === 1"
          />
        </el-form-item>
        <el-form-item label="路由路径">
          <el-input v-model="permForm.path" placeholder="如 /twoDimensions/animation" />
        </el-form-item>
        <el-form-item label="所属分组">
          <el-input v-model="permForm.groupName" placeholder="如：收藏夹、我的、消息中心" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="permForm.sort" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="permForm.description" type="textarea" :rows="2" placeholder="描述（可选）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh, Search } from '@element-plus/icons-vue'
import rolePermissionApi from '@/api/rolePermission'

export default {
  name: 'PermissionManagement',
  emits: ['reload'],
  setup(props, { emit }) {
    const loading = ref(false)
    const submitLoading = ref(false)
    const permissionList = ref([])

    // 分页状态
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const searchKeyword = ref('')

    // 编辑弹窗
    const editDialogVisible = ref(false)
    const isEditing = ref(false)
    const currentPerm = ref(null)
    const permForm = ref({
      permissionName: '',
      permissionCode: '',
      path: '',
      groupName: '',
      sort: 0,
      description: '',
    })

    const loadData = function() {
      loading.value = true
      const params = {
        page: currentPage.value,
        size: pageSize.value,
        keyword: searchKeyword.value || undefined,
      }
      rolePermissionApi.getPermissions(params)
        .then(res => {
          if (res.successful) {
            const data = res.resultValue || {}
            permissionList.value = data.list || []
            total.value = data.total || 0
          }
        })
        .catch(err => {
          ElMessage.error('加载权限列表失败')
        })
        .finally(() => {
          loading.value = false
        })
    }

    const handleSearch = function() {
      currentPage.value = 1
      loadData()
    }

    const handleRefresh = function() {
      searchKeyword.value = ''
      currentPage.value = 1
      loadData()
    }

    const handleSizeChange = function(val) {
      pageSize.value = val
      currentPage.value = 1
      loadData()
    }
    const handleCurrentChange = function(val) {
      currentPage.value = val
      loadData()
    }

    const openCreateDialog = function() {
      isEditing.value = false
      currentPerm.value = null
      permForm.value = { permissionName: '', permissionCode: '', path: '', groupName: '', sort: 0, description: '' }
      editDialogVisible.value = true
    }

    const openEditDialog = function(row) {
      isEditing.value = true
      currentPerm.value = row
      permForm.value = {
        id: row.id,
        permissionName: row.permissionName,
        permissionCode: row.permissionCode,
        path: row.path,
        groupName: row.groupName,
        sort: row.sort ?? 0,
        description: row.description,
      }
      editDialogVisible.value = true
    }

    const resetForm = function() {
      permForm.value = { permissionName: '', permissionCode: '', path: '', groupName: '', sort: 0, description: '' }
    }

    const handleSubmit = function() {
      if (!permForm.value.permissionName) {
        ElMessage.warning('请填写权限名称')
        return
      }
      if (!isEditing.value && !permForm.value.permissionCode) {
        ElMessage.warning('请填写权限编码')
        return
      }
      submitLoading.value = true
      const api = isEditing.value ? rolePermissionApi.updatePermission : rolePermissionApi.createPermission
      api(permForm.value)
        .then(res => {
          if (res.successful) {
            ElMessage.success(isEditing.value ? '更新成功' : '创建成功')
            editDialogVisible.value = false
            loadData()
            emit('reload')
          } else {
            ElMessage.error(res?.resultNote || '操作失败')
          }
        })
        .catch(err => {
          ElMessage.error(err?.response?.data?.resultNote || '操作失败')
        })
        .finally(() => {
          submitLoading.value = false
        })
    }

    const handleDelete = function(row) {
      ElMessageBox.confirm(
        `确定要删除权限「${row.permissionName}」吗？删除后所有角色将失去此权限。`,
        '确认删除',
        { type: 'warning', confirmButtonText: '确定删除', cancelButtonText: '取消' }
      )
        .then(() => {
          submitLoading.value = true
          rolePermissionApi.deletePermission(row.id)
            .then(res => {
              if (res.successful) {
                ElMessage.success('删除成功')
                if (permissionList.value.length === 1 && currentPage.value > 1) {
                  currentPage.value--
                }
                loadData()
                emit('reload')
              } else {
                ElMessage.error(res?.resultNote || '删除失败')
              }
            })
            .catch(err => {
              ElMessage.error(err?.response?.data?.resultNote || '删除失败')
            })
            .finally(() => {
              submitLoading.value = false
            })
        })
        .catch(() => {})
    }

    const rowClassName = function({ rowIndex }) {
      // 相邻行深浅交替，形成柔和条纹
      return rowIndex % 2 === 0 ? 'row-color-even' : 'row-color-odd'
    }

    onMounted(() => {
      loadData()
    })

    return {
      loading, submitLoading, permissionList,
      currentPage, pageSize, total, searchKeyword,
      editDialogVisible, isEditing, currentPerm, permForm,
      loadData, handleSearch, handleRefresh, handleSizeChange, handleCurrentChange,
      openCreateDialog, openEditDialog, resetForm,
      handleSubmit, handleDelete, rowClassName,
      Plus, Refresh, Search,
    }
  }
}
</script>

<style scoped>
.permission-management {
  padding: 0;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.toolbar-left {
  display: flex;
  gap: 8px;
}

.pagination-wrapper {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

/* ===== 主题色条纹表格（仅主题色不同透明度，无额外颜色） ===== */
.perm-table :deep(.el-table__body tr > td.el-table__cell) {
  background-color: transparent !important;
}
.perm-table :deep(.el-table__body tr.row-color-even > td.el-table__cell) {
  background-color: var(--theme-primary-bg, rgba(0,130,244,0.08)) !important;
}
.perm-table :deep(.el-table__body tr.row-color-odd > td.el-table__cell) {
  background-color: var(--theme-primary-bg-hover, rgba(0,130,244,0.12)) !important;
}

/* hover 轻微加深 */
.perm-table :deep(.el-table__body tr:hover > td.el-table__cell) {
  box-shadow: inset 0 0 0 9999px var(--theme-primary-bg-hover, rgba(0,130,244,0.18)) !important;
}
</style>
