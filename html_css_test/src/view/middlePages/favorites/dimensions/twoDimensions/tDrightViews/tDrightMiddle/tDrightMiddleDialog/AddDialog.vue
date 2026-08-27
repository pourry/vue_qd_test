<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="720px"
      :close-on-click-modal="false"
      class="tddialogcss"
      align-center
      @close="toclosef"
    >
      <div class="tdformcss">
        <el-form :model="addform.form" label-position="right" :rules="rules" ref="formofaddref" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="15">
              <el-form-item label="名称" prop="name">
                <el-input v-model="addform.form.name" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="完结状态">
                <el-select v-model="addform.form.hasend" placeholder="请选择" style="width:100%">
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
              <el-form-item label="地址（路径）">
                <el-input v-model="addform.form.address" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="别名">
                <el-input v-model="addform.form.alias" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input v-model="addform.form.notes" type="textarea" :rows="3" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="是否公开">
                <el-switch v-model="addform.form.share" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="消息提醒">
                <el-switch v-model="addform.form.remindopen" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" v-if="addform.form.remindopen">
            <el-col :span="24">
              <el-alert type="info" show-icon :closable="false" style="margin-bottom:12px">
                <p>开启消息提醒后会根据通知时间对通知消息进行提醒</p>
              </el-alert>
              <el-form-item label="通知时间">
                <el-date-picker
                  v-model="addform.form.remindtime"
                  type="datetime"
                  placeholder="请选择时间"
                  format="YYYY-MM-DD hh:mm:ss"
                  style="width:100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" v-if="addform.form.remindopen">
            <el-col :span="24">
              <el-form-item label="通知消息">
                <el-input v-model="addform.form.remindmsg" type="textarea" :rows="2" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="图片">
                <el-upload action="#" list-type="picture-card"
                  :auto-upload="false"
                  :file-list="fileList"
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
        <el-button @click="toclosef">关闭</el-button>
        <el-button type="primary" @click="toadd()">新增</el-button>
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
import { ElMessage } from 'element-plus'
export default {
  name: 'AddDialog',
  props:{
     addform:{
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
  emits: ["update:visible","toclose","toadd","tosearch"],
  setup(props,{emit}){
     let hasendoptions = reactive(props.hasendoptions);
     let addform = reactive(props.addform);
     let dialogVisible = ref(props.visible);
     let dialogTitle = ref('新增收藏');

     watch(()=>props.visible,(val)=>{
       dialogVisible.value = val;
     });

     watch(dialogVisible,(val)=>{
       emit("update:visible",val);
     });

     let rules = {
        name:[
          {
            required: true,
            trigger: 'blur',
            message: '名称不能为空',
          },
          {
            min: 2,
            message: '名称长度必须大于2',
            trigger: 'blur',
            informType: 'warning',
          },
        ],
      }

     let formofaddref = ref(null);

     let toadd =  function() {
        formofaddref.value.validate((valid) => {
        if (valid) {
          for(let i = 0;i < hasendoptions.length;i++){
              if(hasendoptions[i].value == addform.form.hasend ){
                addform.form.hasendLabel = hasendoptions[i].label;
              }
          }
          let formdata = new FormData();
          let animation = addform.form;
          for(let key in animation){
            if(animation.hasOwnProperty(key)){
              if(animation[key] != undefined){
                formdata.append(key,animation[key]);
              }
            }
          }
          let files = fileList.value;
          for(let key in files){
            if(files.hasOwnProperty(key)){
              formdata.append("file",files[key].raw)
            }
          }
          emit("toadd",formdata,function(res){
            if(res.successful){
              ElMessage({
                message: res.resultValue,
                type: 'success',
              })
              toclosef();
              emit("tosearch");
            }else{
              ElMessage({
                message: res.resultValue,
                type: 'warning',
              })
            }
          })
        }
      })
     }

     let fileList = ref([]);
     let filechange = function(file){
      fileList.value.push(file);
     }
     let handlePictureCardPreview = function(file){
        dialogImageUrl.value = file.url
        dialogVisibleShowpicture.value = true
     }
     let handleRemove = function(file){
      for(let i = 0;i<fileList.value.length;i++){
        if(fileList.value[i].uid == file.uid){
          fileList.value.splice(i,1);
        }
      }
     }
     let dialogImageUrl = ref('')
     let dialogVisibleShowpicture = ref(false)

     let toclosef = function(){
        emit("toclose")
        fileList.value = [];
        dialogVisible.value = false;
     }

  return{addform,
         toclosef,
         rules,
         formofaddref,
         toadd,
         handlePictureCardPreview,handleRemove,fileList,filechange,
         dialogVisibleShowpicture,dialogImageUrl,dialogVisible,dialogTitle,
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
  transition: border-color 0.2s ease;
}
.el-form-item :deep(.el-textarea__inner:hover){
  border-color: var(--theme-primary);
}
.el-form-item :deep(.el-textarea__inner:focus){
  border-color: var(--theme-primary);
}
.el-form-item :deep(.el-select .el-select__wrapper){
  box-shadow: 0 0 0 1px var(--theme-border) inset;
}
.el-form-item :deep(.el-switch.is-checked .el-switch__core){
  background-color: var(--theme-primary);
  border-color: var(--theme-primary);
}
.uploadremcss{
}
</style>
