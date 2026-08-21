<template>
    <div class='tdrightmiddlecss'>
      <div class='collectshowcss'>
         <div :class="item.css" @click="tochangeselect(item)" v-for="item in msgList.list" ::key="item.id" >
                <span class="hasshareurl" v-if="item.share">
                    <el-icon class="hasshareicon">已分享</el-icon>
                </span>
           <el-image class="clickimgcss" :src="item.pictures.length >0 ? item.pictures[0].pictureUrl : undefined"/>
            <el-popover
            :popper-style="{width:'auto'}"
              placement="right-start"
              :title="item.name"
              trigger="hover"
            >
                <template #reference>
                <span >
                    <ul class='animationmsg'>
                      <li>名称:{{item.name}}</li>
                      <li>地址:<a :href="item.address"  target="_blank">{{item.address}}</a></li>
                      <li>完结状态:{{item.hasendLabel}}</li>
                    </ul>
                </span>
                </template>
                    <ul class='animationmsgdetailcss'>
                      <li>名称:{{item.name}}</li>
                      <li>地址:<a :href="item.address"  target="_blank">{{item.address}}</a></li>
                      <li>别名:{{item.alias}}</li>
                      <li>完结状态:{{item.hasendLabel}}</li>
                      <li>备注:{{item.notes}}</li>
                    </ul>
            </el-popover>
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
    },
    pagemsg:{
      type:Object,
      required: true
    },
    hasendoptions:{
      type:Object,
      required: true
    }
  },
  emits:["togetList"],
  setup(props,{emit}){
    
    let hasendoptions = reactive(props.hasendoptions)
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
        console.log("hasselecteds",hasselecteds.list)
        for(let i = 0; i< hasselecteds.list.length;i++){
          
          if(item.id == hasselecteds.list[i].id){
            hasselecteds.list.splice(i,1);
            return;
          }
        }
        hasselecteds.list.push(item);
        
    }


    let pagemsg = reactive(props.pagemsg)
    //列表查询
    let togetList = function(){
      emit("togetList",pagemsg.animation)
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
      togetList,
      pagemsg
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
   background: var(--theme-bg-page);
}
.tdrightmiddlecss >div{
   display:flex;
   flex-wrap: wrap;
   align-content: flex-start;
   justify-content: center;
   height:98%;
   width:98%;
   overflow:auto;

}

.collectshowcss >div{
   position:relative;
   height: auto;
   min-height: 200px;
   width: 200px;
   padding: 0.5%;
   margin: 0.5%;
   cursor: pointer;
   flex: 0 0 auto;
}
.unselectedcss {
   box-shadow: none;
   background: transparent;
}
.selectedcss{
   box-shadow: inset 0 0 100px 5px var(--theme-primary-light);
   background-color: var(--theme-primary-bg-hover);
}
.collectshowcss >div:hover {
  box-shadow: inset 0 0 100px 5px var(--theme-primary-light);
}
.collectshowcss >div:active {
  background-color: var(--theme-primary-bg-hover);
}
.collectshowcss div>.el-image{
  position:relative;
  height:100%;
  min-height: 180px;
  width:100%;
  background-color: var(--theme-bg-middle);
}
.collectshowcss div>span{
  position:absolute;
  background-color: var(--theme-accent-light);
  color: var(--theme-text-primary);
  width:50%;
  height:30%;
  right:0%;
  bottom:0%;
}
.clickimgcss:hover{
  margin-top: -0.5%;
  margin-left: -0.5%;
  height: 101% !important;
  width: 101% !important;
  transition: width 0.4s, height 0.4s, margin-top 0.4s, margin-left 0.4s;
  -webkit-transition: width 0.4s, height 0.4s,  margin-top 0.4s, margin-left 0.4s;
}
.clickimgcss{
}
::v-deep .el-image__inner{
  width: 100%;
  margin-top: 0%;
  margin-left: 0%;
  height: 100%;
  transition: width 0.2s, height 0.2s, margin-top 0.2s, margin-left 0.2s;
  -webkit-transition: width 0.2s, height 0.2s,  margin-top 0.2s, margin-left 0.2s;
}
::v-deep .el-image__inner:hover{
  width: 120%;
  margin-top: -5%;
  margin-left: -5%;
  height: 120%;
  transition: width 0.2s, height 0.2s, margin-top 0.2s, margin-left 0.2s;
  -webkit-transition: width 0.2s, height 0.2s,  margin-top 0.2s, margin-left 0.2s;
}
.animationmsg{
  height:100%;
  width:100%;
  padding: 0px;
  margin: 0px;
}
.animationmsg >li{
  padding: 5px;
  height:20%;
  width:90%;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
.animationmsgdetailcss{
   list-style-type: none;

}
.hasshareurl{
  position:absolute;
  left:0px;
  bottom:0px;
  width:30%;
  height:30%;
  display:flex;
  align-items: center;
  background-color: var(--theme-danger) !important;
  clip-path: polygon(0 0, 0 100%, 50% 100%);
  border-radius: 0 0 0 5px;
  z-index:1;
}
.hasshareicon{
  margin-top: 20%;
  margin-left:3%;
}

</style>

<style>
/*popover 专用*/

.el-popover.el-popper {
  background-color: var(--theme-accent-light) !important;
  color: var(--theme-text-primary);
  border: 1px solid var(--theme-border);
}
.el-popover__title {
 color: var(--theme-text-primary);
 font-weight: 600;
}

.el-popover__content {
  color: var(--theme-text-regular);
}

</style>