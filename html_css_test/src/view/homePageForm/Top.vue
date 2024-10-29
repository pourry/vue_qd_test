<template>
    <div class="tdiv">
      <div class="leftdiv">
         <div  @click="toHome">欢迎来到次元收藏夹</div>
      </div>
      <div class="middlediv">middle</div>
      <div class="rightdiv">
         <div v-if="haslogin" @click="toFavorites">收藏夹</div>
         <div v-if="haslogin" @click="toUserSelf">我的</div>
         <div  v-if="haslogin" >
           <div class="tchead">
            <div class="tccss" @click="toquite">退出</div>
            <ul  class="tc_li" >
              <li @click="tologin">重新登录</li>
            </ul>
           </div>
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
         //console.log(store.getters.getToken.value);
         //console.log("___",newvalue,"+++",oldvalue)
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

.tchead{
  height:100%;
  width:100%;
  z-index:100;
}
.tccss{
 position:relative;
 height:100%;
 width:100%;
  display: flex; 
  justify-content: center; /*横向*/
  align-items: center;     /*纵向*/
}
.tc_li{
   position: absolute;
   display: none;
   list-style-type: none; /*把前面的点去除*/
   padding: 0;
   margin: 0;
   width:10%;
   text-align:center;
   box-shadow: inset 0 0 10px 5px #e0f5fc;
   overflow: hidden;
   /* 绑定动画名字并且设置持续时间 */
  animation-name: frames;
  animation-duration: 0.5s;
}
@keyframes frames{
  from{
    height: 0%;
  }
  to{
    height: auto;
  }
}
.tc_li li{
  width:100%;
  height:100%;
  list-style: none;
  background-color: rgba(249,255,255,0.5);
  padding: 10px 0 10px 0;
}
.tc_li li:hover{
  box-shadow: inset 0 0 10px 5px #e0f5fc;
}
/*相邻兄弟选择器（+）*/
.tccss:hover + .tc_li{
  display: block;
  box-shadow: inset 0 0 10px 5px #e0f5fc;
}
.tc_li:hover {
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
  height:100%;
  width: 30%;
  display: flex;
  justify-content:space-around;
  align-items: center;     /*纵向*/
}
.rightdiv > div {
   cursor: pointer;
   height:100%;
   width:100%;
   display:flex;
   justify-content: center;
   align-items: center;
   
}
.rightdiv > div:hover {
  box-shadow: inset 0 0 10px 5px #e0f5fc;
   border-radius: 10px;
}

</style>