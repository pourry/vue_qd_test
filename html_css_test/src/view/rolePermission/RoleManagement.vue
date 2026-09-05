<template>
  <div class="role-management">
    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索角色名称/编码"
          clearable
          style="width: 220px;"
          @keyup.enter="handleSearch"
          @clear="handleSearch"
        />
        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" :icon="Plus" @click="openCreateDialog">新增角色</el-button>
        <el-button :icon="Refresh" @click="handleRefresh">刷新</el-button>
      </div>
    </div>

    <!-- 角色列表 -->
    <el-table
      class="colorful-table role-table"
      :data="roleList"
      v-loading="loading"
      :row-class-name="rowClassName"
      border
    >
      <el-table-column type="index" label="#" width="55" align="center" />
      <el-table-column prop="roleName" label="角色名称" width="140" />
      <el-table-column prop="roleCode" label="角色编码" width="140" />
      <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
      <el-table-column label="权限数量" width="100">
        <template #default="{ row }">
          <span class="perm-count">{{ row.permissionIds ? row.permissionIds.length : 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内置" width="80">
        <template #default="{ row }">
          <el-tag v-if="row.isBuiltin === 1" type="info" size="small">内置</el-tag>
          <el-tag v-else type="success" size="small">自定义</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="170" />
      <el-table-column label="操作" width="320" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openEditDialog(row)">编辑</el-button>
          <el-button size="small" type="primary" @click="openAssignDialog(row)">分配权限</el-button>
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

    <!-- 新增/编辑角色弹窗 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="isEditing ? '编辑角色' : '新增角色'"
      width="480px"
      @close="resetForm"
    >
      <el-form :model="roleForm" label-width="90px">
        <el-form-item label="角色名称">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input
            v-model="roleForm.roleCode"
            placeholder="唯一标识，如 custom_role"
            :disabled="isEditing && currentRole?.isBuiltin === 1"
          />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="roleForm.description" type="textarea" :rows="3" placeholder="角色描述（可选）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 分配权限弹窗 -->
    <el-dialog
      v-model="assignDialogVisible"
      :title="'分配权限 - ' + (currentRole?.roleName || '')"
      width="620px"
    >
      <div class="assign-tip">勾选该角色可访问的页面（{{ selectedPermissionIds.length }}/{{ totalPermissionCount }} 项已选）</div>
      <div class="assign-groups">
        <div v-for="group in groupedPermissions" :key="group.groupName" class="assign-group">
          <div class="group-title" @click.stop>
            <el-checkbox
              :model-value="isGroupAllChecked(group)"
              :indeterminate="isGroupIndeterminate(group)"
              @change="(val) => toggleGroupAll(group, val)"
              @click.stop
            >
              <span class="group-title-text">{{ group.groupName }}（{{ group.permissions.length }}）</span>
            </el-checkbox>
          </div>
          <div class="group-items">
            <el-checkbox-group v-model="selectedPermissionIds">
              <el-checkbox
                v-for="perm in group.permissions"
                :key="perm.id"
                :value="perm.id"
              >
                {{ perm.permissionName }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="assignDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleAssignSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh, Search } from '@element-plus/icons-vue'
import rolePermissionApi from '@/api/rolePermission'

export default {
  name: 'RoleManagement',
  emits: ['reload'],
  setup(props, { emit }) {
    const loading = ref(false)
    const submitLoading = ref(false)
    const roleList = ref([])
    const permissionList = ref([])

    // 分页状态
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const searchKeyword = ref('')

    // 编辑弹窗
    const editDialogVisible = ref(false)
    const isEditing = ref(false)
    const currentRole = ref(null)
    const roleForm = ref({
      roleName: '',
      roleCode: '',
      description: '',
    })

    // 分配权限弹窗
    const assignDialogVisible = ref(false)
    const selectedPermissionIds = ref([])

    // 按分组显示的权限（来自 getPermissions 全量接口）
    const groupedPermissions = computed(() => {
      const groups = {}
      for (const p of permissionList.value) {
        const g = p.groupName || '其他'
        if (!groups[g]) groups[g] = { groupName: g, permissions: [] }
        groups[g].permissions.push(p)
      }
      return Object.values(groups)
    })

    // 权限总数（用于显示 "x/y 已选"）
    const totalPermissionCount = computed(() => permissionList.value.length)

    // 判断分组是否全选
    const isGroupAllChecked = function(group) {
      if (!group.permissions.length) return false
      return group.permissions.every(p => selectedPermissionIds.value.includes(p.id))
    }
    // 判断分组是否半选
    const isGroupIndeterminate = function(group) {
      const count = group.permissions.filter(p => selectedPermissionIds.value.includes(p.id)).length
      return count > 0 && count < group.permissions.length
    }
    // 切换分组全选/取消全选
    const toggleGroupAll = function(group, checked) {
      const groupIds = group.permissions.map(p => p.id)
      if (checked) {
        // 并集：把分组里的权限全部加进来（去重）
        const set = new Set(selectedPermissionIds.value)
        groupIds.forEach(id => set.add(id))
        selectedPermissionIds.value = Array.from(set)
      } else {
        // 差集：把分组里的权限全部移除
        selectedPermissionIds.value = selectedPermissionIds.value.filter(id => !groupIds.includes(id))
      }
    }

    // 加载角色分页列表
    const loadData = function() {
      loading.value = true
      const params = {
        page: currentPage.value,
        size: pageSize.value,
        keyword: searchKeyword.value || undefined,
      }
      rolePermissionApi.getRoles(params)
        .then(res => {
          if (res.successful) {
            const data = res.resultValue || {}
            roleList.value = data.list || []
            total.value = data.total || 0
          }
        })
        .catch(err => {
          ElMessage.error('加载角色列表失败：' + (err?.message || '未知错误'))
        })
        .finally(() => {
          loading.value = false
        })
    }

    // 搜索（重置到第一页）
    const handleSearch = function() {
      currentPage.value = 1
      loadData()
    }

    // 刷新（清空搜索）
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

    // 加载权限列表（全量，用于分配权限弹窗）
    const loadPermissions = function() {
      rolePermissionApi.getRolesWithPermissions()
        .then(res => {
          // 注意：getRolesWithPermissions 返回的是角色列表，不是权限列表
          // 分配权限时需要调用 getPermissions 全量接口
          return rolePermissionApi.getPermissions()
        })
        .catch(() => {
          return rolePermissionApi.getPermissions()
        })
        .then(res => {
          if (res && res.successful) {
            // 这里 res 可能是 getPermissions 的返回
            const data = res.resultValue
            // 新的分页结构：如果有 list 字段说明是分页返回
            permissionList.value = data?.list || (Array.isArray(data) ? data : [])
          }
        })
        .catch(() => {})
    }

    // 打开新增弹窗
    const openCreateDialog = function() {
      isEditing.value = false
      currentRole.value = null
      roleForm.value = { roleName: '', roleCode: '', description: '' }
      editDialogVisible.value = true
    }

    // 打开编辑弹窗
    const openEditDialog = function(row) {
      isEditing.value = true
      currentRole.value = row
      roleForm.value = {
        id: row.id,
        roleName: row.roleName,
        roleCode: row.roleCode,
        description: row.description,
      }
      editDialogVisible.value = true
    }

    const resetForm = function() {
      roleForm.value = { roleName: '', roleCode: '', description: '' }
    }

    // 提交新增/编辑
    const handleSubmit = function() {
      if (!roleForm.value.roleName) {
        ElMessage.warning('请填写角色名称')
        return
      }
      if (!isEditing.value && !roleForm.value.roleCode) {
        ElMessage.warning('请填写角色编码')
        return
      }
      submitLoading.value = true
      const api = isEditing.value ? rolePermissionApi.updateRole : rolePermissionApi.createRole
      api(roleForm.value)
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

    // 打开分配权限弹窗
    const openAssignDialog = function(row) {
      currentRole.value = row
      selectedPermissionIds.value = []
      assignDialogVisible.value = true

      // 1. 加载全量权限列表（给分组展示用）
      rolePermissionApi.getPermissions({ page: 1, size: 1000 }).then(res => {
        if (res.successful) {
          const data = res.resultValue
          permissionList.value = data?.list || (Array.isArray(data) ? data : [])
        }
      })

      // 2. 调用 detail 接口获取该角色已分配的 permissionIds
      rolePermissionApi.getRoleDetail(row.id).then(res => {
        if (res.successful && res.resultValue) {
          const pids = res.resultValue.permissionIds
          selectedPermissionIds.value = Array.isArray(pids) ? [...pids] : []
        }
      }).catch(() => {
        // detail 失败时回退到 listWithPermissions
        rolePermissionApi.getRolesWithPermissions().then(res => {
          if (res.successful && Array.isArray(res.resultValue)) {
            const matched = res.resultValue.find(r => r.id === row.id)
            const pids = matched?.permissionIds
            selectedPermissionIds.value = Array.isArray(pids) ? [...pids] : []
          }
        })
      })
    }

    // 提交分配权限
    const handleAssignSubmit = function() {
      submitLoading.value = true
      rolePermissionApi.assignPermissions(currentRole.value.id, selectedPermissionIds.value)
        .then(res => {
          if (res.successful) {
            ElMessage.success('分配成功')
            assignDialogVisible.value = false
            loadData()
            emit('reload')
          } else {
            ElMessage.error(res?.resultNote || '分配失败')
          }
        })
        .catch(err => {
          ElMessage.error(err?.response?.data?.resultNote || '分配失败')
        })
        .finally(() => {
          submitLoading.value = false
        })
    }

    // 删除角色
    const handleDelete = function(row) {
      ElMessageBox.confirm(
        `确定要删除角色「${row.roleName}」吗？删除后无法恢复。`,
        '确认删除',
        { type: 'warning', confirmButtonText: '确定删除', cancelButtonText: '取消' }
      )
        .then(() => {
          submitLoading.value = true
          rolePermissionApi.deleteRole(row.id)
            .then(res => {
              if (res.successful) {
                ElMessage.success('删除成功')
                // 如果当前页删空了，回退一页
                if (roleList.value.length === 1 && currentPage.value > 1) {
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
      return rowIndex % 2 === 0 ? 'row-color-even' : 'row-color-odd'
    }

    onMounted(() => {
      loadData()
    })

    return {
      loading, submitLoading, roleList, permissionList, groupedPermissions, totalPermissionCount,
      currentPage, pageSize, total, searchKeyword,
      editDialogVisible, isEditing, currentRole, roleForm,
      assignDialogVisible, selectedPermissionIds,
      loadData, handleSearch, handleRefresh, handleSizeChange, handleCurrentChange,
      openCreateDialog, openEditDialog, resetForm, handleSubmit,
      openAssignDialog, handleAssignSubmit, handleDelete,
      isGroupAllChecked, isGroupIndeterminate, toggleGroupAll,
      rowClassName,
      Plus, Refresh, Search,
    }
  }
}
</script>

<style scoped>
.role-management {
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

.perm-count {
  font-weight: 600;
  color: var(--theme-primary);
}

.assign-tip {
  margin-bottom: 12px;
  font-size: 13px;
  color: var(--theme-text-secondary);
}

.assign-groups {
  max-height: 400px;
  overflow-y: auto;
}

.assign-group {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--theme-border-lighter);
}

.assign-group:last-child {
  border-bottom: none;
}

.group-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
  color: var(--theme-text-primary);
  display: flex;
  align-items: center;
  gap: 6px;
}

.group-title-text {
  font-weight: inherit;
  font-size: inherit;
  color: inherit;
}

.group-items {
  padding-left: 4px;
}

.group-items :deep(.el-checkbox) {
  margin-right: 12px;
  margin-bottom: 6px;
}

/* ===== 角色表格主题色条纹 ===== */
.role-table :deep(.el-table__body tr > td.el-table__cell) {
  background-color: transparent !important;
}
.role-table :deep(.el-table__body tr.row-color-even > td.el-table__cell) {
  background-color: var(--theme-primary-bg, rgba(0,130,244,0.08)) !important;
}
.role-table :deep(.el-table__body tr.row-color-odd > td.el-table__cell) {
  background-color: var(--theme-primary-bg-hover, rgba(0,130,244,0.12)) !important;
}
.role-table :deep(.el-table__body tr:hover > td.el-table__cell) {
  box-shadow: inset 0 0 0 9999px var(--theme-primary-bg-hover, rgba(0,130,244,0.18)) !important;
}
</style>
