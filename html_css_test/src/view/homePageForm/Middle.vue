<template>
         <div class='operationcss'> <router-view></router-view> </div>
</template>

<script>
export default {
  name: 'Middle',
  components: {
  }
}
</script>

<style scoped>
.operationcss {
   width: 100%;
   /* 关键：占满父容器全部高度，让子组件（如MessageCenter）能正确获取高度 */
   height: 100%;
   min-height: 0;
   display: flex;
   flex-direction: column;
}
</style>