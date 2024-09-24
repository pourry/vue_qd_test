<template>
    <div class='tdrightcss'>
         <div class='tdtopcss'>上方查询条件</div>
         <div class='tdmiddlecss'>
           <!-- 中部 -->
           <Tdrightmiddlecss></Tdrightmiddlecss>
         </div>
         <div class='tdbottomcss'>下方页签</div>
    </div>
</template>

<script>
import Tdrightmiddlecss from '@/view/middlePages/favorites/dimensions/twoDimensions/tDrightViews/tDrightMiddle/TDrightMiddle.vue'
export default {
  name: 'Animation',
  components: {
    Tdrightmiddlecss
  }
}
</script>

<style scoped>
.tdrightcss{
   height:100%;
   width:100%;
}
.tdtopcss{
   height:10%;
   width:100%;
   background-color: red;
}
.tdmiddlecss{
   height:85%;
   width:100%;
}
.tdbottomcss{
   height:5%;
   width:100%;
   background-color: green;
}
</style>