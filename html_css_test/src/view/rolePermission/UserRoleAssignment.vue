<template>
  <div class="user-role-assignment">
    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索用户名/昵称"
          clearable
          style="width: 240px;"
          @keyup.enter="handleSearch"
          @clear="handleSearch"
        />
        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button :icon="Refresh" @click="handleRefresh">刷新</el-button>
      </div>
    </div>

    <!-- 用户列表 -->
    <el-table
      class="colorful-table user-table"
      :data="userList"
      v-loading="loading"
      :row-class-name="rowClassName"
      border
    >
      <el-table-column prop="username" label="用户名" width="160" />
      <el-table-column prop="nickName" label="昵称" width="160" />
      <el-table-column label="当前角色" width="200">
        <template #default="{ row }">
          <el-tag v-if="row.roleCode === 'admin'" type="danger" effect="dark">{{ row.roleName }}</el-tag>
          <el-tag v-else-if="row.roleCode === 'user'" type="primary" effect="dark">{{ row.roleName }}</el-tag>
          <el-tag v-else-if="row.roleCode === 'guest'" type="info">{{ row.roleName }}</el-tag>
          <el-tag v-else-if="row.roleName" type="success">{{ row.roleName }}</el-tag>
          <el-tag v-else type="warning">未分配</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="分配角色" width="300" fixed="right">
        <template #default="{ row }">
          <el-select
            v-model="row.selectedRoleId"
            placeholder="选择角色"
            clearable
            size="small"
            style="width: 180px;"
            @change="handleAssign(row)"
          >
            <el-option
              v-for="role in roleList"
              :key="role.id"
              :label="role.roleName"
              :value="role.id"
            />
          </el-select>
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
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh, Search } from '@element-plus/icons-vue'
import rolePermissionApi from '@/api/rolePermission'

export default {
  name: 'UserRoleAssignment',
  emits: ['reload'],
  setup(props, { emit }) {
    const loading = ref(false)
    const searchKeyword = ref('')
    const userList = ref([])
    const roleList = ref([])

    // 分页状态
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)

    const loadData = function() {
      loading.value = true
      const params = {
        page: currentPage.value,
        size: pageSize.value,
        keyword: searchKeyword.value || undefined,
      }
      rolePermissionApi.listUsers(params)
        .then(res => {
          if (res.successful) {
            const data = res.resultValue || {}
            const list = data.list || []
            userList.value = list.map(u => ({
              ...u,
              selectedRoleId: u.roleId || null,
            }))
            total.value = data.total || 0
          }
        })
        .catch(err => {
          ElMessage.error('加载数据失败')
        })
        .finally(() => {
          loading.value = false
        })
    }

    const loadRoles = function() {
      rolePermissionApi.getRoles()
        .then(res => {
          if (res.successful) {
            // 兼容两种返回格式（老的 List 和新的分页结构）
            const data = res.resultValue
            roleList.value = data?.list || (Array.isArray(data) ? data : [])
          }
        })
        .catch(() => {})
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

    const handleAssign = function(row) {
      rolePermissionApi.assignUserRole(row.id, row.selectedRoleId)
        .then(res => {
          if (res.successful) {
            ElMessage.success('分配成功')
            emit('reload')
            loadData()
          } else {
            ElMessage.error(res?.resultNote || '分配失败')
            row.selectedRoleId = row.roleId || null
          }
        })
        .catch(err => {
          ElMessage.error(err?.response?.data?.resultNote || '分配失败')
          row.selectedRoleId = row.roleId || null
        })
    }

    const rowClassName = function({ rowIndex }) {
      return rowIndex % 2 === 0 ? 'row-color-even' : 'row-color-odd'
    }

    onMounted(() => {
      loadData()
      loadRoles()
    })

    return {
      loading, searchKeyword, userList, roleList,
      currentPage, pageSize, total,
      loadData, handleSearch, handleRefresh, handleSizeChange, handleCurrentChange, handleAssign,
      rowClassName,
      Refresh, Search,
    }
  }
}
</script>

<style scoped>
.user-role-assignment {
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

/* ===== 用户表格主题色条纹 ===== */
.user-table :deep(.el-table__body tr > td.el-table__cell) {
  background-color: transparent !important;
}
.user-table :deep(.el-table__body tr.row-color-even > td.el-table__cell) {
  background-color: var(--theme-primary-bg, rgba(0,130,244,0.08)) !important;
}
.user-table :deep(.el-table__body tr.row-color-odd > td.el-table__cell) {
  background-color: var(--theme-primary-bg-hover, rgba(0,130,244,0.12)) !important;
}
.user-table :deep(.el-table__body tr:hover > td.el-table__cell) {
  box-shadow: inset 0 0 0 9999px var(--theme-primary-bg-hover, rgba(0,130,244,0.18)) !important;
}
</style>
