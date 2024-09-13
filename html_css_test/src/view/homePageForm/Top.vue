<template>
    <div class="tdiv">
      <div class="leftdiv">
         <div  @click="toHome">欢迎来到次元收藏夹</div>
      </div>
      <div class="middlediv">middle</div>
      <div class="rightdiv">
         <div @click="toFavorites">收藏夹</div>
         <div @click="toUserSelf">我的</div>
         <div v-if="haslogin" @click="toquite">退出</div>
         <div v-if="!haslogin" @click="tologin">
          登录
          <!-- <router-link to="login">登录</router-link> -->
        </div>
      </div>
    </div>
</template>

<script>
import {ref,onMounted,nextTick} from 'vue';
import router from '@/utils/router'
export default {
  name: 'Top',
  components: {
  },
  setup() {
    //判断是否已登录
    let haslogin = ref(false);
    let isloginfunction = function(){
       if(localStorage.getItem("Authorization")){
          haslogin.value = true;
       }else{
          haslogin.value = false;
       }
       
    }
    //退出
    let toquite = function(){
      nextTick(()=>{
        haslogin.value = false;
      })
      localStorage.clear();
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
      router.push("/login")
    }


    onMounted(() => {
      isloginfunction();
    });


    return {toHome,toFavorites,toUserSelf,tologin,
           haslogin,isloginfunction,
           toquite}
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