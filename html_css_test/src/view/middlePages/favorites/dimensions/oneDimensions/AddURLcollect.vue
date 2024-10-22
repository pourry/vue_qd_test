<template>
 <div class="addurlcss">
            <el-dialog
              v-model="dialogVisible.visible"
              title="新增"
              width="50%"
              :modal="false"
              :lock-scroll="false"
              >
                <el-form :model="form" :rules="rules"  label-width="60px" ref="addurlref">
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
                  <el-button type="primary" @click="toaddurl"
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
    addvisible:{
        type:Object,
        required:true
    },
    urlssurltype:{
      type:Object,
      required:true
    }
  },
  emits:["getList"],
  setup(props,{emit}){

    let dialogVisible = reactive(props.addvisible);

    let addurlref = ref(null)
    let form = reactive({
      "urlname":undefined,
      "url":undefined,
      "ssurltypeid":undefined,
      "notes":undefined
    })
    let resetform = function(){
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
              ],
        notes:[
                {
                  required: true,
                  trigger: 'blur',
                   message: '不能为空',
                }
              ]
    }
    let urlssurltype = reactive(props.urlssurltype);
    let toaddurl = function(){
      addurlref.value.validate((valid) => {
            if (valid) {
              form.ssurltypeid = urlssurltype.ssurltypeid
                urlCollectionapi.toadd(form).then(res=>{
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
                      message: res.resultValue,
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

    return{dialogVisible,addurlref,form,rules,toaddurl,togetList,toclose,urlssurltype}
  }
}
</script>

<style scoped> 
.addurlcss{
  width:100%;
  height:100%;
}

</style>