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
                <el-menu-item index="1"  route="/userSelf/myMsg">
                  <el-icon></el-icon>
                  <span>我的信息</span>
                </el-menu-item>
                <el-menu-item index="2"  route="/userSelf/applyFor" >
                  <el-icon></el-icon>
                  <span>我的申请</span>
                </el-menu-item>
                <el-menu-item index="3"  route="/userSelf/test" >
                  <el-icon></el-icon>
                  <span>代码测试场</span>
                </el-menu-item>
                <el-menu-item index="4"  route="/userSelf/carousel" >
                  <el-icon></el-icon>
                  <span>走马灯控制</span>
                </el-menu-item>
                <el-menu-item index="5"  route="/userSelf/footer" >
                  <el-icon></el-icon>
                  <span>底部内容控制</span>
                </el-menu-item>
                <el-menu-item index="6"  route="/userSelf/basicConfig" >
                  <el-icon></el-icon>
                  <span>基本配置</span>
                </el-menu-item>
                <el-menu-item index="7"  route="/userSelf/totalFeedback" >
                  <el-icon></el-icon>
                  <span>反馈管理</span>
                </el-menu-item>
                <el-menu-item index="8"  route="/userSelf/publishNotification" >
                  <el-icon></el-icon>
                  <span>发布管理</span>
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
export default {
  name: 'UserSelf',
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
::v-deep .el-menu-item .el-icon,
::v-deep .el-sub-menu__title .el-icon {
  margin-right: 8px;
  color: inherit;
}
</style>
