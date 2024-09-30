<template>
    <div class='tdrightmiddlecss'>
      <div class='collectshowcss'>
         <div :class="item.css" @click="tochangeselect(item)" v-for="item in msgList" ::key="item.id" >
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
import {ref} from 'vue'
export default {
  name: 'TDrightMiddle',
  components: {
  },
  props:{
    msgList:{
      type:Object,
      required: true
    }
  },
  setup(props){
    let hasselected = ref("unselectedcss")
    let msgList = ref(props.msgList);
    let hasselecteds = ref([]);

    let toselectcss = function(){
      if(hasselected.value == "unselectedcss"){
         hasselected.value = "selectedcss";
      }else{
         hasselected.value = "unselectedcss";
      }
    }

    let tochangeselect = function(item){
        for(let i = 0; i< msgList.value.length;i++){
          if(item.id == msgList.value[i].id){
            if(msgList.value[i].css == "unselectedcss"){
              msgList.value[i].css = "selectedcss";
              break;
            }else{
              msgList.value[i].css = "unselectedcss";
              break;
            }
          }
        }
        for(let i = 0; i< hasselecteds.value.length;i++){
          if(item.id == hasselecteds.value[i].id){
            hasselecteds.value.splice(i,1);
            console.log(hasselecteds.value)
            return;
          }
        }
        hasselecteds.value.push(item);
        console.log(hasselecteds.value)
    }

    return{
      hasselected,
      toselectcss,
      msgList,
      hasselecteds,
      tochangeselect
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