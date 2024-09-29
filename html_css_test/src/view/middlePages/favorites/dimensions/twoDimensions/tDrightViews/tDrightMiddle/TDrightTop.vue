<template>
    <div class='tdrighttopcss'>
      <el-row :gutter="20" style='margin:0;'>
        <el-col :span="6">
           <el-button type="primary"  size="large" @click="toshowaddDialog">添加</el-button>
           <el-button type="primary"  size="large" >修改</el-button>
           <el-button type="primary"  size="large" >删除</el-button>
        </el-col>
        <el-col :span="6">2</el-col>
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

    <!--  <AddDialog :addshow="addshow"></AddDialog>-->
        <el-dialog v-model="addshow" title="Shipping address">
        1111
        </el-dialog>
    </div>
</template>

<script>
import {ref} from 'vue'
import AddDialog from '@/view/middlePages/favorites/dimensions/twoDimensions/tDrightViews/tDrightMiddle/tDrightMiddleDialog/AddDialog.vue'
export default {
  name: 'TDrightTop',
  components: {
    AddDialog
  },
  setup(){
     let searchTd = ref("");

     let addshow =  ref(false);
     let toshowaddDialog = function(){
     debugger
         addshow.value = true;
     }

     return{
          searchTd,
          addshow,
          toshowaddDialog
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
  border: solid green 1px;

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
</style>