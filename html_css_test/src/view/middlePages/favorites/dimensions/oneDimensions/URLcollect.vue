<template>
    <div class="urlcollectcss">
         <div class="urlcollectoperatecss">
          <div>
              <div @click="toshowTree">
              <el-icon><Menu /></el-icon>
              {{showTree.msg}}
              </div>
              <div :class="showTree.css">
                <el-tree
                  :allow-drop="allowDrop"
                  :allow-drag="allowDrag"
                  :data="treedata.list"
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
                          <span v-if="node.data.label">{{ node.data.label }}</span>
                          <span v-if="node.data.typename">{{ node.data.typename }}</span>
                          <span v-if="node.data.urlname">{{ node.data.urlname }}</span>
                          <span>
                            <el-icon v-if="!node.data.urlname" @click="append(data)"><Plus /></el-icon>
                            <el-icon v-if="!node.data.label" style="margin-left: 8px" @click="editnode(data)"><Edit /></el-icon>
                            <el-icon v-if="!node.data.label" style="margin-left: 8px" @click="remove(node, data)"><Minus /></el-icon>
                          </span>
                        </span>
                      </template>
                </el-tree>
              </div>
          </div>
         </div>
        
         <div class="collectlistcss" v-for="item of treedata.list[0].children" :key="item.id">
            <span class="urltypecss">{{item.typename}}</span>
            <div class="urlshowcss">
              <ul v-for="childitem of item.children" :key="childitem.id">
                <li>名称：{{childitem.urlname}}</li>
                <li>网址：
                      <el-tooltip
                        class="box-item"
                        effect="dark"
                        :content="childitem.url"
                        placement="bottom-start"
                      >
                        <a :href="childitem.url"  target="_blank">{{childitem.url}}</a>
                      </el-tooltip>
                </li>
                      
              </ul>
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
import {ref,reactive,onMounted} from 'vue'
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
  let getFavicon = function(url) {
  let a = document.createElement('a')
  a.href = url
  return `${a.protocol}//${a.hostname}/favicon.ico`
  }
// getFavicon('https://www.baidu.com/s?wd=js%20favicon.ico&rsv_spt=1&rsv_iqid=0xe90a78d7000ab990&issp=1&f=8&rsv_bp=1&rsv_idx=2&ie=utf-8&rqlang=cn&tn=baiduhome_pg&rsv_enter=1&rsv_dl=tb&oq=%25E5%25A6%2582%25E4%25BD%2595%25E8%258E%25B7%25E5%258F%2596favicon.ico&rsv_btype=t&inputT=1697&rsv_t=c92cDcLsEiY1ithFI2xdNgDjsJFipUVyppcywRIJFnYd5WND62XK1CWnTQi5hNPPxD3%2F&rsv_pq=98568fd304a58f6b&rsv_sug3=35&rsv_sug1=32&rsv_sug7=100&rsv_sug2=0&rsv_sug4=1697')
 
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
    }else{
      ElMessage({
                  message: res.resultValue,
                  type: 'warning',
                })
    }
   })
 }
let treedata = reactive({"list":[
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
  
  console.log(data)
}
let editTypevisible = reactive({"visible":false});
let editvisible = reactive({"visible":false});
let editform =reactive({      
                        "id":undefined,
                        "urlname":undefined,
                        "url":undefined,
                        "ssurltypeid":undefined,
                        "notes":undefined
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
  }
}


const remove = (node, data) => {
  let id = data.id
   if(data.typename){
    removeurlType(id);
   }else{
    removeurl(id);
   }
   console.log(node,data)
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
  console.log('drag start', node)
}
// 拖拽进入其他节点时触发的事件
const handleDragEnter = (
  draggingNode,
  dropNode,
  ev
) => {
  console.log('tree drag enter:', dropNode.label)
}
//拖拽离开某个节点时触发的事件
const handleDragLeave = (
  draggingNode,
  dropNode,
  ev
) => {
  console.log('tree drag leave:', dropNode.label)
}
//在拖拽节点时触发的事件（类似浏览器的 mouseover 事件）
const handleDragOver = (draggingNode, dropNode, ev) => {
  console.log('tree drag over:', dropNode.label)
}
//拖拽结束时（可能未成功）触发的事件
const handleDragEnd = (
  draggingNode,
  dropNode,
  dropType,
  ev
) => {
  console.log('tree drag end:', dropNode && dropNode.label, dropType)
}
//拖拽成功完成时触发的事件
const handleDrop = (
  draggingNode,
  dropNode,
  dropType,
  ev
) => {
  console.log('tree drop:', dropNode.label, dropType)
}
//判断节点能否被拖拽 如果返回 false ，节点不能被拖动
const allowDrop = (draggingNode, dropNode, type) => {
  if (dropNode.data.label === 'Level two 3-1') {
    return type !== 'inner'
  } else {
    return true
  }
}
//拖拽时判定目标节点能否成为拖动目标位置。 
//如果返回 false ，拖动节点不能被拖放到目标节点。 
//type 参数有三种情况：'prev'、'inner' 和 'next'，分别表示放置在目标节点前、插入至目标节点和放置在目标节点后
const allowDrag = (draggingNode) => {
  return !draggingNode.data.label.includes('Level three 3-1-1')
}

let addvisible = reactive({visible:false});
let addTypevisible = reactive({visible:false});
return {showTree,
        toshowTree,
        getFavicon,
        treedata,
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
        editform,editTypeform}

  }
}
</script>

<style scoped>
.urlcollectcss{
    position: relative;
    width:100%;
    height:100%;
}
.collectlistcss{
    width:98%;
    margin:1%;
}
.urlcollectoperatecss{
  width:100%;
  position: relative;
  display:flex;
  flex-direction: row-reverse;
  
}
.urlcollectoperatecss>div{
  cursor:pointer;
  position: relative;
  right:2%;
}
.urlcollectoperatecss>div:hover .urlcollectoperateshowcss{
  display:block;
}
.urlcollectoperateshowcss{
  position:absolute;
  right:0%;
  display:none;
  min-width:150px
}
.urlcollectoperateshow{
    position:absolute;
  right:0%;
  display:block;
  min-width:150px
}
.urlshowcss{
    width:100%;
    display:flex;
    flex-wrap: wrap;  /*可换行*/
    align-content: flex-start; /*从左到右*/
    justify-content: center;   /* 居中对齐 */
    background-color:rgba(106,241,230,0.2);
   
}
.urltypecss{
  font-size: 1.25rem;
   background-color:rgba(106,241,230,0.2);
  width:auto;
  border-radius: 0 5px 0 0;
}
.urlshowcss > ul{
    width:30%;
    height:auto;
    background-color:rgba(106,241,230,0.3);
    margin:1%;
    border-radius: 5px;
    padding:10px;
    
    cursor: pointer;
}
.urlshowcss > ul:hover {
  box-shadow: inset 0 0 100px 5px rgba(106,241,230,0.3);
}
.urlshowcss > ul >li{
    white-space:nowrap; /*不让文字内容换行*/
    overflow:hidden;/*文字溢出的部分隐藏起来*/
    text-overflow:ellipsis; /*用...替代溢出的部分*/
}
</style>