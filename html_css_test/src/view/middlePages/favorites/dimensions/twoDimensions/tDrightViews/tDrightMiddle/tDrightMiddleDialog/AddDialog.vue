<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="680px"
      :close-on-click-modal="false"
      class="tddialogcss"
      align-center
      @close="toclosef"
    >
      <div class="tdformcss">
        <el-form :model="addform.form" label-position="right" :rules="rules" ref="formofaddref" label-width="90px">

          <!-- ========== 基础信息 ========== -->
          <div class="form-section">
            <div class="section-title"><span class="title-bar"></span>基础信息</div>
            <el-row :gutter="16">
              <el-col :span="16">
                <el-form-item label="名称" prop="name">
                  <el-input v-model="addform.form.name" placeholder="请输入收藏名称" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="完结">
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
            <el-row :gutter="16">
              <el-col :span="24">
                <el-form-item label="别名">
                  <el-input v-model="addform.form.alias" placeholder="可选，显示用的别名" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="16">
              <el-col :span="24">
                <el-form-item label="地址">
                  <el-input v-model="addform.form.address" placeholder="路径或链接" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- ========== 通用属性：评分 + 标签 ========== -->
          <div class="form-section">
            <div class="section-title"><span class="title-bar"></span>收藏属性</div>
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="评分">
                  <el-rate v-model="addform.form.rating" :max="10" allow-half show-score text-color="#ff9900" style="max-width:100%;overflow:hidden" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="标签">
                  <el-input v-model="addform.form.tags" placeholder="逗号分隔，如：热血,治愈" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- ========== 类型专属 ========== -->
          <div class="form-section" v-if="addform.form.type === 'animation'">
            <div class="section-title"><span class="title-bar"></span>动画信息</div>
            <el-row :gutter="16">
              <el-col :span="8">
                <el-form-item label="总集数">
                  <el-input-number v-model="addform.form.episodes" :min="1" :max="9999" style="width:100%" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="制作公司">
                  <el-input v-model="addform.form.studio" placeholder="如: MAPPA" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="原作来源">
                  <el-select v-model="addform.form.source" placeholder="请选择" style="width:100%" clearable>
                    <el-option label="漫改" value="漫改" />
                    <el-option label="轻改" value="轻改" />
                    <el-option label="原创" value="原创" />
                    <el-option label="游戏改" value="游戏改" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="16">
              <el-col :span="24">
                <el-form-item label="主要声优">
                  <el-input v-model="addform.form.voiceActors" placeholder="逗号分隔" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div class="form-section" v-else-if="addform.form.type === 'comic'">
            <div class="section-title"><span class="title-bar"></span>漫画信息</div>
            <el-row :gutter="16">
              <el-col :span="8">
                <el-form-item label="总话数">
                  <el-input-number v-model="addform.form.chapters" :min="1" :max="99999" style="width:100%" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="作者">
                  <el-input v-model="addform.form.comicAuthor" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出版社">
                  <el-input v-model="addform.form.publisher" placeholder="如: 集英社" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="16">
              <el-col :span="24">
                <el-form-item label="连载周期">
                  <el-select v-model="addform.form.serialization" placeholder="请选择" style="width:100%" clearable>
                    <el-option label="周刊" value="周刊" />
                    <el-option label="双周刊" value="双周刊" />
                    <el-option label="月刊" value="月刊" />
                    <el-option label="不定期" value="不定期" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div class="form-section" v-else-if="addform.form.type === 'novel'">
            <div class="section-title"><span class="title-bar"></span>小说信息</div>
            <el-row :gutter="16">
              <el-col :span="8">
                <el-form-item label="字数(千字)">
                  <el-input-number v-model="addform.form.wordCount" :min="0" :max="999999" style="width:100%" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="作者">
                  <el-input v-model="addform.form.novelAuthor" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="平台">
                  <el-input v-model="addform.form.platform" placeholder="如: 起点" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="16">
              <el-col :span="24">
                <el-form-item label="分类">
                  <el-input v-model="addform.form.category" placeholder="如: 玄幻 / 都市" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div class="form-section" v-else-if="addform.form.type === 'game'">
            <div class="section-title"><span class="title-bar"></span>游戏信息</div>
            <el-row :gutter="16">
              <el-col :span="8">
                <el-form-item label="游戏平台">
                  <el-input v-model="addform.form.gamePlatform" placeholder="如: PC / PS5" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="开发商">
                  <el-input v-model="addform.form.developer" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="游戏类型">
                  <el-input v-model="addform.form.genre" placeholder="如: RPG / ACT" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="16">
              <el-col :span="24">
                <el-form-item label="游玩时长(h)">
                  <el-input-number v-model="addform.form.hoursPlayed" :min="0" :max="9999" style="width:100%" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- ========== 备注 ========== -->
          <div class="form-section">
            <div class="section-title"><span class="title-bar"></span>备注</div>
            <el-row :gutter="16">
              <el-col :span="24">
                <el-form-item label="备注">
                  <el-input v-model="addform.form.notes" type="textarea" :rows="2" placeholder="可选" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- ========== 设置开关 ========== -->
          <div class="form-section">
            <div class="section-title"><span class="title-bar"></span>其他设置</div>
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="是否公开">
                  <el-switch v-model="addform.form.share" active-text="公开" inactive-text="私有" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="消息提醒">
                  <el-switch v-model="addform.form.remindopen" active-text="开启" inactive-text="关闭" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- ========== 提醒详情（开启时显示） ========== -->
          <div class="form-section remind-section" v-if="addform.form.remindopen">
            <div class="section-title"><span class="title-bar"></span>提醒设置</div>
            <el-row :gutter="16">
              <el-col :span="24">
                <el-form-item label="提醒时间">
                  <el-date-picker
                    v-model="addform.form.remindtime"
                    type="datetime"
                    placeholder="请选择时间"
                    format="YYYY-MM-DD HH:mm:ss"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    style="width:100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="16">
              <el-col :span="24">
                <el-form-item label="提醒消息">
                  <el-input v-model="addform.form.remindmsg" type="textarea" :rows="2" placeholder="到点时显示的消息内容" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="重复">
                  <el-select v-model="addform.form.repeatType" placeholder="不重复" style="width:100%">
                    <el-option label="不重复" value="none" />
                    <el-option label="每小时" value="hourly" />
                    <el-option label="每天" value="daily" />
                    <el-option label="每周" value="weekly" />
                    <el-option label="每月" value="monthly" />
                    <el-option label="每年" value="yearly" />
                    <el-option label="自定义间隔" value="custom" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="addform.form.repeatType === 'custom'">
                <el-form-item label="间隔(分钟)">
                  <el-input-number
                    v-model="addform.form.repeatInterval"
                    :min="1"
                    :step="30"
                    style="width:100%"
                    placeholder="请输入间隔"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="16" v-if="addform.form.repeatType && addform.form.repeatType !== 'none'">
              <el-col :span="24">
                <el-form-item label="结束时间">
                  <el-date-picker
                    v-model="addform.form.repeatEndTime"
                    type="datetime"
                    placeholder="留空表示无限重复"
                    format="YYYY-MM-DD HH:mm:ss"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    style="width:100%"
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- ========== 图片 ========== -->
          <div class="form-section">
            <div class="section-title"><span class="title-bar"></span>图片</div>
            <el-row :gutter="16">
              <el-col :span="24">
                <el-form-item label="上传">
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
          </div>

        </el-form>
      </div>
      <template #footer>
        <el-button @click="toclosef">取消</el-button>
        <el-button type="primary" @click="toadd()">确定新增</el-button>
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
          // ============ 提醒时间验证：开了提醒必须选时间 ============
          if (addform.form.remindopen) {
            if (!addform.form.remindtime) {
              ElMessage.warning('开启提醒后，请选择提醒时间');
              return;
            }
          }
          // ============ 提醒时间验证 END ============
          for(let i = 0;i < hasendoptions.length;i++){
              if(hasendoptions[i].value == addform.form.hasend ){
                addform.form.hasendLabel = hasendoptions[i].label;
              }
          }
          let formdata = new FormData();
          let animation = addform.form;
          let fmtDate = (d) => {
            if (!d) return '';
            const pad = (n) => String(n).padStart(2, '0');
            return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
          };
          for(let key in animation){
            if(animation.hasOwnProperty(key)){
              let val = animation[key];
              if(val === undefined || val === null || val === '') continue;
              if(key === 'pictures'){
                formdata.append("pictures", JSON.stringify(val));
              } else if (val instanceof Date) {
                formdata.append(key, fmtDate(val));
              } else if (typeof val === 'boolean') {
                formdata.append(key, String(val));
              } else if (typeof val === 'number') {
                formdata.append(key, String(val));
              } else {
                formdata.append(key, val);
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
  padding: 4px 0;
}
.tddialogcss :deep(.el-dialog){
  border-radius: 12px;
  overflow: hidden;
}
.tddialogcss :deep(.el-dialog__body){
  padding: 16px 20px 12px;
  max-height: 72vh;
  overflow-y: auto;
}
.tddialogcss :deep(.el-dialog__body)::-webkit-scrollbar{
  width: 6px;
}
.tddialogcss :deep(.el-dialog__body)::-webkit-scrollbar-thumb{
  background: var(--theme-border);
  border-radius: 3px;
}
.tddialogcss :deep(.el-dialog__header){
  padding: 16px 20px 14px;
  border-bottom: 1px solid var(--theme-border);
  margin-right: 0;
}
.tddialogcss :deep(.el-dialog__title){
  color: var(--theme-text-primary);
  font-weight: 600;
  font-size: 16px;
}
.tddialogcss :deep(.el-dialog__footer){
  padding: 12px 20px 16px;
  border-top: 1px solid var(--theme-border);
  text-align: right;
}

/* ========== 分区样式 ========== */
.form-section{
  margin-bottom: 18px;
  padding: 14px 16px 4px;
  background: var(--theme-bg-hover, #f8f9fa);
  border-radius: 8px;
  border: 1px solid var(--theme-border, #ebeef5);
}
.form-section:last-child{
  margin-bottom: 0;
}
.form-section.remind-section{
  border-left: 3px solid #e6a23c;
}
.form-section.remind-section :deep(.el-form-item__label){
  color: var(--theme-text-regular);
  font-weight: 500;
}
.form-section.remind-section .section-title{
  color: var(--theme-text-primary);
}
.section-title{
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--theme-text-primary);
}
.title-bar{
  display: inline-block;
  width: 3px;
  height: 14px;
  background: var(--theme-primary, #0082F4);
  border-radius: 2px;
}
.remind-section .title-bar{
  background: #e6a23c;
}

.el-form-item{
  margin-bottom: 14px;
}
.el-form-item :deep(.el-form-item__label){
  color: var(--theme-text-regular);
  font-weight: 500;
  font-size: 13px;
}
.el-form-item :deep(.el-input__wrapper){
  box-shadow: 0 0 0 1px var(--theme-border) inset;
  transition: box-shadow 0.2s ease;
  border-radius: 6px;
}
.el-form-item :deep(.el-input__wrapper:hover){
  box-shadow: 0 0 0 1px var(--theme-primary) inset;
}
.el-form-item :deep(.el-input__wrapper.is-focus){
  box-shadow: 0 0 0 1px var(--theme-primary) inset;
}
.el-form-item :deep(.el-textarea__inner){
  border-color: var(--theme-border);
  border-radius: 6px;
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
  border-radius: 6px;
}
.el-form-item :deep(.el-switch.is-checked .el-switch__core){
  background-color: var(--theme-primary);
  border-color: var(--theme-primary);
}
.el-form-item :deep(.el-rate){
  height: 32px;
  line-height: 32px;
}
.el-form-item :deep(.el-input-number){
  width: 100%;
}
.el-form-item :deep(.el-input-number .el-input-number__decrease),
.el-form-item :deep(.el-input-number .el-input-number__increase){
  background: var(--theme-bg-hover, #f5f7fa);
  border-color: var(--theme-border);
  color: var(--theme-text-regular);
}
.el-form-item :deep(.el-input-number .el-input-number__decrease:hover),
.el-form-item :deep(.el-input-number .el-input-number__increase:hover){
  color: var(--theme-primary);
}
.el-form-item :deep(.el-input-number .el-input__wrapper){
  border-radius: 6px 0 0 6px;
}
.el-form-item :deep(.el-input-number .el-input-number__controls .is-decrease){
  border-radius: 0 6px 6px 0;
}
</style>
