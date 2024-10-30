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
                      <el-select v-model="editform.form.hasend" placeholder="请选择">
                      <el-option
                        v-for="item in hasendoptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
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
                <el-row :gutter="20">
                  <el-col :span="24">
                    <el-form-item label="是否公开">
                      <el-switch  v-model="editform.form.share"/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="19">
                    <el-upload action="#" list-type="picture-card" 
                    :auto-upload="false" 
                    :file-list="editform.form.pictures"
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
                      <el-button type="primary" @click="toedit">修改</el-button>
                      <el-button @click="toclose">关闭</el-button>
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
import {ref,reactive,onMounted,watch,nextTick} from 'vue'
import {ElMessage} from 'element-plus'

export default {
  name: 'EditDialog',
  components: {
  },
  props:{
     editform:{
        type:Object,
        required: true
     },
     hasendoptions:{
        type:Object,
        required: true
     }
  },
  emits: ["toclose","toedit","tosearch"],
  setup(props,{emit}){
     let hasendoptions = reactive(props.hasendoptions);
     let editform = reactive(props.editform); 
      let toclose = function(){
         emit("toclose")
      }

      //修改
      let toedit = function(){
        for(let i = 0;i < hasendoptions.length;i++){
            if(hasendoptions[i].value == editform.form.hasend ){
              editform.form.hasendLabel = hasendoptions[i].label;
            }
        }

        let formdata = new FormData();

        let files = editform.form.pictures;
        for(let key in files){
          console.log(key)
          if(files.hasOwnProperty(key)){
            if(!files[key].id){
             formdata.append("file",files[key].raw)
             editform.form.pictures.splice(key)
            }
          }
        }
        
        let animation = editform.form;
        for(let key in animation){
          if(animation.hasOwnProperty(key)){
            if(animation[key] != undefined){
              console.log(typeof animation[key])
              if(typeof animation[key]  === 'object'){
                 formdata.append("object",JSON.stringify(animation[key]));
              }else{
                 formdata.append(key,animation[key]);
              }
              
            }
          }
        }
        emit("toedit",formdata,function(res){
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

           //图片处理
     let dialogImageUrl = ref('')
     let dialogVisibleShowpicture = ref(false)

     // 添加图片触发
     let filechange = function(file){
      editform.form.pictures.push(file);
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
      let fileList = editform.form.pictures;
      for(let i = 0;i<fileList.length;i++){
        if(fileList[i].uid == file.uid){
          fileList.splice(i);
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
  return{editform,
         toclose,
         toedit,
         handlePictureCardPreview,handleDownload,handleRemove,filechange,dialogVisibleShowpicture,dialogImageUrl,
         hasendoptions}
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
</style>