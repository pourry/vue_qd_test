<template>
  <div class="tdaddstartcss">
     <!-- <div>111</div> -->
     <div class="tdformcss">
           <el-form :model="addform.form" label-position="right" :rules="rules" ref="formofaddref">
                <el-row :gutter="20">
                  <el-col :span="19" >
                    <el-form-item label="名称" prop="name">
                      <el-input v-model="addform.form.name" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label="完结状态" >
                    <el-input v-model="addform.form.hasend" />
                  </el-form-item>
                  </el-col>
                </el-row> 
                <el-row :gutter="20">
                 <el-col :span="19">
                    <el-form-item label="地址（路径）" >
                      <el-input v-model="addform.form.address" />
                    </el-form-item>
                  </el-col>
                </el-row>      
                <el-row :gutter="20">
                 <el-col :span="19">
                    <el-form-item label="别名" >
                      <el-input v-model="addform.form.alias" />
                    </el-form-item>
                  </el-col>
                </el-row>      
                <el-row :gutter="20">
                  <el-col :span="24">
                    <el-form-item label="备注" >
                      <el-input v-model="addform.form.notes" type="textarea"/>
                    </el-form-item>
                  </el-col>
                </el-row>  
                <el-row :gutter="20" justify="end">
                  <el-col :span="5.4">
                    <el-form-item class="buttomcss">
                      <el-button type="primary" @click="toadd()">新增</el-button>
                      <el-button @click="toclosef">关闭</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>  
              </el-form>
  
     </div>
  </div>
</template>

<script>
import {ref,reactive,onMounted} from 'vue'
import animationapi from '@/api/animation'
import { ElMessage } from 'element-plus'

export default {
  name: 'AddDialog',
  components: {
  },
  props:{
     addform:{
        type:Object,
        required: true
     }
  },
  emits: ["toclose","toadd","tosearch"],
  setup(props,{emit}){
     let addform = reactive(props.addform);
      let toclosef = function(){
         emit("toclose")
      }

      let rules = {
        name:[
                {
                  required: true,
                  trigger: 'blur',
                   message: '名称不能为空',
                },
                {
                  min: 2,
                  // max: 255,
                  message: '名称长度必须大于2',
                  trigger: 'blur',
                  informType: 'warning',
                },
              ],
      }

//  标签 ref 名 需要先附null
     let formofaddref = ref(null);

     let toadd =  function() {
          // if (!formEl) return
            formofaddref.value.validate((valid) => {
            if (valid) {
              let animation = addform.form;
              emit("toadd",animation,function(res){
                //有返回值则说明 请求成功了
                if(res.successful){
                ElMessage({
                  message: res.resultValue,
                  type: 'success',
                })
                //关闭
                toclosef();
                emit("tosearch");
              }
              formreset(addform);
              });
            } else {
                  ElMessage({
                    message: '表单验证失败！',
                    type: 'warning',
                  })
            }
          })
        
     }
     //重置表单
     let formreset = function(val){
        val.name=undefined
        val.hasend=undefined
        val.address=undefined
        val.notes=undefined
        val.alias=undefined
     }
  onMounted(()=>{
  })
  return{addform,
         toclosef,
         rules,
         formofaddref,
         formreset,
         toadd}
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