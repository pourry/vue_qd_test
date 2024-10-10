<template>
    <div class='tdrightcss'>
         <div class='tdtopcss'>
           <TDrightTop :msgList="msgList.list" :hasselecteds="hasselecteds" @toadd="toadd"  @togetList="togetList" @toedit="toedit" @todelete="todelete"></TDrightTop>
         </div>
         <div class='tdmiddlecss'>
           <!-- 中部 -->
           <Tdrightmiddle :msgList="msgList" :hasselecteds="hasselecteds" @togetList="togetList"></Tdrightmiddle>
         </div>
         <div class='tdbottomcss'>
            <TDrightBottom></TDrightBottom>
         </div>
    </div>
</template>

<script>
import Tdrightmiddle from '@/view/middlePages/favorites/dimensions/twoDimensions/tDrightViews/tDrightMiddle/TDrightMiddle.vue'
import TDrightBottom from '@/view/middlePages/favorites/dimensions/twoDimensions/tDrightViews/tDrightMiddle/TDrightBottom.vue'
import TDrightTop from '@/view/middlePages/favorites/dimensions/twoDimensions/tDrightViews/tDrightMiddle/TDrightTop.vue'

import {ElMessage} from 'element-plus'
import {ref,onMounted, reactive} from 'vue'
export default {
  name: 'Animation',
  components: {
    Tdrightmiddle,
    TDrightBottom,
    TDrightTop
  },
  props:{

  },
  emits:["toadd","togetList","toedit","todelete"],
  setup(props,{emit}){
   let toadd =  function(paramVale,addcallback){
      emit("toadd",{"animation":paramVale,addcallback})
   }
   let togetList =  function(paramVal){
      emit("togetList",{"animation":paramVal,listcallback:function(res){
         if(res.successful){
          msgList.list = res.resultValue; 
          //保证列表查询后 所有选中的为未选中
          hasselecteds.list = [];
         }else{
                   ElMessage({
                     message: '失败！',
                     type: 'warning',
                   })
         }}})
   }
   let toedit = function(paramVale,editcallback){
      emit("toedit",{"animation":paramVale,editcallback})
   }
   let todelete = function(paramVale,deletecallback){
      emit("todelete",{"ids":paramVale,deletecallback})
   }


   let msgList = reactive({"list":[]});

      let hasselecteds =reactive({"list":[]});

      onMounted(()=>{
         
      })
      return{msgList,
             hasselecteds,
             toadd,
             togetList,
             toedit,
             todelete}
  }

}
</script>

<style scoped>
.tdrightcss{
   height:100%;
   width:100%;
}
.tdtopcss{
   height:5%;
   width:100%;
}
.tdmiddlecss{
   height:90%;
   width:100%;
}
.tdbottomcss{
   height:5%;
   width:100%;
   background-color: green;
}
</style>