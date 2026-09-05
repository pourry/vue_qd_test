<template>
  <div class="role-permission-page">
    <div class="page-header">
      <h2>角色权限管理</h2>
      <p class="page-desc">管理系统角色、页面权限以及用户角色分配</p>
    </div>

    <!-- Tab 切换 -->
    <div class="tab-bar">
      <div
        v-for="tab in tabs"
        :key="tab.key"
        :class="['tab-item', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >
        <el-icon><component :is="tab.icon" /></el-icon>
        <span>{{ tab.label }}</span>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="tab-content" v-loading="loading">
      <RoleManagement v-if="activeTab === 'role'" @reload="loadAll" />
      <PermissionManagement v-if="activeTab === 'permission'" @reload="loadAll" />
      <UserRoleAssignment v-if="activeTab === 'user'" @reload="loadAll" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, markRaw } from 'vue'
import { ElMessage } from 'element-plus'
import { User, Lock, UserFilled } from '@element-plus/icons-vue'
import RoleManagement from './RoleManagement.vue'
import PermissionManagement from './PermissionManagement.vue'
import UserRoleAssignment from './UserRoleAssignment.vue'

export default {
  name: 'RolePermissionManagement',
  components: { RoleManagement, PermissionManagement, UserRoleAssignment },
  setup() {
    const loading = ref(false)
    const activeTab = ref('role')

    const tabs = [
      { key: 'role', label: '角色管理', icon: markRaw(User) },
      { key: 'permission', label: '权限管理', icon: markRaw(Lock) },
      { key: 'user', label: '用户角色分配', icon: markRaw(UserFilled) },
    ]

    const loadAll = function() {
      // 子组件各自独立加载，这里保留接口
    }

    onMounted(() => {
      // 页面加载完成
    })

    return { loading, activeTab, tabs, loadAll }
  }
}
</script>

<style scoped>
.role-permission-page {
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-header {
  margin-bottom: 16px;
}
.page-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: var(--theme-text-primary);
  margin: 0 0 6px 0;
}
.page-desc {
  font-size: 13px;
  color: var(--theme-text-secondary);
  margin: 0;
}

.tab-bar {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--theme-border-lighter);
  padding-bottom: 0;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  cursor: pointer;
  font-size: 14px;
  color: var(--theme-text-secondary);
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  margin-bottom: -1px;
}

.tab-item:hover {
  color: var(--theme-primary);
}

.tab-item.active {
  color: var(--theme-primary);
  border-bottom-color: var(--theme-primary);
  font-weight: 500;
}

.tab-content {
  flex: 1;
  overflow-y: auto;
  min-height: 400px;
}
</style>
