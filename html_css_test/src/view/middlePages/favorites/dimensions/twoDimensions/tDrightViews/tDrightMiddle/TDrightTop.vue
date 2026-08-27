<template>
    <div class='tdrighttopcss'>
      <div class="toolbar-left">
        <el-button class="tdaddbut" type="primary" @click="totdaddmenushow">{{tdaddmenushow.name}}</el-button>
        <el-button type="primary" @click="totdeditmenushow">{{tdeditmenushow.name}}</el-button>
        <el-button type="danger" @click="totddel">删除</el-button>
      </div>
      <div class="toolbar-right">
        <div class="TDserchcss">
          <el-select
            v-model="searchHasend"
            placeholder="完结状态"
            :clearable="true"
            style="width:130px"
          >
            <el-option
              v-for="item in hasendoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-model="searchTd"
            placeholder="请输入名称"
            :clearable="true"
            @keyup.enter="tosearch"
          />
          <el-button type="primary" icon="Search" @click="tosearch">查询</el-button>
          <el-button icon="Refresh" @click="toreset">重置</el-button>
        </div>
      </div>

      <!-- 添加 -->
     <AddDialog v-model:visible="tdaddmenushow.isshow" @toclose="closeaddmenu" :hasendoptions="hasendoptions" :addform="addandeditform" @toadd="toadd" @tosearch="tosearch"></AddDialog>
      <!-- 修改 -->
     <EditDialog v-model:visible="tdeditmenushow.isshow" @toclose="closeeditmenu"  :hasendoptions="hasendoptions" :editform="addandeditform" @toedit="toedit" @tosearch="tosearch"></EditDialog>
    </div>
</template>

<script>
import {ref,reactive,nextTick,onMounted,onBeforeUnmount} from 'vue'
import { ElMessage } from 'element-plus'
import AddDialog from '@/view/middlePages/favorites/dimensions/twoDimensions/tDrightViews/tDrightMiddle/tDrightMiddleDialog/AddDialog.vue'
import EditDialog from '@/view/middlePages/favorites/dimensions/twoDimensions/tDrightViews/tDrightMiddle/tDrightMiddleDialog/EditDialog.vue'
export default {
  name: 'TDrightTop',
  components: {
    AddDialog,
    EditDialog
  },
  props:{
    msgList:{
      type:Object,
      required: true
    },
    hasselecteds:{
      type:Object,
      required: true
    },
    pagemsg:{
      type:Object,
      required: true
    },
    hasendoptions:{
      type:Object,
      required: true
    }
  },
  emits:["toadd", "togetList","toedit","todelete"],
  setup(props,{emit}){
    onMounted(()=>{
    })

    let hasendoptions = reactive(props.hasendoptions);

    let msgList = reactive(props.msgList);
    let hasselecteds = reactive(props.hasselecteds);
     let searchTd = ref("");
     let searchHasend = ref(null);

     //添加修改页面的数据展示
     let addandeditform = reactive({"form":{
                                            id:undefined,
                                            name:undefined,
                                            hasend:undefined,
                                            hasendLabel:undefined,
                                            address:undefined,
                                            notes:undefined,
                                            alias:undefined,
                                            remindopen:undefined,
                                            remindtime:undefined,
                                            remindmsg:undefined,
                                            share:undefined
                                            }
                                    }); 
     //重置
     let resetfrom = function(){
      addandeditform.form = {
                              id:undefined,
                              name:undefined,
                              hasend:undefined,
                              hasendLabel:undefined,
                              address:undefined,
                              notes:undefined,
                              alias:undefined,
                              remindopen:undefined,
                              remindtime:undefined,
                              remindmsg:undefined,
                              share:undefined
                            }
     }
     //赋值
     let setfrom = function(formvalue){
      addandeditform.form = formvalue;
     }
     //添加页面显示隐藏
     let tdaddmenushow = reactive({
                                  isshow: false,
                                  name:"新增"
                                  });
     let totdaddmenushow = function(){
         resetfrom();
         tdaddmenushow.isshow = true;
         tdaddmenushow.name= "新增";
         //当新增时  修改页面关闭
         tdeditmenushow.isshow= false;
     }
     //提供给add组件 让其可关闭add组件自己
     let closeaddmenu = function(){
          tdaddmenushow.isshow= false;
     }
     //修改页面显示隐藏
     let tdeditmenushow = reactive({
                                  isshow: false,
                                  name:"修改"
                                  });
     let pictures = ref([]);
     let totdeditmenushow = function(){
         if(hasselecteds == undefined ||hasselecteds.list.length<=0 || hasselecteds.list.length>1){
            ElMessage({
              message: '请选择一个进行修改',
              type: 'warning',
            })
            return;
         }
          let pict = hasselecteds.list[0].pictures;
          for(let i=0;i<pict.length;i++){
            pict[i].name=pict[i].pictureLogic;
            pict[i].url = pict[i].pictureUrl;
          }
          addandeditform.pictures = pict;
          setfrom(hasselecteds.list[0]);

          tdeditmenushow.isshow = true;
          //当修改时  新增页面关闭
          tdaddmenushow.isshow= false;
     }
     //提供给edit组件 让其可关闭edit组件自己
     let closeeditmenu = function(){
          tdeditmenushow.isshow= false;
     }

     //删除按钮
     let totddel = function(){
          //先关闭新增改弹框
          closeaddmenu();
          closeeditmenu();
          let ids = [];
          hasselecteds.list.forEach(item => {
            ids.push(item.id);
          });
          if(ids.length <=0){
            return
          }
          emit("todelete",ids,function(res){
            if(res.resultValue){
              ElMessage({
                message: res.resultValue,
                type: 'success',
              })
              tosearch();
            }else{
              ElMessage({
                message: '失败',
                type: 'warning',
              })
            }
          })
          
     }
     let pagemsg = reactive(props.pagemsg)
     //查询按钮
     let tosearch = function(){
        pagemsg.animation.name = searchTd.value.trim() || undefined;
        pagemsg.animation.hasend = searchHasend.value || undefined;
        emit("togetList",pagemsg.animation)
     }
     //重置
     let toreset = function(){
        searchTd.value = "";
        searchHasend.value = null;
        pagemsg.animation.name = undefined;
        pagemsg.animation.hasend = undefined;
        emit("togetList",pagemsg.animation)
     }
     //新增
     let toadd = function(paramVale,callback){
      emit("toadd",paramVale,callback)
     }
     //修改
     let toedit = function(paramVale,callback){
      emit("toedit",paramVale,callback)
     }



     return{
          searchTd,
          searchHasend,
          toreset,
          tdaddmenushow,
          totdaddmenushow,
          closeaddmenu,
          tdeditmenushow,
          totdeditmenushow,
          closeeditmenu,
          totddel,
          addandeditform,
          toadd,
          toedit,
          tosearch,
          resetfrom,
          setfrom,
          pagemsg,
          pictures,
          msgList,
          hasendoptions
        }
  }
}
</script>

