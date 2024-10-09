<template>
    <div class='animationcss'>
            <TDrightViews  @toadd="toaddanimation" @togetList="getanimationList"></TDrightViews>
    </div>
</template>

<script>
import TDrightViews from '@/view/middlePages/favorites/dimensions/twoDimensions/tDrightViews/TDrightViews.vue'
import animationapi from '@/api/animation'
import { ElMessage } from 'element-plus'

import {ref} from 'vue'
export default {
  name: 'Animation',
  components: {
    TDrightViews
  },
  setup(){
    //查询列表
    let getanimationList = function(e){
      
      animationapi.togetList(e.selectfrom).then(res=>{
        //调用回调
        e.listcallback(res)
      })
    }
    //新增
    let toaddanimation = async  function(e){
            await  animationapi.toadd(e.animation).then(res=>{
                if(res.successful){
                  //调用回调
                  e.addcallback(res.resultValue)
                }else{
                  ElMessage({
                    message: '失败！',
                    type: 'warning',
                  })
                }

              })
    }
    return {getanimationList,
    toaddanimation}
  }
}
</script>

<style scoped>
.animationcss{ 
    width:100%;
    height:100%;
}
</style>