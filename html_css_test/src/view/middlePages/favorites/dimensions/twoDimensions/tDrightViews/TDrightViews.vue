<template>
    <div class='tdrightcss'>
         <div class='tdtopcss'>
           <TDrightTop :msgList="msgList.list" :hasendoptions="hasendoptions" :hasselecteds="hasselecteds" @toadd="toadd"  @togetList="togetList" @toedit="toedit" @todelete="todelete" :pagemsg="pagemsg"></TDrightTop>
         </div>
         <div class='tdmiddlecss'>
           <!-- 中部 -->
           <Tdrightmiddle :msgList="msgList" :hasendoptions="hasendoptions" :hasselecteds="hasselecteds" @togetList="togetList" :pagemsg="pagemsg"></Tdrightmiddle>
         </div>
         <!-- 底部 -->
         <div class='tdbottomcss'>
            <TDrightBottom @togetList="togetList" :pagemsg="pagemsg"></TDrightBottom>
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
   let hasendoptions = reactive([
      {
        "label":"完结",
        "value":"end"
      },
      {
        "label":"连载中",
        "value":"serialize"
      },
      {
        "label":"未开始",
        "value":"beforeStart"
      }
    ]);

   let pagemsg = reactive(
    {
      "animation":{
      name: undefined,
      pageSize:10,
      pageNumber:1
      },
      "msg":{
      pageSize:10,
      currentPage:1,
      total:0,
      currentPage:0
      }
    }
   );
   let toadd =  function(paramVale,addcallback){
      emit("toadd",{paramVale,addcallback})
   }
   let togetList =  function(paramVale){
      emit("togetList",{"paramVale":paramVale,listcallback:function(res){
         if(res.successful){
          msgList.list = res.resultValue.list; 
          for(let i = 0; i<msgList.list.length;i++){
            for(let j =0; j <hasendoptions.length;j++){
               if(msgList.list[i].hasend){
                  if(msgList.list[i].hasend == hasendoptions[j].value){
                     msgList.list[i].hasendLabel = hasendoptions[j].label
                  }
               }

            }
          }
          pagemsg.msg = {
            "pageSize": res.resultValue.pageSize,
            "currentPage":res.resultValue.pageNumber,
            "total":res.resultValue.total
          }
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
      emit("toedit",{"paramVale":paramVale,editcallback})
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
             todelete,
             pagemsg,
             hasendoptions}
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
}
</style>