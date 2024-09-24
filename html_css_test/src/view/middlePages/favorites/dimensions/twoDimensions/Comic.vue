<template>
    <div class='comiccss'>
            <TDrightViews></TDrightViews>
    </div>
</template>

<script>
import TDrightViews from '@/view/middlePages/favorites/dimensions/twoDimensions/tDrightViews/TDrightViews.vue'
export default {
  name: 'Comic',
  components: {
     TDrightViews
  }
}
</script>

<style scoped>
.comiccss{ 
    width:100%;
    height:100%;
}
</style>