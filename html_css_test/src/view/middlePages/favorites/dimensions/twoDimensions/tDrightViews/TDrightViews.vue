<template>
    <div class='tdrightcss'>
         <div class='tdtopcss'>
           <TDrightTop></TDrightTop>
         </div>
         <div class='tdmiddlecss'>
           <!-- 中部 -->
           <Tdrightmiddle></Tdrightmiddle>
         </div>
         <div class='tdbottomcss'>
            <TDrightBottom></TDrightBottom>
         </div>
    </div>
</template>

<script>
import Tdrightmiddle from '@/view/middlePages/favorites/dimensions/twoDimensions/tDrightViews/tDrightMiddle/TDrightMiddle.vue'
import TDrightBottom from '@/view/middlePages/favorites/dimensions/twoDimensions/tDrightViews/tDrightMiddle/TDrightBottom.vue'
import TDrightTop from '@/view/middlePages/favorites/dimensions/twoDimensions/tDrightViews/tDrightMiddle/TDrightTop.vue'

export default {
  name: 'Animation',
  components: {
    Tdrightmiddle,
    TDrightBottom,
    TDrightTop
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