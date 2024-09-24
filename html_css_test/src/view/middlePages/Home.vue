<template>
    <div>
         <div>主页</div>
      
    </div>
</template>

<script>
import { onMounted } from 'vue';

export default {
  name: 'Home',
  components: {
  },
  setup(){
    let test = function(){
      var number = [1,2,3,4,5,6]
      console.log(...number) //1 2 3 4 5 6
      //对象
      var man = {name:'chuichui',height:176}
      console.log({...man}) // {name:'chuichui',height:176}
      console.log(man);
      console.log(number);
    }
    onMounted(()=>{
      console.log(this)
      test();
    })
    return {test }
  }
  
}
</script>

<style scoped>
</style>