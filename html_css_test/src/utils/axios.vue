<template>

</template>

<script>
import axios from 'axios';
import qs from 'qs';
export default {
  name: 'axios',
  setup(){
      


      function axios(url,params){
          axios.get(
              url,
              {
                  params: params
              }
          ).then(res =>{
              console.log(res)
          })
      }
      

      //返回值
      return {
          axios
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
