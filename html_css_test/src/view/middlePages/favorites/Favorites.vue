<template>
    <div class="favoritescss">
         <div class="leftdiv">
              <el-menu
                default-active="2"
                class="el-menu-vertical-demo el-menu-css"
                @open="handleOpen"
                @close="handleClose"
                :router="true"
              >
                <el-menu-item index="1" route="/oneDimensions/uRLcollect">
                  <el-icon></el-icon>
                  <span>网址收藏</span>
                </el-menu-item>
                <el-sub-menu index="2" route="/twoDimensions">
                  <template #title>
                    <el-icon><Menu /></el-icon>
                    <span>ACG收藏</span>
                  </template>
                  <el-menu-item index="2-1" route="/twoDimensions/animation">动画</el-menu-item>
                  <el-menu-item index="2-2" route="/twoDimensions/comic">漫画</el-menu-item>
                  <el-menu-item index="2-3" route="/twoDimensions/novel">小说</el-menu-item>
                  <el-menu-item index="2-4" route="/twoDimensions/game">游戏</el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="3" >
                  <template #title>
                    <el-icon><Menu /></el-icon>
                    <span>三次元</span>
                  </template>
                  <el-menu-item index="3-1" route="/tVplay">电视剧</el-menu-item>
                </el-sub-menu>
                <el-menu-item index="4" disabled>
                  <el-icon></el-icon>
                  <span>四次元</span>
                </el-menu-item>
              </el-menu>

        </div>
        <div class="rightdiv">
           <!--收藏夹的路由-->
            <router-view></router-view>
        </div>
      
    </div>
</template>

<script>
import router from '@/utils/router'
export default {
  name: 'Favorites',
  components: {
  },
  setup(){
    const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
} 

  return {handleClose,handleOpen}
  }
}
</script>

<style scoped>
.favoritescss{
   width:100%;
   height:100%;
   display: flex;
}
.leftdiv{
  width: 200px;
  height: 100%;
  overflow: auto;
  background: var(--theme-bg-card);
  border-right: 1px solid var(--theme-border);
  padding: 16px 0;
}
.rightdiv {
  flex: 1;
  height: 100%;
  background: var(--theme-bg-page);
  padding: 16px;
  overflow: auto;
}
::v-deep .el-menu-css{
 overflow: auto;
 height: auto;
}
::v-deep .el-menu {
  background-color: transparent !important;
  height: 100%;
  border-right: none !important;
}
::v-deep .el-menu-item,
::v-deep .el-sub-menu__title {
  color: var(--theme-text-regular);
  border-radius: 6px;
  margin: 2px 8px;
  height: 40px;
  line-height: 40px;
  transition: all 0.2s ease;
}
::v-deep .el-menu-item:hover,
::v-deep .el-sub-menu__title:hover {
  background-color: var(--theme-primary-light) !important;
  color: var(--theme-primary) !important;
}
::v-deep .el-menu-item.is-active {
  background-color: var(--theme-primary) !important;
  color: var(--theme-text-light) !important;
}
::v-deep .el-menu-item.is-active:hover {
  background-color: var(--theme-primary-dark) !important;
}
::v-deep .el-menu .el-menu-item.is-active i{
  color: var(--theme-text-light) !important;
}
::v-deep .el-sub-menu .el-menu-item {
  padding-left: 48px !important;
  min-width: auto !important;
}
::v-deep .el-menu-item .el-icon,
::v-deep .el-sub-menu__title .el-icon {
  margin-right: 8px;
  color: inherit;
}
</style>