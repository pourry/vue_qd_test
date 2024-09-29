<template>
  <div class="tdaddstartcss">
    1111
  </div>
</template>

<script>
import {ref,onMounted} from 'vue'

export default {
  name: 'TDrightBottom',
  components: {
  },
  props: {
    addshow: {
      type: Boolean,
      default: false
    }
  },
  setup(){
  onMounted(()=>{
  })
  }
}
</script>

<style scoped>
.tdaddstartcss{
  background-color: green;
  position:absolute;
  top:100%;
  width: 100%;
  height: 600%;
  z-index: 100;
}


</style>