<template>
    <div class='gamecss'>
            <TDrightViews></TDrightViews>
    </div>
</template>

<script>
import TDrightViews from '@/view/middlePages/favorites/dimensions/twoDimensions/tDrightViews/TDrightViews.vue'
export default {
  name: 'Game',
  components: {
     TDrightViews
  }
}
</script>

<style scoped>
.gamecss{ 
    width:100%;
    height:100%;
}
</style>