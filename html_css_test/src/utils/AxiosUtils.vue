<template>

 <div>
    <button @click="toaxios('/api/test/totest','233der而我')">点击</button>
 </div>
</template>

<script>
import {axiosget} from './axiosUtils/axiosMethods';
import {sm2doEncrypt,sm3doEncrypt} from './encrypt/smUtils';
export default {
  name: 'AxiosUtils',
  setup(){
      


      function toaxios(url,value){
       let valueen =  sm2doEncrypt(value,"0466f0d720c43f3138951a4e3a84f8f12a9743434d87e9863f469d19508b586d554769c75e163271756bd15c15d145e9ab4a48bbadd03d1974eddd412637da66c2");
       let params = {"value": valueen}
       console.log("sm3---",sm3doEncrypt("qwe123二套房"))
       axiosget(url,params)
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
