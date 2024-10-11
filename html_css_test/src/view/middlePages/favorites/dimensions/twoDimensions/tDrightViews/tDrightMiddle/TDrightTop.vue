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
            <el-button type="primary" icon="Search" size="large" v-model="searchTd" @click="tosearch" />
            </div>
        </el-col>
      </el-row>

      <!-- 添加 -->
     <AddDialog :class="tdaddmenushow.css" @toclose="closeaddmenu" :addform="addandeditform" @toadd="toadd" @tosearch="tosearch"></AddDialog>
      <!-- 修改 -->
     <EditDialog :class="tdeditmenushow.css" @toclose="closeeditmenu" :editform="addandeditform" @toedit="toedit" @tosearch="tosearch"></EditDialog>
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
  emits:["toadd", "togetList","toedit","todelete"],
  setup(props,{emit}){
    onMounted(()=>{
    })

    let msgList = reactive(props.msgList);
    let hasselecteds = reactive(props.hasselecteds);
     let searchTd = ref("");

     //添加修改页面的数据展示
     let addandeditform = reactive({"form":{
                                            id:undefined,
                                            name:undefined,
                                            hasend:undefined,
                                            address:undefined,
                                            notes:undefined,
                                            alias:undefined
                                            }
                                    }); 
     //重置
     let resetfrom = function(){
      addandeditform.form = {
                              id:undefined,
                              name:undefined,
                              hasend:undefined,
                              address:undefined,
                              notes:undefined,
                              alias:undefined
                            }
     }
     //赋值
     let setfrom = function(formvalue){
      addandeditform.form = formvalue;
     }
     //添加页面显示隐藏 默认 隐藏样式 -------------------------
     let tdaddmenushow = reactive({
                                  isshow: false,
                                  name:"添加",
                                  css:"tdaddhiddencss"
                                  });
     let totdaddmenushow = function(){
         resetfrom();

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
         if(hasselecteds == undefined ||hasselecteds.list.length<=0 || hasselecteds.list.length>1){
            ElMessage({
              message: '请选择一个进行修改',
              type: 'warning',
            })
            return;
         }
         setfrom(hasselecteds.list[0]);
        //  addandeditform.form.id = hasselecteds.list[0].id;
        //  addandeditform.form.name = hasselecteds.list[0].name;
        //  addandeditform.form.hasend = hasselecteds.list[0].hasend;
        //  addandeditform.form.address = hasselecteds.list[0].address;
        //  addandeditform.form.notes = hasselecteds.list[0].notes;
         
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
          hasselecteds.list.forEach(item => {
            ids.push(item.id);
          });
          if(ids.length <=0){
            return
          }
          emit("todelete",ids,function(res){
            if(res.resultValue){
              ElMessage({
                message: res.resultValue,
                type: 'success',
              })
              tosearch();
            }else{
              ElMessage({
                message: '失败',
                type: 'warning',
              })
            }
          })
          
     }
     //查询按钮
     let tosearch = function(){
        emit("togetList",{"name":searchTd.value})
     }
     //新增
     let toadd = function(paramVale,callback){
      emit("toadd",paramVale,callback)
     }
     //修改
     let toedit = function(paramVale,callback){
      emit("toedit",paramVale,callback)
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
          addandeditform,
          toadd,
          toedit,
          tosearch,
          resetfrom,
          setfrom
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