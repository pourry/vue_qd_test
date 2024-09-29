<template>
        <el-dialog v-model="addshow" title="Shipping address">
        1111

        </el-dialog>
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
  debugger
    console.log(addshow)
  })
  }
}
</script>

<style scoped>

</style>