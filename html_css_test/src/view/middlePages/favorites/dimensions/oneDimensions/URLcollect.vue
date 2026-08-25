<template>
    <div class="urlcollectcss">
         <div class="urlcollectoperatecss">

          <div>
              <div @click="toshowTree" class="urlcollectoperatecss-cz">
                <div><el-icon ><Menu /></el-icon></div>
                <div>{{showTree.msg}}</div>
              </div>
              <div :class="showTree.css">

                <el-tree
                  :allow-drop="allowDrop"
                  :allow-drag="allowDrag"
                  :data="treedatashow.list"
                  draggable
                  default-expand-all
                  :expand-on-click-node="false"
                  node-key="id"
                  @node-drag-start="handleDragStart"
                  @node-drag-enter="handleDragEnter"
                  @node-drag-leave="handleDragLeave"
                  @node-drag-over="handleDragOver"
                  @node-drag-end="handleDragEnd"
                  @node-drop="handleDrop"
                >
                      <template #default="{ node, data }">
                        <span class="custom-tree-node">
                          <span class="tree-node-label" v-if="node.data.label">{{ node.data.label }}</span>
                          <span class="tree-node-label" v-if="node.data.typename">{{ node.data.typename }}</span>
                          <span class="tree-node-label" v-if="node.data.urlname">{{ node.data.urlname }}</span>
                          <span class="tree-node-actions">
                            <el-icon v-if="!node.data.urlname" class="tree-action-icon" @click="append(data)"><Plus /></el-icon>
                            <el-input v-if="node.data.label"
                              v-model="selectofname"
              class="tree-search-input"
              size="small"
              placeholder="查询节点"
              @input="toselectNode"
            />
                            <el-icon v-if="!node.data.label" class="tree-action-icon" @click="editnode(data)"><Edit /></el-icon>
                            <el-icon v-if="!node.data.label" class="tree-action-icon" @click="remove(node, data)"><Minus /></el-icon>
                          </span>
                        </span>
                      </template>
                </el-tree>
              </div>
          </div>
              <div class="search-box">
               <el-input
                  v-model="selectofname"
                  style="width: 240px"
                  @input="toselectNode"
                  size="small"
                  placeholder="输入查询内容"
                  :suffix-icon="Search"
                />
              </div>
              <div @click="toggleSortMode" :class="['urlcollectoperatecss-cz', { 'sort-active': sortMode }]">
                <div><el-icon><Rank /></el-icon></div>
                <div>{{ sortMode ? '完成排序' : '排序模式' }}</div>
              </div>
              <div @click="toggleAddMode" :class="['urlcollectoperatecss-cz', { 'sort-active': addMode }]">
                <div><el-icon><CirclePlus /></el-icon></div>
                <div>{{ addMode ? '完成编辑' : '增加修改' }}</div>
              </div>
              <!-- 验证网址可用性按钮 -->
              <div @click="toggleValidateMode" :class="['urlcollectoperatecss-cz', { 'sort-active': validateMode || validating }]">
                <div><el-icon :class="{ 'is-loading': validating }"><Connection /></el-icon></div>
                <div>{{ validating ? '验证中...' : (validateMode ? '完成选择' : (validateResults ? '重新验证' : '验证可用性')) }}</div>
              </div>
         </div>
         
         <!-- 选择验证工具栏 -->
         <div v-if="validateMode" class="validate-toolbar">
           <div class="validate-toolbar-left">
             <el-checkbox 
               :model-value="isAllSelected" 
               :indeterminate="isIndeterminate"
               @change="(val) => toggleSelectAll(val)">
               全选
             </el-checkbox>
             <span class="validate-selected-count">已选 {{ selectedUrls.length }} 项</span>
           </div>
           <div class="validate-toolbar-right">
             <el-button size="small" type="primary" :loading="validating" :disabled="selectedUrls.length === 0" @click="validateSelectedUrls">
               验证选中
             </el-button>
             <el-button size="small" @click="clearSelection">清空选择</el-button>
           </div>
         </div>

         <!-- 验证结果统计 -->
         <div v-if="validateResults" class="validate-summary">
           <el-tag type="success" size="small">可用: {{ validateResults.availableCount }}</el-tag>
           <el-tag type="danger" size="small">不可用: {{ validateResults.unavailableCount }}</el-tag>
           <el-tag type="info" size="small">总计: {{ validateResults.total }}</el-tag>
           <el-button size="small" text @click="validateResults = null">关闭</el-button>
         </div>

         <div class="collectlistbody">
                   <div class="collectlistcss" v-for="item of treedatashow.list[0].children" :key="item.id">
                      <div class="urltypecss-wrapper">
                        <span :class="['urltypecss', { 'editable-title': addMode }]" @click="addMode && editnode(item)">{{item.typename}}</span>
                        <el-checkbox 
                          v-if="validateMode"
                          :model-value="isCategoryAllSelected(item)"
                          :indeterminate="isCategoryIndeterminate(item)"
                          @change="(val) => toggleCategorySelectAll(item, val)">
                          全选
                        </el-checkbox>
                      </div>
                      <div class="urlshowcss">
                        <div v-for="childitem of item.children" :key="childitem.id"
                          :draggable="sortMode"
                          @click="onCardClick($event, childitem)"
                          @dragstart="handleCardDragStart($event, childitem)"
                          @dragover.prevent="handleCardDragOver($event, childitem)"
                          @dragleave="handleCardDragLeave($event)"
                          @drop.prevent="handleCardDrop($event, childitem, item)"
                          :class="['url-card', { 'sort-mode': sortMode, 'edit-mode': addMode, 'drag-over-top': dragOverId === childitem.id && dragOverPos === 'top', 'drag-over-bottom': dragOverId === childitem.id && dragOverPos === 'bottom', 'validate-mode': validateMode, 'selected-card': validateMode && isUrlSelected(childitem.id) }, getValidateStatusClass(childitem.id)]"
                        >
                        <!-- 选择模式复选框 -->
                        <el-checkbox 
                          v-if="validateMode"
                          class="card-checkbox"
                          :model-value="isUrlSelected(childitem.id)"
                          @click.stop
                          @change="() => toggleUrlSelect(childitem)">
                        </el-checkbox>
                        <!-- 验证状态标记 -->
                        <span v-if="validateResults && getValidateResult(childitem.id)" 
                          :class="['validate-badge', getValidateResult(childitem.id).available ? 'available' : 'unavailable']"
                          :title="getValidateResult(childitem.id).message">
                          <el-icon v-if="getValidateResult(childitem.id).available"><CircleCheckFilled /></el-icon>
                          <el-icon v-else><CircleCloseFilled /></el-icon>
                        </span>
                        <span class="hasshareurl" v-if="childitem.share">
                                  <el-tooltip
                                    class="box-item"
                                    effect="dark"
                                    content="已分享"
                                    placement="bottom-start"
                                  >
                                    <el-icon class="hasshareicon"><Share /></el-icon>
                                  </el-tooltip>
                        </span>
                                        <div class="urlshowcss-imgcss">
                                              <el-avatar    >
                                                <img
                                                  :src="childitem.urllogopath"
                                                />
                                              </el-avatar>
                                          </div>
                                          <ul class="urlshowcss-url">
                                            <li>名称：{{childitem.urlname}}</li>
                                            <li>网址：
                                                  <el-tooltip
                                                    class="box-item"
                                                    effect="dark"
                                                    :content="childitem.url"
                                                    placement="bottom-start"
                                                  >
                                                    <a :href="(addMode || sortMode) ? 'javascript:void(0)' : childitem.url"  target="_blank" @click="getFavicon($event,childitem)">{{childitem.url}}</a>
                                                  </el-tooltip>
                                            </li>
                                            <li v-if="childitem.notes" class="url-notes">
                                                  <el-tooltip
                                                    class="box-item"
                                                    effect="dark"
                                                    :content="childitem.notes"
                                                    placement="bottom-start"
                                                  >
                                                    <span>备注：{{childitem.notes}}</span>
                                                  </el-tooltip>
                                            </li>
                                          </ul>
                                          <el-icon v-if="addMode" class="card-edit-icon"><Edit /></el-icon>
                                          
                        </div>
                        <!-- 增加模式：每个分类末尾添加网址 -->
                        <div v-if="addMode" class="url-card add-url-card" @click="append(item)">
                          <el-icon class="add-card-icon"><Plus /></el-icon>
                          <span class="add-card-text">添加网址</span>
                        </div>
                      </div>
                  </div>
                  <!-- 增加模式：最底部添加分类 -->
                  <div v-if="addMode" class="add-type-btn" @click="appendType">
                    <el-icon><Plus /></el-icon>
                    <span>添加分类</span>
                  </div>
         </div>

         <AddURLcollect :addvisible="addvisible"  @getList="geturlTypeCollection" :urlssurltype="urlssurltype"></AddURLcollect>
         <EditURLcollect :editvisible="editvisible" :editform="editform"  @getList="geturlTypeCollection" :urlssurltype="urlssurltype"></EditURLcollect>
         <AddURLTypecollect :addvisible="addTypevisible" @getList="geturlTypeCollection"></AddURLTypecollect>
         <EditURLTypecollect :editvisible="editTypevisible" :editTypeform="editTypeform" @getList="geturlTypeCollection"></EditURLTypecollect>

    </div>
