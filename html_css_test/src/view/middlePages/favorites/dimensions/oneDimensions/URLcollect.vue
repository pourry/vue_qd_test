<template>
    <div class="urlcollectcss">
         <div class="urlcollectoperatecss">
          <div>
              <div>
              <el-icon><Menu /></el-icon>
              操作
              </div>
              <div class="urlcollectoperateshowcss">
                <el-tree
                  :allow-drop="allowDrop"
                  :allow-drag="allowDrag"
                  :data="treedata.list"
                  draggable
                  default-expand-all
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
                            <el-icon @click="append(data)"><Plus /></el-icon>
                            <el-icon style="margin-left: 8px" @click="remove(node, data)"><Minus /></el-icon>
                          </span>
                        </span>
                      </template>
                </el-tree>
              </div>
          </div>
         </div>
        
         <div class="collectlistcss" v-for="item of treedata.list[0]" :key="item.id">
            <span class="urltypecss">{{item.typename}}</span>
            <div class="urlshowcss">
              <ul>
                <li>名称：</li>
                <li>网址：
                      <el-tooltip
                        class="box-item"
                        effect="dark"
                        content="https://www.baidu.com/"
                        placement="bottom-start"
                      >
                        <a href="https://www.baidu.com/"  target="_blank">https://www.baidu.com/</a>
                      </el-tooltip>
                </li>
                      
              </ul>
              <ul>网站2</ul>
              <ul>网站3</ul>
              <ul>网站4</ul>
              <ul>网站5</ul>
            </div>
         </div>
      
    </div>
</template>

<script>
import {ref,reactive,onMounted} from 'vue'
import urlTypeCollectionapi from '@/api/urlTypeCollection'
import {ElMessage} from 'element-plus'
export default {
  name: 'URLcollect',
  components: {
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
 let geturlTypeCollection = function(){
   urlTypeCollectionapi.geturltree().then(res =>{
    if(res.successful){
      treedata.list[0].children = res.resultValue;
      console.log(treedata)
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
const append = (data) => {
  console.log(data)
}

const remove = (node, data) => {
   console.log(node.typename)
   console.log(node,data)
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

return {getFavicon,
        treedata,
        handleDragStart,
        handleDragEnter,
        handleDragLeave,
        handleDragEnd,
        handleDrop,
        allowDrop,
        append,
        remove,
        geturlTypeCollection}

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
}
.urlcollectoperatecss>div:hover .urlcollectoperateshowcss{
  display:block;
}
.urlcollectoperateshowcss{
  position:absolute;
  right:0%;
  display:none
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