<style scoped>
.tdrighttopcss{ 
    width:100%;
    height:100%;
    position:relative;
    padding: var(--theme-spacing-sm) var(--theme-spacing-md);
    box-sizing: border-box;
    background: var(--theme-bg-card);
    border-bottom: 1px solid var(--theme-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--theme-spacing-md);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: var(--theme-spacing-sm);
  flex-shrink: 0;
}

.toolbar-right {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
}

.TDserchcss{
  display: flex;
  gap: var(--theme-spacing-sm);
  align-items: center;
  width: 100%;
  max-width: 560px;
}
.TDserchcss :deep(.el-select){
  flex-shrink: 0;
}
.TDserchcss :deep(.el-input){
  flex: 1;
}

/* 工具栏按钮样式 */
.tdrighttopcss :deep(.el-button){
  border-radius: var(--theme-radius-md);
  font-weight: 500;
  transition: all 0.2s ease;
}
.tdrighttopcss :deep(.el-button:hover){
  transform: translateY(-1px);
  box-shadow: var(--theme-shadow-sm);
}
.tdrighttopcss :deep(.el-button--primary){
  background-color: var(--theme-primary);
  border-color: var(--theme-primary);
}
.tdrighttopcss :deep(.el-button--primary:hover){
  background-color: var(--theme-primary-dark);
  border-color: var(--theme-primary-dark);
}
.tdrighttopcss :deep(.el-button--danger){
  background-color: var(--theme-danger);
  border-color: var(--theme-danger);
}
.tdrighttopcss :deep(.el-button--danger:hover){
  opacity: 0.9;
}

/* 搜索框样式 */
.TDserchcss :deep(.el-input__wrapper){
  border-radius: var(--theme-radius-md);
  box-shadow: 0 0 0 1px var(--theme-border) inset;
  transition: all 0.2s ease;
}
.TDserchcss :deep(.el-input__wrapper:hover){
  box-shadow: 0 0 0 1px var(--theme-primary) inset;
}
.TDserchcss :deep(.el-input__wrapper.is-focus){
  box-shadow: 0 0 0 1px var(--theme-primary) inset;
}
.TDserchcss :deep(.el-input__inner){
  color: var(--theme-text-primary);
}

/* 添加/修改按钮特殊样式 */
.tdaddbut{
  background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-primary-dark) 100%) !important;
  border: none !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}
.tdaddbut:hover{
  background: linear-gradient(135deg, var(--theme-primary-dark) 0%, var(--theme-primary) 100%) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
}

</style>