</template>

<script>
import AddURLcollect from '@/view/middlePages/favorites/dimensions/oneDimensions/AddURLcollect.vue'
import AddURLTypecollect from '@/view/middlePages/favorites/dimensions/oneDimensions/AddURLTypecollect.vue'
import EditURLTypecollect from '@/view/middlePages/favorites/dimensions/oneDimensions/EditURLTypecollect.vue'
import EditURLcollect from '@/view/middlePages/favorites/dimensions/oneDimensions/EditURLcollect.vue'
import {ref,reactive,onMounted,toRaw,markRaw} from 'vue'//toRaw 将响应式对象转变为普通对象
import urlTypeCollectionapi from '@/api/urlTypeCollection'
import urlCollectionapi from '@/api/urlCollection'
import {ElMessage} from 'element-plus'
export default {
  name: 'URLcollect',
  components: {
    AddURLcollect,
    AddURLTypecollect,
    EditURLcollect,
    EditURLTypecollect
  },
  setup(){
    onMounted(()=>{
      geturlTypeCollection();
    })
  let getFavicon = function(event,item) {
      //请求获取logopath
      let logourl =`${event.target.protocol}//${event.target.hostname}/favicon.ico`
      
      if(item.urllogopath != logourl){
        //保存logo地址
          tosavelogo({"id":item.id,
              "urllogopath":logourl})
        // 重新赋值
        item.urllogopath = logourl;
      }
      
      
  }
  let tosavelogo = function(data){
    urlCollectionapi.tosavelogo(data).then(res =>{
      if(res.successful){
        return res.resultValue.urllogopath;
      }
    })
  }
 let toshowTree = function(){
    if(showTree.css == "urlcollectoperateshowcss"){
      showTree.css = "urlcollectoperateshow"
      showTree.msg = "收起"
    }else{
      showTree.css = "urlcollectoperateshowcss"
      showTree.msg = "操作"
    }
 }
 let showTree = reactive({"css":"urlcollectoperateshowcss",
                           "msg":"操作"})
 let geturlTypeCollection = function(){
   urlTypeCollectionapi.geturltree().then(res =>{
    if(res.successful){
      treedata.list[0].children = res.resultValue;
      
      treedatashow.list = JSON.parse(JSON.stringify(treedata.list));//将这个响应式对象复制为一个普通对象
    }else{
      ElMessage({
                  message: res.resultValue,
                  type: 'warning',
                })
    }
   })
 }
 //作为存储
let treedata = reactive({"list":[
  {
    id:'1',
    label: '开始',
    children: [
    ],
  }
]})
//作为展示
let treedatashow =reactive({"list":[
{
    id:'1',
    label: '开始',
    children: [
    ],
  }
]}) 
let urlssurltype = reactive({"ssurltypeid":undefined})

const append = (data) => {
  console.log(data.typename)
  urlssurltype.ssurltypeid = data.id;
  if(data.typename){
    addvisible.visible = true;
    
  }else{
    //说明  是开始节点
    addTypevisible.visible = true;
  }
  
}
let editTypevisible = reactive({"visible":false});
let editvisible = reactive({"visible":false});
let editform =reactive({      
                        "id":undefined,
                        "urlname":undefined,
                        "url":undefined,
                        "ssurltypeid":undefined,
                        "notes":undefined,
                        "share":undefined
                        });
let editTypeform =reactive({"id":undefined,"typename":undefined});
const editnode = function(data){
  if(data.typename){
    editTypevisible.visible = true;
    editTypeform.id = data.id;
    editTypeform.typename = data.typename;
  }else{
    editvisible.visible = true;
    editform.id = data.id;
    editform.urlname = data.urlname;
    editform.url = data.url;
    editform.ssurltypeid = data.ssurltypeid;
    editform.notes = data.notes;
    editform.share = data.share;
  }
}


const remove = (node, data) => {
  let id = data.id
   if(data.typename){
    removeurlType(id);
   }else{
    removeurl(id);
   }
}
//
let removeurl = function(id){
  urlCollectionapi.todelete(id).then(res=>{
    if(res.successful){
      geturlTypeCollection();
    }else{
      ElMessage({
                  message: res.resultValue,
                  type: 'warning',
                })
    }
  })
}
let removeurlType = function(id){
  urlTypeCollectionapi.todelete(id).then(res=>{
    if(res.successful){
      geturlTypeCollection();
    }else{
      ElMessage({
                  message: res.resultValue,
                  type: 'warning',
                })
    }
  })
}
// 节点开始拖拽时触发的事件
const handleDragStart = (node, ev) => {
  // console.log('drag start', node)
}
// 拖拽进入其他节点时触发的事件
const handleDragEnter = (
  draggingNode,
  dropNode,
  ev
) => {
  // console.log('tree drag draggingNode:', draggingNode)
  // console.log('tree drag dropNode:', dropNode)
}
//拖拽离开某个节点时触发的事件
const handleDragLeave = (
  draggingNode,
  dropNode,
  ev
) => {
  // console.log('tree drag leave:', dropNode.label)
}
//在拖拽节点时触发的事件（类似浏览器的 mouseover 事件）
const handleDragOver = (draggingNode, dropNode, ev) => {
  // console.log('tree drag over:', dropNode.label)
}
//拖拽结束时（可能未成功）触发的事件
const handleDragEnd = (
  draggingNode,
  dropNode,
  dropType,
  ev
) => {
  // console.log('tree drag end:', dropNode , dropType)
}
//拖拽成功完成时触发的事件
const handleDrop = (
  draggingNode,
  dropNode,
  dropType,
  ev
) => {
  // console.log('tree drop:', dropNode,draggingNode, dropType)
  changenode({
    "dropid":dropNode.data.id,
    "dragid":draggingNode.data.id,
    "dropType":dropType
  })
}
let changenode = function(data){
  urlTypeCollectionapi.tochange(data).then(res=>{
    if(res.successful){
      geturlTypeCollection();
    }else{
      ElMessage({
        message: res.resultValue,
        type: 'warning',
      })
    }
  })
}

//拖拽时判定目标节点能否成为拖动目标位置。 
//如果返回 false ，拖动节点不能被拖放到目标节点。 
//type 参数有三种情况：'prev'、'inner' 和 'next'，分别表示放置在目标节点前、插入至目标节点和放置在目标节点后
const allowDrop = (draggingNode, dropNode, type) => {
    
    return (draggingNode.data.ssurltypeid !=undefined && dropNode.data.ssurltypeid !=undefined && type !="inner") ||
    (draggingNode.data.typename !=undefined && dropNode.data.typename !=undefined  && type !="inner") ||
    (draggingNode.data.ssurltypeid !=undefined && dropNode.data.typename !=undefined && type =="inner");
}
//判断节点能否被拖拽 如果返回 false ，节点不能被拖动 draggingNode:处于其后面的节点  dropNode 当前节点
const allowDrag = (draggingNode) => {
  // console.log("dropNode",dropNode)
  return true;
}
//树的查询
let selectofname = ref("");
let treeRef = ref(null)
let toselectNode = function(){
  // treeRef.value!.filter(selectofname)
  treedatashow.list = JSON.parse(JSON.stringify(treedata.list));
  let tdata = treedatashow.list[0].children;
  for(let i = 0; i<tdata.length;i++){
    for(let j = 0; j < tdata[i].children.length;j++ ){
      if(tdata[i].children[j].urlname.toUpperCase().indexOf(selectofname.value.toUpperCase()) == -1){
        tdata[i].children.splice(j, 1)
        j--;
      }
    }
    if(tdata[i].children.length == 0){
      if(tdata[i].typename.indexOf(selectofname.value) == -1){
        tdata.splice(i,1)
        i--;
      }
    }
  }
  console.log("before",tdata);
    

}

// ===== 卡片拖拽排序 =====
let sortMode = ref(false)
let addMode = ref(false)
let dragItem = null
let dragOverId = ref('')
let dragOverPos = ref('')
const toggleSortMode = function(){
  sortMode.value = !sortMode.value
  if(!sortMode.value){
    dragOverId.value = ''
    dragOverPos.value = ''
  }
}
const handleCardDragStart = function(e, item){
  dragItem = item
  e.dataTransfer.effectAllowed = 'move'
  // Firefox 需要设置 dataTransfer 数据才能触发拖拽
  e.dataTransfer.setData('text/plain', item.id)
}
const handleCardDragOver = function(e, item){
  if(!dragItem || dragItem.id === item.id){
    return
  }
  // 只允许同类型拖拽
  if(dragItem.ssurltypeid !== item.ssurltypeid){
    return
  }
  e.dataTransfer.dropEffect = 'move'
  const rect = e.currentTarget.getBoundingClientRect()
  const midY = rect.top + rect.height / 2
  if(e.clientY < midY){
    dragOverId.value = item.id
    dragOverPos.value = 'top'
  }else{
    dragOverId.value = item.id
    dragOverPos.value = 'bottom'
  }
}
const handleCardDragLeave = function(e, item){
  if(dragOverId.value === item.id){
    dragOverId.value = ''
    dragOverPos.value = ''
  }
}
const handleCardDrop = function(e, dropItem, parent){
  if(!dragItem || dragItem.id === dropItem.id){
    dragOverId.value = ''
    dragOverPos.value = ''
    return
  }
  // 只允许同类型拖拽
  if(dragItem.ssurltypeid !== dropItem.ssurltypeid){
    ElMessage({ message: '只能在同一分类内排序', type: 'warning' })
    dragOverId.value = ''
    dragOverPos.value = ''
    dragItem = null
    return
  }
  let dropType = dragOverPos.value === 'top' ? 'before' : 'after'
  changenode({
    "dropid": dropItem.id,
    "dragid": dragItem.id,
    "dropType": dropType
  })
  dragItem = null
  dragOverId.value = ''
  dragOverPos.value = ''
}
// ===== 增加修改模式 =====
const toggleAddMode = function(){
  addMode.value = !addMode.value
}
const appendType = function(){
  addTypevisible.visible = true
}
const onCardClick = function(e, item){
  if(addMode.value){
    e.preventDefault()
    e.stopPropagation()
    editnode(item)
  }else if(sortMode.value){
    e.preventDefault()
    e.stopPropagation()
  }else if(validateMode.value){
    // 选择模式下点击卡片切换选择
    e.preventDefault()
    e.stopPropagation()
    toggleUrlSelect(item)
  }
}

// ===== 网址可用性验证 =====
const validating = ref(false)
const validateResults = ref(null)
const validateResultMap = ref({})
const validateMode = ref(false)
const selectedUrls = ref([])

// 切换验证模式
const toggleValidateMode = function(){
  validateMode.value = !validateMode.value
  if(!validateMode.value){
    selectedUrls.value = []
  }
}

// 获取所有网址
const getAllUrls = function(){
  const urls = []
  const list = treedatashow.list[0].children
  for(let i = 0; i < list.length; i++){
    const children = list[i].children || []
    for(let j = 0; j < children.length; j++){
      if(children[j].url){
        urls.push(children[j])
      }
    }
  }
  return urls
}

// 判断网址是否选中
const isUrlSelected = function(id){
  return selectedUrls.value.some(item => item.id === id)
}

// 切换网址选中状态
const toggleUrlSelect = function(item){
  const index = selectedUrls.value.findIndex(i => i.id === item.id)
  if(index > -1){
    selectedUrls.value.splice(index, 1)
  }else{
    selectedUrls.value.push(item)
  }
}

// 全选状态
const isAllSelected = ref(false)
const isIndeterminate = ref(false)

// 更新全选状态
const updateSelectAllState = function(){
  const allUrls = getAllUrls()
  if(allUrls.length === 0){
    isAllSelected.value = false
    isIndeterminate.value = false
    return
  }
  const selectedCount = selectedUrls.value.length
  isAllSelected.value = selectedCount === allUrls.length
  isIndeterminate.value = selectedCount > 0 && selectedCount < allUrls.length
}

// 全选/取消全选
const toggleSelectAll = function(val){
  if(val){
    const allUrls = getAllUrls()
    selectedUrls.value = [...allUrls]
  }else{
    selectedUrls.value = []
  }
  updateSelectAllState()
}

// 分类全选状态
const isCategoryAllSelected = function(category){
  const children = category.children || []
  if(children.length === 0) return false
  return children.every(child => selectedUrls.value.some(s => s.id === child.id))
}

// 分类半选状态
const isCategoryIndeterminate = function(category){
  const children = category.children || []
  if(children.length === 0) return false
  const selectedCount = children.filter(child => selectedUrls.value.some(s => s.id === child.id)).length
  return selectedCount > 0 && selectedCount < children.length
}

// 切换分类全选
const toggleCategorySelectAll = function(category, val){
  const children = category.children || []
  if(val){
    // 添加该分类下所有未选中的
    children.forEach(child => {
      if(!selectedUrls.value.some(s => s.id === child.id)){
        selectedUrls.value.push(child)
      }
    })
  }else{
    // 移除该分类下所有
    selectedUrls.value = selectedUrls.value.filter(s => !children.some(c => c.id === s.id))
  }
  updateSelectAllState()
}

// 清空选择
const clearSelection = function(){
  selectedUrls.value = []
  updateSelectAllState()
}

// 验证选中的网址
const validateSelectedUrls = async function(){
  if(validating.value) return
  if(selectedUrls.value.length === 0){
    ElMessage({ message: '请先选择要验证的网址', type: 'warning' })
    return
  }
  
  const urls = selectedUrls.value.map(item => ({
    id: item.id,
    url: item.url,
    urlname: item.urlname
  }))
  
  validating.value = true
  validateResults.value = null
  validateResultMap.value = {}
  
  try{
    const res = await urlCollectionapi.validateUrls(urls)
    if(res.successful){
      const data = res.resultValue
      const resultList = data.results || []
      const map = {}
      
      resultList.forEach(item => {
        map[item.id] = item
      })
      
      validateResultMap.value = map
      validateResults.value = {
        availableCount: data.availableCount,
        unavailableCount: data.unavailableCount,
        total: data.total
      }
      
      const availCount = data.availableCount
      const unavailCount = data.unavailableCount
      ElMessage({ 
        message: `验证完成：可用 ${availCount} 个，不可用 ${unavailCount} 个`, 
        type: availCount > unavailCount ? 'success' : 'warning' 
      })
    }else{
      ElMessage({ message: res.resultValue || '验证失败', type: 'error' })
    }
  }catch(error){
    ElMessage({ message: '验证请求失败，请检查网络', type: 'error' })
  }finally{
    validating.value = false
  }
}

// 验证所有网址（兼容旧方法）
const validateAllUrls = async function(){
  if(validating.value) return
  
  const allUrls = getAllUrls()
  if(allUrls.length === 0){
    ElMessage({ message: '没有可验证的网址', type: 'warning' })
    return
  }
  
  // 进入选择模式并全选
  validateMode.value = true
  selectedUrls.value = [...allUrls]
  updateSelectAllState()
  
  // 直接执行验证
  await validateSelectedUrls()
}

const getValidateResult = function(id){
  return validateResultMap.value[id] || null
}

const getValidateStatusClass = function(id){
  const result = validateResultMap.value[id]
  if(!result) return ''
  return result.available ? 'card-available' : 'card-unavailable'
}


let addvisible = reactive({visible:false});
let addTypevisible = reactive({visible:false});
return {showTree,
        toshowTree,
        getFavicon,
        treedata,
        treedatashow,
        handleDragStart,
        handleDragEnter,
        handleDragLeave,
        handleDragEnd,
        handleDrop,
        allowDrop,
        append,
        remove,
        geturlTypeCollection,
        addvisible,addTypevisible,
        removeurl,removeurlType,urlssurltype,editnode,
        editTypevisible,editvisible,
        editform,editTypeform,
        changenode,
        tosavelogo,
        selectofname,
        toselectNode,
        treeRef,
        sortMode,
        addMode,
        dragOverId,
        dragOverPos,
        toggleSortMode,
        handleCardDragStart,
        handleCardDragOver,
        handleCardDragLeave,
        handleCardDrop,
        toggleAddMode,
        appendType,
        onCardClick,
        // 验证相关
        validating,
        validateResults,
        validateMode,
        selectedUrls,
        isAllSelected,
        isIndeterminate,
        toggleValidateMode,
        toggleSelectAll,
        toggleCategorySelectAll,
        toggleUrlSelect,
        validateAllUrls,
        validateSelectedUrls,
        clearSelection,
        isUrlSelected,
        isCategoryAllSelected,
        isCategoryIndeterminate,
        getValidateResult,
        getValidateStatusClass}

  }
}
</script>

