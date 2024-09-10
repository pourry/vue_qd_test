<template>
    <div>
         <div class = 'operationcss'> <router-view></router-view> </div>
    </div>
</template>

<script>
export default {
  name: 'Middle',
  components: {
  }
}
</script>

<style scoped>
.noticecss {
   display:flex;
   justify-content: center;
   align-items:center;
   height:10%;
   
}
.operationcss {
   height:100%;
   width:100%;
}
</style>