<template>
    <div class='novelcss'>
            <TDrightViews></TDrightViews>
    </div>
</template>

<script>
import TDrightViews from '@/view/middlePages/favorites/dimensions/twoDimensions/tDrightViews/TDrightViews.vue'
export default {
  name: 'Novel',
  components: {
     TDrightViews
  }
}
</script>

<style scoped>
.novelcss{
    width:100%;
    height:100%;
}
</style>