<template>
  <div class="app-container">
    <router-view/>
  </div>
</template>

<script >
export default {
  name: 'App',
  components: {
  }
}
</script>

<style>
/* ===== 全局基础样式 ===== */
html {
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: var(--theme-text-primary);
  background-color: var(--theme-bg-page);
  transition: background-color 0.3s ease, color 0.3s ease;
  min-height: 100vh;
}

.app-container {
  height: 100vh;
  width: 100%;
  background-color: var(--theme-bg-page);
}

#app {
  height: 100%;
  color: var(--theme-text-primary);
  background-color: var(--theme-bg-page);
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* ===== 全局滚动条（主题感知） ===== */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}
::-webkit-scrollbar-thumb {
    background-color: var(--theme-border);
    border-radius: var(--theme-radius-full);
    transition: background-color 0.2s;
}
::-webkit-scrollbar-thumb:hover {
    background-color: var(--theme-primary);
}
::-webkit-scrollbar-track {
    border-radius: var(--theme-radius-full);
    background-color: var(--theme-bg-page);
}
::-webkit-scrollbar-track:hover {
    background-color: var(--theme-primary-light);
}

/* ===== 全局通用过渡 ===== */
a, button, .el-button, .el-tag, .el-card, .el-input, .el-select, .el-menu-item {
  transition: all 0.2s ease;
}

/* ===== 全局链接样式 ===== */
a {
  color: var(--theme-text-link);
  text-decoration: none;
  transition: color 0.2s ease;
}
a:hover {
  color: var(--theme-primary-dark);
}

/* ===== 通用卡片样式 ===== */
.card {
  background: var(--theme-bg-card);
  border-radius: var(--theme-radius-lg);
  box-shadow: var(--theme-shadow-card);
  padding: var(--theme-spacing-md);
  transition: box-shadow 0.2s ease;
}
.card:hover {
  box-shadow: var(--theme-shadow-card-hover);
}

/* ===== 通用 hover 效果 ===== */
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: var(--theme-shadow-md);
}

/* ===== Element Plus 全局覆盖 ===== */
.el-button--primary {
  --el-button-bg-color: var(--theme-primary);
  --el-button-border-color: var(--theme-primary);
  --el-button-hover-bg-color: var(--theme-primary-dark);
  --el-button-hover-border-color: var(--theme-primary-dark);
  --el-button-active-bg-color: var(--theme-primary-dark);
  --el-button-active-border-color: var(--theme-primary-dark);
}

.el-button {
  border-radius: var(--theme-radius-md);
  font-weight: 500;
}

.el-input__wrapper {
  border-radius: var(--theme-radius-md);
}

.el-card {
  border-radius: var(--theme-radius-lg);
  border-color: var(--theme-border);
}

.el-dialog {
  border-radius: var(--theme-radius-xl);
  overflow: hidden;
}
.el-dialog__header {
  border-bottom: 1px solid var(--theme-border);
  padding: var(--theme-spacing-md) var(--theme-spacing-lg);
}
.el-dialog__body {
  padding: var(--theme-spacing-lg);
}

/* ===== 文字选择颜色 ===== */
::selection {
  background-color: var(--theme-primary-light);
  color: var(--theme-primary-dark);
}

/* ===== Element Plus 组件统一圆角 ===== */
.el-select__wrapper,
.el-input-number__decrease,
.el-input-number__increase {
  border-radius: var(--theme-radius-md);
}

.el-tag {
  border-radius: var(--theme-radius-sm);
}

.el-message-box {
  border-radius: var(--theme-radius-lg);
}

.el-dropdown-menu__item {
  border-radius: var(--theme-radius-sm);
  margin: 2px 4px;
  padding: 0 var(--theme-spacing-sm);
}
</style>