<style scoped>
.urlcollectcss{
    position: relative;
    width:100%;
    height:100%;
    padding: 12px;
    background-color: var(--theme-bg-middle);
}

/* ===== 操作栏 ===== */
.urlcollectoperatecss{
  width:100%;
  position: relative;
  display:flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.urlcollectoperatecss > div{
  cursor:pointer;
  position: relative;
  margin-left:8px;
}
.urlcollectoperatecss-cz{
  display:flex;
  justify-content:center;
  align-items:center;
  gap: 4px;
  padding: 6px 14px;
  border-radius: var(--theme-radius-md);
  background: var(--theme-primary-bg);
  color: var(--theme-primary);
  font-size: 14px;
  transition: all 0.2s ease;
}
.urlcollectoperatecss-cz:hover{
  background: var(--theme-primary-bg-hover);
}
.urlcollectoperatecss-cz > div{
  display:flex;
  justify-content:center;
  align-items:center;
}

/* ===== 树面板 ===== */
.el-tree{
  height: auto;
  max-height: 60vh;
  overflow:auto;
  background: var(--theme-bg-card);
  border: 1px solid var(--theme-border);
  border-radius: var(--theme-radius-md);
  box-shadow: var(--theme-shadow-sm);
  padding: 8px;
}
.urlcollectoperateshowcss{
  position:absolute;
  right:0%;
  display:none;
  min-width:200px;
  z-index:10;
}
.urlcollectoperateshow{
  position:absolute;
  right:0%;
  display:block;
  min-width:200px;
  z-index:10;
}
.urlcollectoperatecss > div:hover .urlcollectoperateshowcss{
  display:block;
}

/* ===== 列表区域 ===== */
.collectlistbody{
  width:100%;
  height: calc(100% - 60px);
  overflow:auto;
}
.collectlistcss{
    width:100%;
    margin-bottom: 16px;
}

/* ===== 分类标题 ===== */
.urltypecss{
  font-size: 16px;
  font-weight: 600;
  color: var(--theme-primary);
  background: var(--theme-primary-bg);
  width: auto;
  display: inline-block;
  padding: 4px 16px;
  border-radius: var(--theme-radius-md);
  margin-bottom: 8px;
}

/* ===== URL 列表容器 ===== */
.urlshowcss{
    width:100%;
    display:flex;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 8px;
    font-size: 13px;
}

/* ===== URL 卡片 ===== */
.urlshowcss > div{
    position:relative;
    width: 220px;
    height: auto;
    background: var(--theme-bg-card);
    border: 1px solid var(--theme-border);
    border-radius: var(--theme-radius-md);
    padding: 12px;
    display:flex;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.urlshowcss > div:hover {
    border-color: var(--theme-primary);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    transform: translateY(-3px);
}

/* ===== 排序模式样式 ===== */
.url-card.sort-mode{
  cursor: grab;
  border-style: dashed;
  border-color: var(--theme-border);
}
.url-card.sort-mode:hover{
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 20px var(--theme-primary-shadow);
}
.url-card.sort-mode:active{
  cursor: grabbing;
  opacity: 0.6;
}
.url-card.drag-over-top{
  border-top: 3px solid var(--theme-primary);
  margin-top: -2px;
}
.url-card.drag-over-bottom{
  border-bottom: 3px solid var(--theme-primary);
  margin-bottom: -2px;
}
.url-card.drag-over-top,
.url-card.drag-over-bottom{
  background: var(--theme-primary-bg);
  border-color: var(--theme-primary);
}

/* ===== 排序按钮激活状态 ===== */
.urlcollectoperatecss-cz.sort-active{
  background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-primary-light) 100%);
  color: #fff;
  box-shadow: 0 4px 14px var(--theme-primary-shadow);
}

