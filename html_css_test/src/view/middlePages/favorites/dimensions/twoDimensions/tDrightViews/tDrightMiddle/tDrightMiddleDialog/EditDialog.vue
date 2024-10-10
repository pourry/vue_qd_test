<template>
  <div class="tdaddstartcss">
     <!-- <div>111</div> -->
     <div class="tdformcss">
           <el-form :model="editform.form" label-position="right">
                <el-row :gutter="20">
                  <el-col :span="19" >
                    <el-form-item label="名称" >
                      <el-input v-model="editform.form.name" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label="完结状态" >
                    <el-input v-model="editform.form.hasend" />
                  </el-form-item>
                  </el-col>
                </el-row> 
                <el-row :gutter="20">
                 <el-col :span="19">
                    <el-form-item label="别名" >
                      <el-input v-model="editform.form.alias" />
                    </el-form-item>
                  </el-col>
                </el-row>  
                <el-row :gutter="20">
                 <el-col :span="19">
                    <el-form-item label="地址（路径）" >
                      <el-input v-model="editform.form.address" />
                    </el-form-item>
                  </el-col>
                </el-row>      
                <el-row :gutter="20">
                  <el-col :span="24">
                    <el-form-item label="备注" >
                      <el-input v-model="editform.form.notes" type="textarea"/>
                    </el-form-item>
                  </el-col>
                </el-row>  
                <el-row :gutter="20" justify="end">
                  <el-col :span="5.4">
                    <el-form-item class="buttomcss">
                      <el-button type="primary" @click="toedit">修改</el-button>
                      <el-button @click="toclose">关闭</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>  
              </el-form>
  
     </div>
  </div>
</template>

<script>
import {ref,reactive,onMounted} from 'vue'
import {ElMessage} from 'element-plus'

export default {
  name: 'EditDialog',
  components: {
  },
  props:{
     editform:{
        type:Object,
        required: true
     }
  },
  emits: ["toclose","toedit","tosearch"],
  setup(props,{emit}){
     let editform = reactive(props.editform); 
      let toclose = function(){
         emit("toclose")
      }

      let toedit = function(){
        emit("toedit",editform.form,function(res){
          if(res.successful){
                ElMessage({
                  message: res.resultValue,
                  type: 'success',
                })
                toclose();
                emit("tosearch");
          }else{
                ElMessage({
                  message: res.resultValue,
                  type: 'warning',
                })
          }
        })
      }
  onMounted(()=>{
  })
  return{editform,
         toclose,
         toedit}
  }
}
</script>

<style scoped>
.tdaddstartcss{
  position:absolute;
  top:100%;
  width: 100%;  
  height: auto;
  z-index: 100;
  border-radius: 0 0 10px 10px;
  background-color: rgba(249,255,255,0.99);
  
}
.tdformcss{
  margin-top: 10px;
  height:auto;
  width:100%;
  overflow:auto;
  display:flex;
  justify-content:center;
  align-items:center;
}
.el-form{
  height:100%;
  width:80%;
}

.buttomcss{
}
</style>