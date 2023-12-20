<template>

 <div>
    <button @click="toaxios()">点击</button>
 </div>
</template>

<script>
import {getSm2} from '@/api/login'
export default {
  name: 'AxiosUtils',
  setup(){
      


      function toaxios(){
           getSm2().then(res=>{
        console.log(res)
    })
      }
      

      //返回值
      return {
        toaxios
      }
  },

  created() {
          console.log('---created---')
  },
  mounted() {
          console.log('---mounted---')
  },    
}
</script>

<style scoped>
</style>
