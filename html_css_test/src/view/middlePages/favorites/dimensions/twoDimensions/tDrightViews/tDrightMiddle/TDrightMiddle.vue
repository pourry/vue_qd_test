<template>
    <div class='tdrightmiddlecss'>
      <div class='collectshowcss'>
         <div>
           <el-image >图片</el-image>
           <span>
              <ul>
                <li>名称</li>
                <li>地址</li>
                <li>备注</li>
              </ul>
           </span>
         </div> 
         <div>2</div> 
         <div>3</div> 
         <div>4</div> 
         <div>5</div> 
         <div>5</div> 
         <div>5</div> 
         <div>5</div> 
         <div>5</div> 
         <div>5</div> 
         <div>5</div> 
         <div>5</div> 
         <div>5</div> 
         <div>5</div> 
         <div>5</div> 
         <div>5</div> 
      </div>

    </div>
</template>

<script>
export default {
  name: 'TDrightMiddle',
  components: {
  }
}
</script>

<style scoped>
.tdrightmiddlecss{
   height:100%;
   width:100%;
   display: flex;
   justify-content:center;
   align-items: center;
}
.tdrightmiddlecss >div{
   border:solid red 1px;
   display:flex;
   flex-wrap: wrap;  /*可换行*/
   align-content: flex-start; /*从左到右*/
   justify-content: center;   /* 居中对齐 */
   height:98%;
   width:98%;
   overflow:auto;
   
}
.collectshowcss >div{
   position:relative;    /*absolute（绝对）  如果上级没有定位 时会往上找  最终会以html 为基准*/
   height:25%;
   width:20rem;
   padding: 0.5%;
   margin: 0.5%;
   cursor: pointer;
   
}
.collectshowcss >div:hover {
  box-shadow: inset 0 0 100px 5px #e0f5fc;
}
.collectshowcss div>.el-image{
  position:relative;
  height:100%;
  width:100%;
  background-color:rgba(255,255,255,0.5)
}
.collectshowcss div>span{
  position:absolute;
  background-color:red;
  width:50%;
  height:30%;
  right:0%;
  bottom:0%;
}
</style>