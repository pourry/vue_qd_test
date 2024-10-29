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
                          <span v-if="node.data.label">{{ node.data.label }}</span>
                          <span v-if="node.data.typename">{{ node.data.typename }}</span>
                          <span v-if="node.data.urlname">{{ node.data.urlname }}</span>
                          <span>
                            <el-icon v-if="!node.data.urlname" @click="append(data)"><Plus /></el-icon>
                                              <el-input v-if="node.data.label"
                                                v-model="selectofname"
                                                style="width: 100px;height:20px;padding-bottom:5px;"
                                                placeholder="查询节点"
                                                @input="toselectNode"
                                              />
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
               <div v-for="childitem of item.children" :key="childitem.id">
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
                                          <a :href="childitem.url"  target="_blank" @click="getFavicon($event,childitem)">{{childitem.url}}</a>
                                        </el-tooltip>
                                  </li> 
                                </ul>
                                
                                
               </div>
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
    if(!res.successful){
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
      if(tdata[i].children[j].urlname.indexOf(selectofname.value) == -1){
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
        treeRef}

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
  min-width:150px;
  z-index:1;
}
.urlcollectoperateshow{
  position:absolute;
  right:0%;
  display:block;
  min-width:150px;
  z-index:1;
}
.urlshowcss{
    width:100%;
    display:flex;
    flex-wrap: wrap;  /*可换行*/
    align-content: flex-start; /*从左到右*/
    /*justify-content: center;*/   /* 居中对齐 */
    background-color:rgba(106,241,230,0.2);
    font-size:0.5rem;
}
.urltypecss{
  font-size: 1.4rem;
  background-color:rgba(106,241,230,0.2);
  width:auto;
  border-radius: 0 5px 0 0;
}
.urlshowcss > div{
   position:relative;
    width:15%;
    height:auto;
    background-color:rgba(106,241,230,0.3);
    margin:1%;
    border-radius: 5px;
    padding:10px;
    display:flex;
    cursor: pointer;
}
.urlshowcss > div:hover {
  box-shadow: inset 0 0 100px 5px rgba(106,241,230,0.3);
}
.hasshareurl{
  position:absolute;
  left:0px;
  bottom:0px;
  width:30%;
  height:30%;
  display:flex;
  align-items: center;
  background-color: rgba(224,7,22,0.6);
  clip-path: polygon(0 0, 0 100%, 50% 100%);
  border-radius: 0 0 0 5px; 
}
.hasshareicon{
  margin-top: 20%;
  margin-left:3%;
}
.urlshowcss-imgcss{
  width:30%;
}
.urlshowcss-imgcss>.el-avatar{
  width:100%;
}
.urlshowcss-url{
  width:70%;
  height:100%;
  margin:0%;
  padding:0%;
  padding-left:5px;
  display: grid; 
}
.urlshowcss-url >li{
    white-space:nowrap; /*不让文字内容换行*/
    overflow:hidden;/*文字溢出的部分隐藏起来*/
    text-overflow:ellipsis; /*用...替代溢出的部分*/
}
</style>