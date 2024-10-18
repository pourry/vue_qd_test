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