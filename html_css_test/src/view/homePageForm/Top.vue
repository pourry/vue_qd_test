<template>
    <div class="tdiv">
      <div class="leftdiv">
         <div  @click="toHome">欢迎来到次元收藏夹</div>
      </div>
      <div class="middlediv">middle</div>
      <div class="rightdiv">
         <div v-if="haslogin" @click="toFavorites">收藏夹</div>
         <div v-if="haslogin" @click="toUserSelf">我的</div>
         <div v-if="haslogin" @click="toquite">
           <ul><li>退出<ul  class="nav-child" ><li>重新登录</li></ul></li>
               
           </ul>
          </div>
         <div v-if="!haslogin" @click="tologin">
          登录
          <!-- <router-link to="login">登录</router-link> -->
        </div>
      </div>
    </div>
</template>

<script>
import {ref,onMounted,nextTick,watch} from 'vue';
import router from '@/utils/router'
import store from '@/utils/store'
export default {
  name: 'Top',
  components: {
  },
  setup() {


    //判断是否已登录
    let haslogin = ref(false);


    watch(()=>store.getters.getToken.value,
         (newvalue, oldvalue)=>{
         console.log("___",newvalue,"+++",oldvalue)
	          if(newvalue){
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
      router.push("/login")
    }


    onMounted(() => {
      
    });


    return {toHome,toFavorites,toUserSelf,tologin,
           haslogin,
           toquite}
  }
}
</script>

<style scoped>
.nav-child{
    position:relative;
    left: 125px;
    top: -0px;
    width: 125px;
    padding-left: 0%;
    list-style: none;
    background-color:darkgoldenrod;
    display: none;
    list-style: none;
    background-color:chocolate;
    
}
 .nav-child>li{
    position: relative;
}

li:hover>.nav-child{
    display: block;
}
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