/* ===== 增加模式：添加网址卡片 ===== */
.add-url-card{
  width: 220px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border: 2px dashed var(--theme-primary) !important;
  background: var(--theme-primary-bg) !important;
  color: var(--theme-primary);
  min-height: 80px;
  cursor: pointer;
  transition: all 0.25s ease;
}
.add-url-card:hover{
  background: var(--theme-primary-bg-hover) !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--theme-primary-shadow);
}
.add-card-icon{
  font-size: 28px;
}
.add-card-text{
  font-size: 13px;
  font-weight: 500;
}

/* ===== 增加模式：添加分类按钮 ===== */
.add-type-btn{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 200px;
  margin: 16px auto;
  padding: 12px 24px;
  border: 2px dashed var(--theme-border);
  border-radius: var(--theme-radius-md);
  background: var(--theme-bg-card);
  color: var(--theme-text-secondary);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.25s ease;
}
.add-type-btn:hover{
  border-color: var(--theme-primary);
  color: var(--theme-primary);
  background: var(--theme-primary-bg);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

/* ===== 增加修改模式：卡片编辑状态 ===== */
.url-card.edit-mode{
  cursor: pointer;
  position: relative;
}
.url-card.edit-mode:hover{
  border-color: var(--theme-warning, #e6a23c);
  box-shadow: 0 6px 20px rgba(230, 162, 60, 0.2);
}
.card-edit-icon{
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 16px;
  color: var(--theme-text-secondary);
  opacity: 0;
  transition: all 0.2s ease;
}
.url-card.edit-mode:hover .card-edit-icon{
  opacity: 1;
  color: var(--theme-warning, #e6a23c);
}

/* ===== 增加修改模式：分类标题可编辑 ===== */
.urltypecss.editable-title{
  cursor: pointer;
  transition: all 0.2s ease;
}
.urltypecss.editable-title:hover{
  background: var(--theme-primary-bg-hover);
  color: var(--theme-primary-dark);
  text-decoration: underline;
}

/* ===== 已分享标记 ===== */
.hasshareurl{
  position:absolute;
  left:0px;
  top:0px;
  width:28px;
  height:28px;
  display:flex;
  align-items: center;
  justify-content: center;
  background: var(--theme-primary);
  border-radius: 8px 0 8px 0;
}
.hasshareicon{
  color: #fff;
  font-size: 14px;
}

/* ===== 头像区域 ===== */
.urlshowcss-imgcss{
  width:40px;
  flex-shrink: 0;
  margin-right: 10px;
}
.urlshowcss-imgcss > .el-avatar{
  width:40px;
  height: 40px;
  border-radius: var(--theme-radius-sm);
  border: 1px solid var(--theme-border-light);
}

/* ===== URL 信息区域 ===== */
.urlshowcss-url{
  width: calc(100% - 50px);
  height:100%;
  margin:0;
  padding:0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  list-style: none;
}
.urlshowcss-url > li{
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    font-size: 13px;
    color: var(--theme-text-regular);
}
.urlshowcss-url > li:first-child{
    font-weight: 600;
    color: var(--theme-text-primary);
}
.urlshowcss-url .url-notes{
    color: var(--theme-text-secondary);
    font-size: 12px;
    font-style: italic;
}
.urlshowcss-url a{
  color: var(--theme-primary);
  text-decoration: none;
  transition: color 0.2s ease;
}
.urlshowcss-url a:hover{
  text-decoration: underline;
}

/* ===== 树节点操作图标 ===== */
.custom-tree-node{
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}
.tree-node-label{
  font-weight: 500;
  color: var(--theme-text-primary);
}
.tree-node-actions{
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 4px;
}
.tree-action-icon{
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
  border-radius: var(--theme-radius-sm);
  color: var(--theme-text-secondary);
  transition: all 0.2s ease;
}
.tree-action-icon:hover{
  color: var(--theme-primary);
  background: var(--theme-primary-bg);
  transform: scale(1.15);
}

/* ===== 树内搜索框 ===== */
.tree-search-input{
  width: 120px;
}
.tree-search-input :deep(.el-input__wrapper){
  border-radius: var(--theme-radius-sm);
  box-shadow: 0 0 0 1px var(--theme-border) inset;
  transition: box-shadow 0.2s ease;
}
.tree-search-input :deep(.el-input__wrapper:hover){
  box-shadow: 0 0 0 1px var(--theme-primary) inset;
}
.tree-search-input :deep(.el-input__wrapper.is-focus){
  box-shadow: 0 0 0 1px var(--theme-primary) inset, 0 0 0 3px var(--theme-primary-bg) inset;
}

/* ===== 树整体样式覆盖 ===== */
:deep(.el-tree-node__content){
  height: 36px;
  border-radius: var(--theme-radius-sm);
  transition: background 0.2s ease;
}
:deep(.el-tree-node__content:hover){
  background: var(--theme-primary-bg);
}
:deep(.el-tree-node.is-current > .el-tree-node__content){
  background: var(--theme-primary-bg);
}
:deep(.el-tree__drop-indicator){
  height: 2px;
  background: var(--theme-primary);
}
:deep(.el-tree-node.is-drop-inner > .el-tree-node__content){
  background: var(--theme-primary-bg-hover);
}

/* ===== 搜索框 ===== */
.search-box{
  flex-shrink: 0;
}
.search-box :deep(.el-input__wrapper){
  border-radius: var(--theme-radius-md);
  box-shadow: 0 0 0 1px var(--theme-border) inset;
  transition: box-shadow 0.2s ease;
}
.search-box :deep(.el-input__wrapper:hover){
  box-shadow: 0 0 0 1px var(--theme-primary) inset;
}
.search-box :deep(.el-input__wrapper.is-focus){
  box-shadow: 0 0 0 1px var(--theme-primary) inset, 0 0 0 3px var(--theme-primary-bg) inset;
}

/* ===== 验证结果统计 ===== */
.validate-summary{
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  margin-bottom: 12px;
  background: var(--theme-bg-card);
  border: 1px solid var(--theme-border);
  border-radius: var(--theme-radius-md);
  box-shadow: var(--theme-shadow-sm);
  animation: fadeInSlide 0.3s ease;
}
.validate-summary .el-tag{
  font-weight: 500;
}
.validate-summary .el-button{
  margin-left: auto;
}

/* ===== 验证状态标记 ===== */
.validate-badge{
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  z-index: 10;
  animation: badgePop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.validate-badge.available{
  background: #67c23a;
  color: #fff;
  box-shadow: 0 2px 8px rgba(103, 194, 58, 0.4);
}
.validate-badge.unavailable{
  background: #f56c6c;
  color: #fff;
  box-shadow: 0 2px 8px rgba(245, 108, 108, 0.4);
}

/* ===== 卡片状态样式 ===== */
.url-card.card-available{
  border-color: #67c23a !important;
  box-shadow: 0 0 12px rgba(103, 194, 58, 0.15);
}
.url-card.card-available:hover{
  border-color: #5daf34 !important;
  box-shadow: 0 6px 20px rgba(103, 194, 58, 0.25);
}
.url-card.card-unavailable{
  border-color: #f56c6c !important;
  background: linear-gradient(to right, rgba(245, 108, 108, 0.05), var(--theme-bg-card));
}
.url-card.card-unavailable:hover{
  border-color: #e65656 !important;
  box-shadow: 0 6px 20px rgba(245, 108, 108, 0.2);
}
.url-card.card-unavailable .urlshowcss-url{
  opacity: 0.8;
}

/* ===== 动画 ===== */
@keyframes fadeInSlide{
  from{
    opacity: 0;
    transform: translateY(-8px);
  }
  to{
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes badgePop{
  0%{
    opacity: 0;
    transform: scale(0) rotate(-180deg);
  }
  50%{
    transform: scale(1.2) rotate(10deg);
  }
  100%{
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

/* ===== 选择验证工具栏 ===== */
.validate-toolbar{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  margin-bottom: 12px;
  background: var(--theme-primary-bg);
  border: 1px solid var(--theme-primary);
  border-radius: var(--theme-radius-md);
  animation: fadeInSlide 0.3s ease;
}
.validate-toolbar-left{
  display: flex;
  align-items: center;
  gap: 16px;
}
.validate-toolbar-right{
  display: flex;
  align-items: center;
  gap: 8px;
}
.validate-selected-count{
  font-size: 13px;
  color: var(--theme-primary);
  font-weight: 500;
}

/* ===== 分类标题包装器 ===== */
.urltypecss-wrapper{
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}
.urltypecss-wrapper .el-checkbox{
  font-size: 12px;
}

/* ===== 选择模式下的卡片样式 ===== */
.url-card.validate-mode{
  cursor: pointer;
}
.url-card.selected-card{
  border-color: var(--theme-primary) !important;
  background: var(--theme-primary-bg);
  box-shadow: 0 0 0 2px var(--theme-primary-light);
}
.url-card .card-checkbox{
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 5;
  background: var(--theme-bg-card);
  border-radius: 4px;
  padding: 2px;
}
.url-card.validate-mode .urlshowcss-imgcss{
  padding-left: 28px;
}

/* ===== 已选卡片高亮 ===== */
.url-card.selected-card:hover{
  border-color: var(--theme-primary) !important;
  box-shadow: 0 4px 16px var(--theme-primary-shadow);
}
</style>