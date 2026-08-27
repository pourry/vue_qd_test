<template>
    <div class="tdiv">
      <div class="leftdiv">
         <div  @click="toHome">
           <el-icon class="logo-icon"><StarFilled /></el-icon>
           <span>次元收藏夹</span>
         </div>
      </div>
      <div class="middlediv"></div>
      <div class="rightdiv">
         <!-- 主题切换器 -->
         <div class="theme-switcher" @click="togglePanel = !togglePanel">
           <el-icon><Brush /></el-icon>
           <span class="theme-switcher-label">主题</span>
           <ul v-show="togglePanel" class="theme-panel" @click.stop>
             <li
               v-for="t in themeList"
               :key="t.key"
               :class="['theme-item', { active: currentTheme === t.key }]"
               @click="handleChangeTheme(t.key)"
             >
               <span class="theme-dot" :style="{ background: t.color }"></span>
               <span class="theme-name">{{ t.name }}</span>
               <el-icon v-if="currentTheme === t.key"><Check /></el-icon>
             </li>
           </ul>
         </div>

         <div v-if="haslogin" :class="['nav-btn', { active: isActive('/favorites') }]" @click="toFavorites">
          <el-icon><Collection /></el-icon>
          <span>收藏夹</span>
        </div>
        <div v-if="haslogin" :class="['nav-btn', { active: isActive('/userSelf') }]" @click="toUserSelf">
          <el-icon><User /></el-icon>
          <span>我的</span>
        </div>
        <!-- 设置菜单 -->
        <div v-if="haslogin" class="settings-wrapper">
          <div :class="['nav-btn', 'settings-btn', { active: toggleControl }]" @click="toggleControl = !toggleControl">
            <el-icon><Setting /></el-icon>
            <span>设置</span>
          </div>
          <ul v-show="toggleControl" class="settings-menu" @click.stop>
            <li @click="tologin">
              <el-icon><User /></el-icon>
              <span>重新登录</span>
            </li>
            <li class="danger" @click="toquite">
              <el-icon><SwitchButton /></el-icon>
              <span>退出登录</span>
            </li>
          </ul>
        </div>
        <div v-if="!haslogin" class="nav-btn login-btn" @click="tologin">
          <el-icon><User /></el-icon>
          <span>登录</span>
        </div>
      </div>
    </div>
</template>

<script>
import {ref,computed,onMounted,nextTick,watch} from 'vue';
import { useRoute } from 'vue-router';
import router from '@/utils/router'
import store, { THEME_LIST } from '@/utils/store'
export default {
  name: 'Top',
  components: {
  },
  setup() {

    // 获取当前路由
    const route = useRoute()

    // 主题相关
    const togglePanel = ref(false)
    const toggleControl = ref(false)
    const themeList = THEME_LIST
    const currentTheme = computed(() => store.getters.getTheme)

    const handleChangeTheme = (key) => {
      store.dispatch('setTheme', key)
      togglePanel.value = false
    }

    // 判断是否已登录
    let haslogin = ref(false);

    // 判断路由是否激活
    const isActive = (path) => {
      return route.path.startsWith(path)
    }

    watch(()=>store.getters.getToken.value,
         (newvalue, oldvalue)=>{
	          if(newvalue){
              haslogin.value = true;
            }else if(localStorage.getItem("Authorization")){
              haslogin.value = true;
            }else{
            haslogin.value = false;
            }
         },
         {
           deep:true,
           immediate:true
         }
     )
    //退出
    let toquite = function(){
      toggleControl.value = false
      nextTick(()=>{
        haslogin.value = false;
      })
      localStorage.clear();
      store.commit("SETTOKEN",{value: undefined});
      router.push("/home")
    }

    let toHome = function(){
      router.push("/home")
    }
    let toFavorites = function(){
      router.push("/favorites")
    }
    let toUserSelf = function(){
      router.push("/userSelf")
    }
    let tologin = function(){
      toggleControl.value = false
      router.push("/login")
    }


    onMounted(() => {
      
    });


    return {toHome,toFavorites,toUserSelf,tologin,
           haslogin,
           toquite,
           togglePanel,
           toggleControl,
           themeList,
           currentTheme,
           handleChangeTheme,
           isActive}
  }
}</script>

<style scoped>

/* ===== 顶部容器优化 ===== */
.tdiv {
  display: flex;
  height: 100%;
  align-items: center;
  padding: 0 20px;
  gap: 8px;
  max-width: 100%;
  overflow: visible;
  background: var(--theme-bg-top);
  border-bottom: 1px solid var(--theme-border-lighter);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 10;
}

