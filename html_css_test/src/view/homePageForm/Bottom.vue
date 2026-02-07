<template>
    <div> 
      <div>底部</div>
      <div style="background-color: #fff;position:relative;">
         <div style="background-color: red ; width:30px;position:absolute">1</div>
        <div style="background-color: green ; position:absolute;right:300px;">3</div>
        <div style="background-color: yellow;position: relative;padding: 10px 20px;font-size: 12px;" >
          <div>网站名称：示例网站</div>
          <div>简介：这里是网站的简单说明文字。</div>
          <div>邮箱：example@example.com　电话：123-456-7890</div>
          <div>备案号：浙ICP备12345678号-1</div>
          <div>版权所有 © 2024 示例网站</div>
          <div style="margin-top: 8px;">
            <a href="#" style="margin-right: 12px;">首页</a>
            <a href="#" style="margin-right: 12px;">关于我们</a>
            <a href="#" style="margin-right: 12px;">服务</a>
            <a href="#" style="margin-right: 12px;">新闻</a>
            <a href="#"  @click="handleClick">联系我们</a>
          </div>
        </div>
         
      </div>
    </div>


    
</template>

<script setup lang="ts">

function handleClick(): void {
  console.log('clicked');
  // emit('update:count', '42') // 错误：参数类型不匹配
}



</script>

<style>
</style>
