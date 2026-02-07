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
  /* background-color: red; */
  width:20%;
  height:100%;
  overflow: auto;
  box-shadow: inset 0 0 10px 5px #e0f5fc;
}
.rightdiv {
  width: 80%;
  height: 100%;
  box-shadow: inset 0 0 10px 5px #e0f5fc;
}
::v-deep .el-menu-css{
 overflow: auto;
 height: auto;
}
::v-deep .el-menu {
  background-color: rgba(249,255,255,0.5);
  height: 100%;
}
.el-menu-item.is-active{
}

</style>