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
  },
  setup(){
  let getFavicon = function(url) {
  let a = document.createElement('a')
  a.href = url
  return `${a.protocol}//${a.hostname}/favicon.ico`
  }
// getFavicon('https://www.baidu.com/s?wd=js%20favicon.ico&rsv_spt=1&rsv_iqid=0xe90a78d7000ab990&issp=1&f=8&rsv_bp=1&rsv_idx=2&ie=utf-8&rqlang=cn&tn=baiduhome_pg&rsv_enter=1&rsv_dl=tb&oq=%25E5%25A6%2582%25E4%25BD%2595%25E8%258E%25B7%25E5%258F%2596favicon.ico&rsv_btype=t&inputT=1697&rsv_t=c92cDcLsEiY1ithFI2xdNgDjsJFipUVyppcywRIJFnYd5WND62XK1CWnTQi5hNPPxD3%2F&rsv_pq=98568fd304a58f6b&rsv_sug3=35&rsv_sug1=32&rsv_sug7=100&rsv_sug2=0&rsv_sug4=1697')
return {getFavicon}

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