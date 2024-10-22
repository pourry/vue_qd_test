<template>
 <div class="addurlcss">
             <el-dialog
              v-model="dialogVisible.visible"
              title="修改"
              width="50%"
              :modal="false"
              :lock-scroll="false"
            >
                <el-form :model="form" :rules="rules" ref="editurlTyperef">
                    <el-form-item label="种类名称" prop="typename">
                      <el-input v-model="form.typename" />
                    </el-form-item>

                </el-form>
              <template #footer>
                <span class="dialog-footer">
                  <el-button type="primary" @click="toediturlType"
                    >保存</el-button
                  >
                  <el-button @click="tocloseEditform">关闭</el-button>
                </span>
              </template>
            </el-dialog>
 </div>
</template>

<script>
import {ref,onMounted,reactive} from 'vue'
import { ElMessage } from 'element-plus'
import urlTypeCollectionapi from '@/api/urlTypeCollection'
export default {
  name: 'EditURLTypecollect',
  components: {
  },
  props:{
    editvisible:{
        type:Object,
        required:true
    },
    editTypeform:{
      type:Object,
      required:true
    }
  },
  emits:["getList"],
  setup(props,{emit}){
    let dialogVisible = reactive(props.editvisible);
    //  标签 ref 名 需要先附null
    let editurlTyperef = ref(null);
    let form = reactive(props.editTypeform)
    let rules = {
        typename:[
                {
                  required: true,
                  trigger: 'blur',
                   message: '不能为空',
                }
              ],
    }
    let toediturlType = function(){
      editurlTyperef.value.validate((valid) => {
            if (valid) {
              form.typename = form.typename.trim();
              urlTypeCollectionapi.toedit(form).then(res=>{
                if(res.successful){
                    tocloseEditform();
                    regetList();
                }else{
                    ElMessage({
                          message: res.resultValue,
                          type: 'warning',
                    })
                }
              })
            }else{
              ElMessage({
                    message: '表单验证失败！',
                    type: 'warning',
                  })
            }
      })
    }
    let tocloseEditform = function(){
      dialogVisible.visible = false;
    }
    let regetList = function(){
      emit("getList");
    }
    return{editurlTyperef,dialogVisible,rules,toediturlType,tocloseEditform,regetList,form}
  }
}
</script>

<style scoped> 
.addurlcss{
  width:100%;
  height:100%;
}

</style>