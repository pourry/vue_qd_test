<template>
    <div class='tdrighttopcss'>
      <el-row :gutter="20" style='margin:0;'>
        <el-col :span="6">
           <el-button class="tdaddbut" type="primary" :span="2" size="large" @click="totdaddmenushow">{{tdaddmenushow.name}}</el-button>
           <el-button type="primary" :span="2" size="large" @click="totdeditmenushow">{{tdeditmenushow.name}}</el-button>
           <el-button type="primary" :span="2" size="large"   @click="totddel">删除</el-button>
        </el-col>
        <el-col :span="6" style="z-index:-1"></el-col>
        <el-col :span="12">
            <div class="TDserchcss">
              <el-input
                v-model="searchTd"
                class="w-50 m-2"
                size="large"
                placeholder="请输入名称"
                suffix-icon="Search"
                />
            <el-button type="primary" icon="Search" size="large" />
            </div>
        </el-col>
      </el-row>

      <!-- 添加 -->
     <AddDialog :class="tdaddmenushow.css" @toclose="closeaddmenu" :addform="addandeditfrom" @toadd="toadd"></AddDialog>
      <!-- 修改 -->
     <EditDialog :class="tdeditmenushow.css" @toclose="closeeditmenu" :editform="addandeditfrom"></EditDialog>
    </div>
</template>

<script>
import {ref,reactive,nextTick,onMounted} from 'vue'
import { ElMessage } from 'element-plus'
import AddDialog from '@/view/middlePages/favorites/dimensions/twoDimensions/tDrightViews/tDrightMiddle/tDrightMiddleDialog/AddDialog.vue'
import EditDialog from '@/view/middlePages/favorites/dimensions/twoDimensions/tDrightViews/tDrightMiddle/tDrightMiddleDialog/EditDialog.vue'
export default {
  name: 'TDrightTop',
  components: {
    AddDialog,
    EditDialog
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

  },
  emits:["toadd"],
  setup(props,{emit}){
    onMounted(()=>{
    })
    let toadd = function(paramVale,callback){
      emit("toadd",paramVale,callback)
    }
    
    let msgList = reactive(props.msgList);
    let hasselecteds = reactive(props.hasselecteds);
     let searchTd = ref("");

     //添加修改页面的数据展示
     let addandeditfrom = reactive({name:undefined,
                                  hasend:undefined,
                                  address:undefined,
                                  notes:undefined
                                  }); 
     //添加页面显示隐藏 默认 隐藏样式 -------------------------
     let tdaddmenushow = reactive({
                                  isshow: false,
                                  name:"添加",
                                  css:"tdaddhiddencss"
                                  });
     let totdaddmenushow = function(){
         addandeditfrom.name = undefined;
         addandeditfrom.hasend = undefined;
         addandeditfrom.address = undefined;
         addandeditfrom.notes = undefined;

         if(tdaddmenushow.css == "tdaddhiddencss"){
          tdaddmenushow.isshow= true;
          tdaddmenushow.name= "收起";
          tdaddmenushow.css= "tdaddshowcss";

          //当新增时  修改页面关闭
          tdeditmenushow.isshow= false;
          tdeditmenushow.name= "修改";
          tdeditmenushow.css= "tdaddhiddencss";
         }else{
          tdaddmenushow.isshow= false;
          tdaddmenushow.name= "添加";
          tdaddmenushow.css= "tdaddhiddencss";
         }
     }
     //提供给add组件 让其可关闭add组件自己
     let closeaddmenu = function(){
          tdaddmenushow.isshow= false;
          tdaddmenushow.name= "添加";
          tdaddmenushow.css= "tdaddhiddencss";
     }
     //修改页面显示隐藏 默认 隐藏样式 -------------------------
     let tdeditmenushow = reactive({
                                  isshow: false,
                                  name:"修改",
                                  css:"tdaddhiddencss"
                                  });
     let totdeditmenushow = function(){
         if(hasselecteds == undefined ||hasselecteds.length<=0 || hasselecteds.length>1){
            ElMessage({
              message: '请选择一个进行修改',
              type: 'warning',
            })
            return;
         }
         addandeditfrom.name = hasselecteds[0].name;
         addandeditfrom.hasend = hasselecteds[0].hasend;
         addandeditfrom.address = hasselecteds[0].address;
         addandeditfrom.notes = hasselecteds[0].notes;
         
         if(tdeditmenushow.css == "tdaddhiddencss"){
          tdeditmenushow.isshow= true;
          tdeditmenushow.name= "收起";
          tdeditmenushow.css= "tdaddshowcss";

          //当修改时  新增页面关闭
          tdaddmenushow.isshow= false;
          tdaddmenushow.name= "添加";
          tdaddmenushow.css= "tdaddhiddencss";

         }else{
          tdeditmenushow.isshow= false;
          tdeditmenushow.name= "修改";
          tdeditmenushow.css= "tdaddhiddencss";
         }
     }
     //提供给add组件 让其可关闭add组件自己
     let closeeditmenu = function(){
          tdeditmenushow.isshow= false;
          tdeditmenushow.name= "修改";
          tdeditmenushow.css= "tdaddhiddencss";
     }

     //删除按钮
     let totddel = function(){
          //先关闭新增改弹框
          closeaddmenu();
          closeeditmenu();
          let ids = [];
          hasselecteds.forEach(item => {
            ids.push(item.id);
          });
          if(ids.length <=0){
            return
          }
          console.log(ids)
          
     }
     return{
          searchTd,
          tdaddmenushow,
          totdaddmenushow,
          closeaddmenu,
          tdeditmenushow,
          totdeditmenushow,
          closeeditmenu,
          totddel,
          addandeditfrom,
          toadd
        }
  }
}
</script>

<style scoped>
.tdrighttopcss{ 
    width:100%;
    height:100%;
    position:relative;
}
.el-row {
  width:100%;
  position:absolute;
  bottom:10%;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
  /*border: solid green 1px;*/
  display: flex;

}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.TDserchcss{
  padding-left: 30%;
  display: flex;
  gap: 10%; /*网格行与列之间的间隙*/
}

.tdaddhiddencss{
  display: none;
}

.tdaddshowcss{
  display: block;
  
}


</style>