<template>
    <div class="tdiv">
      <div class="leftdiv">欢迎来到次元收藏夹</div>
      <div class="middlediv">middle</div>
      <div class="rightdiv">
         <div>收藏夹</div>
         <div>我的</div>
         <div>退出</div>
         <div><router-link to="/login">登录</router-link></div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Top',
  components: {
  }
}
</script>

<style scoped>
.tdiv {
  
  display: flex;
}
.leftdiv {
  width: 30%;
  display: flex; 
  justify-content: center; /*横向*/
  align-items: center;     /*纵向*/
}
.middlediv {
  width: 40%;
}
.rightdiv {
  width: 30%;
  display: flex;
  justify-content:space-around;
}

</style>