<template>
    <div class='tdrighttopcss'>
      <el-row :gutter="20" style='margin:0;'>
        <el-col :span="6">
           <el-button class="tdaddbut" type="primary" :span="2" size="large" @click="totdaddmenushow">{{tdaddmenushow.name}}</el-button>
           <el-button type="primary" :span="2" size="large" @click="totdeditmenushow">{{tdeditmenushow.name}}</el-button>
           <el-button type="primary" :span="2" size="large" >删除</el-button>
        </el-col>
        <el-col :span="6"></el-col>
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
     <AddDialog :class="tdaddmenushow.css" @toclose="closeaddmenu" ></AddDialog>
      <!-- 修改 -->
     <EditDialog :class="tdeditmenushow.css" @toclose="closeeditmenu" ></EditDialog>
    </div>
</template>

<script>
import {ref,reactive,nextTick} from 'vue'
import AddDialog from '@/view/middlePages/favorites/dimensions/twoDimensions/tDrightViews/tDrightMiddle/tDrightMiddleDialog/AddDialog.vue'
import EditDialog from '@/view/middlePages/favorites/dimensions/twoDimensions/tDrightViews/tDrightMiddle/tDrightMiddleDialog/EditDialog.vue'
export default {
  name: 'TDrightTop',
  components: {
    AddDialog,
    EditDialog
  },
  setup(){
     let searchTd = ref("");
     //添加页面显示隐藏 默认 隐藏样式 -------------------------
     let tdaddmenushow = reactive({
                                  isshow: false,
                                  name:"添加",
                                  css:"tdaddhiddencss"
                                  });
     let totdaddmenushow = function(){
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
     return{
          searchTd,
          tdaddmenushow,
          totdaddmenushow,
          closeaddmenu,
          tdeditmenushow,
          totdeditmenushow,
          closeeditmenu
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