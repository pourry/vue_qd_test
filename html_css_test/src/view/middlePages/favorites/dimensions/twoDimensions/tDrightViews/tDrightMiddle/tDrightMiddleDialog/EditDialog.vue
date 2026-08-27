<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="修改收藏"
      width="720px"
      :close-on-click-modal="false"
      class="tddialogcss"
      align-center
      @close="toclose"
    >
      <div class="tdformcss">
        <el-form :model="editform.form" label-position="right" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="15">
              <el-form-item label="名称">
                <el-input v-model="editform.form.name" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="完结状态">
                <el-select v-model="editform.form.hasend" placeholder="请选择" style="width:100%">
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
            <el-col :span="24">
              <el-form-item label="别名">
                <el-input v-model="editform.form.alias" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="地址（路径）">
                <el-input v-model="editform.form.address" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input v-model="editform.form.notes" type="textarea" :rows="3" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="是否公开">
                <el-switch v-model="editform.form.share" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="消息提醒">
                <el-switch v-model="editform.form.remindopen" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" v-if="editform.form.remindopen">
            <el-col :span="24">
              <el-alert type="info" show-icon :closable="false" style="margin-bottom:12px">
                <p>开启消息提醒后会根据通知时间对通知消息进行提醒</p>
              </el-alert>
              <el-form-item label="通知时间">
                <el-date-picker
                  v-model="editform.form.remindtime"
                  type="datetime"
                  placeholder="请选择时间"
                  format="YYYY-MM-DD hh:mm:ss"
                  style="width:100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" v-if="editform.form.remindopen">
            <el-col :span="24">
              <el-form-item label="通知消息">
                <el-input v-model="editform.form.remindmsg" type="textarea" :rows="2" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="图片">
                <el-upload action="#" list-type="picture-card"
                  :auto-upload="false"
                  :file-list="editform.form.pictures"
                  :on-change="filechange"
                  :on-remove="handleRemove"
                >
                  <el-icon><Plus /></el-icon>
                  <template #file="{file}">
                    <div>
                      <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                      <span class="el-upload-list__item-actions">
                        <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                          <el-icon><zoom-in /></el-icon>
                        </span>
                        <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                          <el-icon><Delete /></el-icon>
                        </span>
                      </span>
                    </div>
                  </template>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="toclose">关闭</el-button>
        <el-button type="primary" @click="toedit">修改</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogVisibleShowpicture" width="720px">
      <div>
        <img style="width:100%" :src="dialogImageUrl" alt="Preview Image" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {ref,reactive,watch} from 'vue'
import {ElMessage} from 'element-plus'

export default {
  name: 'EditDialog',
  props:{
     editform:{
        type:Object,
        required: true
     },
     hasendoptions:{
        type:Object,
        required: true
     },
     visible:{
        type:Boolean,
        default: false
     }
  },
  emits: ["update:visible","toclose","toedit","tosearch"],
  setup(props,{emit}){
     let hasendoptions = reactive(props.hasendoptions);
     let editform = reactive(props.editform);
     let dialogVisible = ref(props.visible);

     watch(()=>props.visible,(val)=>{
       dialogVisible.value = val;
     });

     watch(dialogVisible,(val)=>{
       emit("update:visible",val);
     });

     let toclose = function(){
        emit("toclose");
        dialogVisible.value = false;
     }

     let toedit = function(){
        for(let i = 0;i < hasendoptions.length;i++){
            if(hasendoptions[i].value == editform.form.hasend ){
              editform.form.hasendLabel = hasendoptions[i].label;
            }
        }

        let formdata = new FormData();

        let files = editform.form.pictures;
        let newFiles = [];
        for(let i = files.length - 1; i >= 0; i--){
          if(!files[i].id){
             newFiles.push(files[i]);
             files.splice(i,1);
          }
        }

        let animation = editform.form;
        for(let key in animation){
          if(animation.hasOwnProperty(key)){
            if(animation[key] != undefined){
              if(typeof animation[key]  === 'object'){
                 formdata.append("pictures",JSON.stringify(animation[key]));
              }else{
                 formdata.append(key,animation[key]);
              }
            }
          }
        }
        for(let i = 0; i < newFiles.length; i++){
          formdata.append("file", newFiles[i].raw);
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

     let dialogImageUrl = ref('')
     let dialogVisibleShowpicture = ref(false)

     let filechange = function(file){
      editform.form.pictures.push(file);
     }
     let handlePictureCardPreview = function(file){
      dialogImageUrl.value = file.url
      dialogVisibleShowpicture.value = true
     }
     let handleRemove = function(file){
      let fileList = editform.form.pictures;
      for(let i = fileList.length - 1; i >= 0; i--){
        if(fileList[i].uid == file.uid){
          fileList.splice(i,1);
        }
      }
     }

  return{editform,
         toclose,
         toedit,
         handlePictureCardPreview,handleRemove,filechange,
         dialogVisibleShowpicture,dialogImageUrl,dialogVisible,
         hasendoptions}
  }
}
</script>

<style scoped>
.tdformcss{
  padding: 10px 0;
}
.tddialogcss :deep(.el-dialog__body){
  padding: 10px 20px 20px;
  max-height: 70vh;
  overflow-y: auto;
}
.tddialogcss :deep(.el-dialog__header){
  padding: 16px 20px 10px;
  border-bottom: 1px solid var(--theme-border);
  margin-right: 0;
}
.tddialogcss :deep(.el-dialog__title){
  color: var(--theme-text-primary);
  font-weight: 600;
}
.tddialogcss :deep(.el-dialog__footer){
  padding: 12px 20px 16px;
  border-top: 1px solid var(--theme-border);
}
.el-form-item{
  margin-bottom: 16px;
}
.el-form-item :deep(.el-form-item__label){
  color: var(--theme-text-regular);
  font-weight: 500;
}
.el-form-item :deep(.el-input__wrapper){
  box-shadow: 0 0 0 1px var(--theme-border) inset;
  transition: box-shadow 0.2s ease;
}
.el-form-item :deep(.el-input__wrapper:hover){
  box-shadow: 0 0 0 1px var(--theme-primary) inset;
}
.el-form-item :deep(.el-input__wrapper.is-focus){
  box-shadow: 0 0 0 1px var(--theme-primary) inset;
}
.el-form-item :deep(.el-textarea__inner){
  border-color: var(--theme-border);
}
.el-form-item :deep(.el-textarea__inner:hover){
  border-color: var(--theme-primary);
}
.el-form-item :deep(.el-select .el-select__wrapper){
  box-shadow: 0 0 0 1px var(--theme-border) inset;
}
.el-form-item :deep(.el-switch.is-checked .el-switch__core){
  background-color: var(--theme-primary);
  border-color: var(--theme-primary);
}
</style>
