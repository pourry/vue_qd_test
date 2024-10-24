<template>
 <div class="addurlcss">
            <el-dialog
              v-model="dialogVisible.visible"
              title="新增"
              width="50%"
              :modal="false"
              :lock-scroll="false"
              >
                <el-form :model="form" :rules="rules"  label-width="60px" ref="editurlref">
                    <el-form-item label="url名" prop="urlname">
                      <el-input v-model="form.urlname" />
                    </el-form-item>
                    <el-form-item label="url" prop="url">
                      <el-input v-model="form.url" />
                    </el-form-item>
                    <el-form-item label="详情" prop="notes">
                      <el-input v-model="form.notes" type="textarea"/>
                    </el-form-item>
                </el-form>
              <template #footer>
                <span class="dialog-footer">
                  <el-button type="primary" @click="toediturl"
                    >保存</el-button>
                  <el-button @click="toclose">关闭</el-button>
                </span>
              </template>
            </el-dialog>
 </div>
</template>

<script>
import {ref,onMounted,reactive} from 'vue'
import { ElMessage } from 'element-plus'
import urlCollectionapi from '@/api/urlCollection'
export default {
  name: 'AddURLcollect',
  components: {
  },
  props:{
    editvisible:{
        type:Object,
        required:true
    },
    editform:{
      type:Object,
      required:true
    }
  },
  emits:["getList"],
  setup(props,{emit}){

    let dialogVisible = reactive(props.editvisible);

    let editurlref = ref(null)
    let form = reactive(props.editform)
    let resetform = function(){
      form.id = undefined;
      form.urlname = undefined;
      form.url = undefined;
      form.ssurltypeid = undefined;
      form.notes = undefined;
    }
    let rules = {
        urlname:[
                {
                  required: true,
                  trigger: 'blur',
                   message: '不能为空',
                }
              ],
        url:[
                {
                  required: true,
                  trigger: 'blur',
                   message: '不能为空',
                }
              ]
    }
    let toediturl = function(){
      editurlref.value.validate((valid) => {
            if (valid) {
                            if(form.url){
                form.urllogopath = form.url.substring(0,form.url.indexOf("//")+2)+
                                   form.url.substring(form.url.indexOf("//")+2,form.url.length).substring(
                                                                                                0,form.url.substring(form.url.indexOf("//")+2,form.url.length).indexOf("/"))+
                                   "/favicon.ico";
                                   
              }
                urlCollectionapi.toedit(form).then(res=>{
                  if(res.successful){
                    togetList();
                    resetform();
                    toclose();
                  }else{
                      ElMessage({
                            message: res.resultValue,
                            type: 'warning',
                      })
                  }
                })
            }else{
                ElMessage({
                      message: "表单验证失败！",
                      type: 'warning',
                })
            }
      })
    }
    let togetList = function(){
      emit("getList");
    }
    let toclose = function(){
      dialogVisible.visible = false
    }

    return{dialogVisible,editurlref,form,rules,toediturl,togetList,toclose,form}
  }
}
</script>

<style scoped> 
.addurlcss{
  width:100%;
  height:100%;
}

</style>