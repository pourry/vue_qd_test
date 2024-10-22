<template>
 <div class="addurlcss">
             <el-dialog
              v-model="dialogVisible.visible"
              title="新增"
              width="50%"
              :modal="false"
              :lock-scroll="false"
            >
                <el-form :model="form" :rules="rules" ref="addurlTyperef">
                    <el-form-item label="种类名称" prop="typename">
                      <el-input v-model="form.typename" />
                    </el-form-item>

                </el-form>
              <template #footer>
                <span class="dialog-footer">
                  <el-button type="primary" @click="toaddurlType"
                    >保存</el-button
                  >
                  <el-button @click="tocloseAddform">关闭</el-button>
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
  name: 'AddURLTypecollect',
  components: {
  },
  props:{
    addvisible:{
        type:Object,
        required:true
    }
  },
  emits:["getList"],
  setup(props,{emit}){
    let dialogVisible = reactive(props.addvisible);
    //  标签 ref 名 需要先附null
    let addurlTyperef = ref(null);
    let form = reactive({
      typename: undefined
    });
    let resetform = function(){
     form.typename = undefined
    }
    let rules = {
        typename:[
                {
                  required: true,
                  trigger: 'blur',
                   message: '不能为空',
                }
              ],
    }
    let toaddurlType = function(){
      addurlTyperef.value.validate((valid) => {
            if (valid) {
              form.typename = form.typename.trim();
              urlTypeCollectionapi.toadd(form).then(res=>{
                if(res.successful){
                    tocloseAddform();
                    regetList();
                    resetform();
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
    let tocloseAddform = function(){
      dialogVisible.visible = false;
    }
    let regetList = function(){
      emit("getList");
    }
    return{addurlTyperef,dialogVisible,form,rules,toaddurlType,tocloseAddform,regetList,resetform}
  }
}
</script>

<style scoped> 
.addurlcss{
  width:100%;
  height:100%;
}

</style>