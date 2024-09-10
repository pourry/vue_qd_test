<template>
    <div class="tdiv">
      <div class="leftdiv">
         <div  @click="toHome">欢迎来到次元收藏夹</div>
      </div>
      <div class="middlediv">middle</div>
      <div class="rightdiv">
         <div @click="toFavorites">收藏夹</div>
         <div @click="toUserSelf">我的</div>
         <div>退出</div>
         <div @click="tologin">
          登录
          <!-- <router-link to="login">登录</router-link> -->
        </div>
      </div>
    </div>
</template>

<script>
import router from '../router';

export default {
  name: 'Top',
  components: {
  },
  setup() {
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
      router.push("/login")
    }


    return {toHome,toFavorites,toUserSelf,tologin}
  }
}
</script>

<style scoped>
.tdiv {
  
  display: flex;
}
.leftdiv {
  width: 30%;
  display: flex; 
  justify-content: left; /*横向*/
  align-items: center;     /*纵向*/
  cursor: pointer;
}
.leftdiv > div{
  padding-left: 10%;
}
.middlediv {
  width: 40%;
  display: flex;
  justify-content:space-around;
  align-items: center;     /*纵向*/
}
.rightdiv {
  width: 30%;
  display: flex;
  justify-content:space-around;
  align-items: center;     /*纵向*/
}
.rightdiv > div {
   cursor: pointer;
}

</style>