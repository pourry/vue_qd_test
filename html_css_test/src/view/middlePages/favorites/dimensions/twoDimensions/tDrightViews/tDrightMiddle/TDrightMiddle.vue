<template>
    <div class='tdrightmiddlecss'>
      <div class='collectshowcss'>
         <div :class="item.css" @click="tochangeselect(item)" v-for="item in msgList.list" ::key="item.id" >
           <el-image >图片</el-image>
           <span>
              <ul>
                <li>名称:{{item.name}}</li>
                <li>地址:<a href="#">{{item.address}}</a></li>
                <li>更多...</li>
              </ul>
           </span>
         </div>  
        
      </div>

    </div>
</template>

<script>
import {ref,reactive,onMounted,watch} from 'vue'
export default {
  name: 'TDrightMiddle',
  components: {
  },
  props:{
    msgList:{
      type:Object,
      required: true
    },
    hasselecteds:{
      type:Object,
      required: true
    }
  },
  emits:["togetList"],
  setup(props,{emit}){
    
    let hasselected = ref("unselectedcss")
    let msgList = reactive(props.msgList);
    let hasselecteds = reactive(props.hasselecteds);

    let toselectcss = function(){
      if(hasselected.value == "unselectedcss"){
         hasselected.value = "selectedcss";
      }else{
         hasselected.value = "unselectedcss";
      }
    }

    let tochangeselect = function(item){
        for(let i = 0; i< msgList.list.length;i++){
          if(item.id == msgList.list[i].id){
            if(msgList.list[i].css == "unselectedcss"){
              msgList.list[i].css = "selectedcss";
              break;
            }else if(msgList.list[i].css == "selectedcss"){
              msgList.list[i].css = "unselectedcss";
              break;
            }else{
              msgList.list[i].css = "selectedcss";
              break;
            }
          }
        }
        console.log("hasselecteds",hasselecteds)
        for(let i = 0; i< hasselecteds.length;i++){
          if(item.id == hasselecteds[i].id){
            hasselecteds.splice(i,1);
            return;
          }
        }
        hasselecteds.push(item);
        
    }

    //列表查询
    let togetList = function(){
      emit("togetList",{},function(res){
         if(res.successful){
          msgList.list = res.resultValue; 
         }else{
                   ElMessage({
                     message: '失败！',
                     type: 'warning',
                   })
         }})
    }


    onMounted(()=>{
      togetList();
    })

    return{
      hasselected,
      toselectcss,
      msgList,
      hasselecteds,
      tochangeselect,
      togetList
    }
  }
}
</script>

<style scoped>
.tdrightmiddlecss{
   height:100%;
   width:100%;
   display: flex;
   justify-content:center;
   align-items: center;
}
.tdrightmiddlecss >div{
   border:solid red 1px;
   display:flex;
   flex-wrap: wrap;  /*可换行*/
   align-content: flex-start; /*从左到右*/
   justify-content: center;   /* 居中对齐 */
   height:98%;
   width:98%;
   overflow:auto;
   
}

.collectshowcss >div{
   position:relative;    /*absolute（绝对）  如果上级没有定位 时会往上找  最终会以html 为基准*/
   height:25%;
   width:20rem;
   padding: 0.5%;
   margin: 0.5%;
   cursor: pointer;
   
}
.unselectedcss {
   box-shadow: none;
   background: transparent;
}
.selectedcss{
   box-shadow: inset 0 0 100px 5px #e0f5fc;
   background-color: rgba(50,234,63,0.7);
}
.collectshowcss >div:hover {
  box-shadow: inset 0 0 100px 5px #e0f5fc;
}
.collectshowcss >div:active {
  background-color: rgba(50,234,63,0.7);
}
.collectshowcss div>.el-image{
  position:relative;
  height:100%;
  width:100%;
  background-color:rgba(255,255,255,0.5)
}
.collectshowcss div>span{
  position:absolute;
  background-color:red;
  width:50%;
  height:30%;
  right:0%;
  bottom:0%;
}
</style>