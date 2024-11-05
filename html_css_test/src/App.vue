<template>
  <div style="height: 1400px;width: 100%;">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
  }
}
</script>

<style>
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px; */
}
/*定义全局滑块的样式*/
/*  滑滚动宽高  */
::-webkit-scrollbar{
    width:10px;
    height:10px;
}
/*滑块的样式*/
::-webkit-scrollbar-thumb{
    background-color:rgba(18,23,81,.3);
    border-radius:10px;
    -webkit-box-shadow:inset1px1px0rgba(0,0,0,.1);
}
/*鼠标悬浮在该类指向的控件上时滑块的样式*/
::-webkit-scrollbar-thumb:hover{
    background-color:rgba(18,23,81,.5);
    border-radius:10px;
    -webkit-box-shadow:inset1px1px0rgba(0,0,0,.1);
}
/*正常时候的主干部分*/
::-webkit-scrollbar-track{
border-radius:10px;
-webkit-box-shadow:inset006pxrgba(0,0,0,0);
background-color:rgba(255,255,255,0.1);
}
/*鼠标悬浮在滚动条上的主干部分*/
::-webkit-scrollbar-track:hover{
-webkit-box-shadow:inset006pxrgba(0,0,0,.4);
background-color:rgba(255,255,255,.3);
}
</style>
