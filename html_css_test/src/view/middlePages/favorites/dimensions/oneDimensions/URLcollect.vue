<template>
    <div class="urlcollectcss">
         <div class="urlcollectoperatecss">增删改查</div>
         <div class="collectlistcss">
          <span class="urltypecss">种类</span>
          <div class="urlshowcss">
            <ul>
              <li>名称：</li>
              <li>网址：<a href="https://www.baidu.com/"  target="_blank">https://www.baidu.com/</a></li>
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
export default {
  name: 'URLcollect',
  components: {
  }
}
</script>

<style scoped>
.urlcollectcss{
    display:reactive;
    width:100%;
    height:100%;
}
.collectlistcss{
    width:98%;
    margin:1%;
    border: solid 1px red;
}
.urlcollectoperatecss{

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
  background-color:rgba(106,241,230,0.7);
  width:auto;
}
.urlshowcss > ul{
    width:30%;
    height:auto;
    background-color:rgba(106,241,230,0.7);
    margin:1%;
    border-radius: 10px;
    padding:10px;
    
    cursor: pointer;
}
.urlshowcss > ul:hover {
  box-shadow: inset 0 0 100px 5px #e0f5fc;
}
.urlshowcss > ul >li{
    white-space:nowrap; /*不让文字内容换行*/
    overflow:hidden;/*文字溢出的部分隐藏起来*/
    text-overflow:ellipsis; /*用...替代溢出的部分*/
}
</style>