/* ===== 左侧 Logo 区域 ===== */
.leftdiv {
  flex: 0 0 auto;
  display: flex; 
  justify-content: left;
  align-items: center;
  cursor: pointer;
  height: 100%;
  padding-right: 16px;
  position: relative;
}
.leftdiv::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 24px;
  background: linear-gradient(180deg, transparent, var(--theme-border), transparent);
}
.leftdiv > div {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--theme-primary) 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 16px;
  white-space: nowrap;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
}
.leftdiv:hover > div {
  transform: scale(1.02);
}
.logo-icon {
  font-size: 20px;
  color: var(--theme-primary);
  -webkit-text-fill-color: var(--theme-primary);
  filter: drop-shadow(0 2px 6px var(--theme-primary-shadow));
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.leftdiv:hover .logo-icon {
  transform: rotate(-12deg) scale(1.1);
}

/* ===== 中间弹性空间 ===== */
.middlediv {
  flex: 1;
  min-width: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ===== 右侧按钮组 ===== */
.rightdiv {
  height: 100%;
  flex: 0 0 auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
}

/* ===== 统一样式：基础按钮 ===== */
.rightdiv > div,
.nav-btn,
.theme-switcher {
  cursor: pointer;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 16px;
  color: var(--theme-text-regular);
  font-size: 14px;
  border-radius: var(--theme-radius-md);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  position: relative;
  gap: 6px;
  border: 1px solid transparent;
}

/* 悬停状态 - 所有按钮统一 */
.rightdiv > div:hover,
.nav-btn:hover,
.theme-switcher:hover {
  background: var(--theme-bg-hover);
  color: var(--theme-text-primary);
  border-color: var(--theme-border-light);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 点击状态 */
.rightdiv > div:active,
.nav-btn:active,
.theme-switcher:active {
  transform: translateY(0);
  background: var(--theme-bg-active);
}

/* ===== 导航按钮选中状态 ===== */
.nav-btn.active {
  background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-primary-dark) 100%);
  color: #fff;
  box-shadow: 0 4px 16px var(--theme-primary-shadow);
  transform: translateY(-1px);
  border-color: transparent;
}
.nav-btn.active::before {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 3px;
  background: #fff;
  border-radius: 2px 2px 0 0;
  box-shadow: 0 0 8px var(--theme-primary-shadow);
}
.nav-btn.active:hover {
  background: linear-gradient(135deg, var(--theme-primary-dark) 0%, var(--theme-primary) 100%);
  box-shadow: 0 6px 20px var(--theme-primary-shadow);
}

/* ===== 主题切换器（特殊样式） ===== */
.theme-switcher {
  position: relative;
  height: 36px;
}
.theme-switcher-label {
  display: inline;
  font-weight: 500;
}

/* ===== 主题面板 ===== */
.theme-panel {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  padding: 10px;
  min-width: 190px;
  list-style: none;
  background: var(--theme-bg-card);
  border: 1px solid var(--theme-border);
  border-radius: var(--theme-radius-lg);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  z-index: 999;
  animation: fadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top right;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-8px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.theme-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--theme-radius-md);
  cursor: pointer;
  color: var(--theme-text-regular);
  transition: all 0.2s ease;
  font-size: 13px;
}
.theme-item:hover {
  background-color: var(--theme-primary-bg);
  color: var(--theme-primary);
  transform: translateX(2px);
}
.theme-item.active {
  background-color: var(--theme-primary-bg);
  color: var(--theme-primary);
  font-weight: 600;
}
.theme-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 0 2px var(--theme-border-light);
  transition: all 0.2s ease;
}
.theme-item:hover .theme-dot {
  box-shadow: 0 0 0 3px var(--theme-primary-light);
  transform: scale(1.1);
}
.theme-name {
  flex: 1;
}

/* ===== 设置菜单 - 统一风格 ===== */
.settings-wrapper {
  position: relative;
  height: 100%;
}

.settings-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  padding: 10px;
  min-width: 190px;
  list-style: none;
  background: var(--theme-bg-card);
  border: 1px solid var(--theme-border);
  border-radius: var(--theme-radius-lg);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  z-index: 999;
  animation: fadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top right;
}

.settings-menu li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--theme-radius-md);
  cursor: pointer;
  color: var(--theme-text-regular);
  transition: all 0.2s ease;
  font-size: 13px;
}

.settings-menu li:hover {
  background-color: var(--theme-primary-bg);
  color: var(--theme-primary);
  transform: translateX(2px);
}

.settings-menu li.danger {
  color: var(--theme-error, #ff4d4f);
}

.settings-menu li.danger:hover {
  background-color: var(--theme-error-bg, rgba(255, 77, 79, 0.1));
  color: var(--theme-error, #ff4d4f);
}

.settings-menu li + li {
  margin-top: 4px;
  padding-top: 4px;
  border-top: 1px solid var(--theme-border-lighter);
}

.settings-menu li + li:first-of-type {
  border-top: none;
  padding-top: 0;
  margin-top: 0;
}

/* ===== 响应式优化 ===== */
@media (max-width: 768px) {
  .theme-switcher-label,
  .leftdiv::after {
    display: none;
  }
  .leftdiv > div span {
    display: none;
  }
  .logo-icon {
    font-size: 22px;
  }
  .tdiv {
    padding: 0 12px;
    gap: 4px;
  }
  .rightdiv > div,
  .nav-btn {
    padding: 0 12px;
    font-size: 13px;
    height: 34px;
  }
  .theme-switcher {
    padding: 0 10px;
    height: 34px;
  }
}
@media (max-width: 480px) {
  .tdiv {
    padding: 0 8px;
    gap: 2px;
  }
  .leftdiv {
    padding-right: 8px;
  }
  .rightdiv > div,
  .nav-btn,
  .theme-switcher {
    padding: 0 8px;
    font-size: 12px;
    height: 32px;
  }
}

</style>
