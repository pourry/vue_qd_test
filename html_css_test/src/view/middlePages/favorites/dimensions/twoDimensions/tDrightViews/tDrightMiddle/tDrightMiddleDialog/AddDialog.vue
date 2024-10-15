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
                <el-row :gutter="20">
                  <el-col :span="19">
                    <el-upload action="#" list-type="picture-card" 
                    :auto-upload="false" 
                    :file-list="fileList"
                    :on-change="filechange"
                    :on-remove="handleRemove"
                    >
                        <el-icon><Plus /></el-icon>

                        <template #file="{file}" class="uploadremcss" >
                          <div >
                            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                            <span class="el-upload-list__item-actions">
                              <span
                                class="el-upload-list__item-preview"
                                @click="handlePictureCardPreview(file)"
                              >
                                <el-icon><zoom-in /></el-icon>
                              </span>
                              <!-- <span
                                class="el-upload-list__item-delete"
                                @click="handleDownload(file)"
                              >
                                <el-icon><Download /></el-icon>
                              </span> -->
                              <span
                                class="el-upload-list__item-delete"
                                @click="handleRemove(file)"
                              >
                                <el-icon><Delete /></el-icon>
                              </span>
                            </span>
                          </div>
                        </template>
                      </el-upload>
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
      <el-dialog v-model="dialogVisibleShowpicture">
        <div > <img w-full :src="dialogImageUrl" alt="Preview Image" class="showimgcss"/></div>
      </el-dialog>
  </div>
</template>

<script>
import {ref,reactive,onMounted} from 'vue'
import animationapi from '@/api/animation'
import { ElMessage } from 'element-plus'
import { UploadProps, UploadUserFile } from 'element-plus'
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
         //清空图片
         let list =document.querySelectorAll("li");
          for (let i = 0; i < list.length; i++) {
            list[i].remove();
          }
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
              let formdata = new FormData();
              let animation = addform.form;
              for(let key in animation){
                if(animation.hasOwnProperty(key)){
                  formdata.append(key,animation[key]);
                }
              }
              let files = fileList.value;
              for(let key in files){
                if(files.hasOwnProperty(key)){
                  formdata.append("file",files[key].raw)
                }
              }
              emit("toadd",formdata,function(res){
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


     //图片处理
     let dialogImageUrl = ref('')
     let dialogVisibleShowpicture = ref(false)
     let fileList =  ref([
     ])
     // 添加图片触发
     let filechange = function(file){
      fileList.value.push(file);
     }
     //图片展示
     let handlePictureCardPreview = function(file,uploadFiles){
      dialogImageUrl.value = file.url
      dialogVisibleShowpicture.value = true
     }
     //下载图片
     let handleDownload = function(file){

     }
     //移除图片
     let handleRemove = function(file){
      for(let i = 0;i<fileList.value.length;i++){
        if(fileList.value[i].uid == file.uid){
          fileList.value.splice(i);
        }
      }
      //获取所有的li标签添加删除元素事件  会造成同vue 其他li标签点击都绑定删除元素
      let list =document.querySelectorAll("li");
				for (let i = 0; i < list.length; i++) {
					(function (i) {
						list[i].onclick = function () {
							list[i].remove();
						}
					})(i);
				}
     }
  onMounted(()=>{
  })
  return{addform,
         toclosef,
         rules,
         formofaddref,
         formreset,
         toadd,
         handlePictureCardPreview,handleDownload,handleRemove,fileList,filechange,dialogVisibleShowpicture,dialogImageUrl}
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
.showimgcss{
  height:100%;
  width:100%;
}
/*用来选择并删除元素用 */
.uploadremcss{

}
</style>