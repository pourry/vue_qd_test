<template>
    <div class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3 class="footer-title">次元收藏夹</h3>
          <p class="footer-desc">欢迎来到次元收藏夹，这里是你收藏网址、动画、漫画、小说、游戏的专属空间。</p>
        </div>
        <div class="footer-section">
          <h4 class="footer-subtitle">快速链接</h4>
          <div class="footer-links">
            <a href="#" class="footer-link">首页</a>
            <a href="#" class="footer-link">关于我们</a>
            <a href="#" class="footer-link">收藏夹</a>
            <a href="#" class="footer-link">我的</a>
          </div>
        </div>
        <div class="footer-section">
          <h4 class="footer-subtitle">联系方式</h4>
          <p class="footer-info">邮箱：example@example.com</p>
          <p class="footer-info">电话：123-456-7890</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>备案号：浙ICP备12345678号-1</p>
        <p>版权所有 © 2024 次元收藏夹</p>
      </div>
    </div>
</template>

<script setup lang="ts">
function handleClick(): void {
  console.log('clicked');
}
</script>

<style scoped>
.footer {
  width: 100%;
  background: linear-gradient(180deg, var(--theme-bg-bottom) 0%, rgba(0, 0, 0, 0.85) 100%);
  color: var(--theme-text-light);
  padding: 16px 20px;
  box-sizing: border-box;
  position: relative;
}
.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, 
    var(--theme-primary) 0%, 
    var(--theme-primary-light) 50%, 
    var(--theme-primary) 100%);
  opacity: 0.6;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.footer-section {
  flex: 1;
  max-width: 300px;
}

.footer-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 6px 0;
  color: var(--theme-text-light);
  letter-spacing: 0.5px;
}

.footer-subtitle {
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 6px 0;
  color: rgba(255, 255, 255, 0.85);
  position: relative;
  padding-left: 12px;
}
.footer-subtitle::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 12px;
  background: var(--theme-primary);
  border-radius: 2px;
}

.footer-desc {
  font-size: 12px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.65);
  margin: 0;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
}

.footer-link {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  transition: all 0.2s ease;
  padding: 2px 4px;
  border-radius: var(--theme-radius-sm);
}

.footer-link:hover {
  color: var(--theme-primary-light);
  background-color: rgba(255, 255, 255, 0.08);
}

.footer-info {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
  margin: 2px 0;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 8px;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: var(--theme-spacing-md);
  }
  .footer-section {
    max-width: 100%;
  }
  .footer-bottom {
    flex-direction: column;
    gap: var(--theme-spacing-xs);
    text-align: center;
  }
}
</style>
