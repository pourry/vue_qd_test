<template>
    <div class='animationcss'>
            <TDrightViews  @toadd="toaddanimation" @togetList="getanimationList" @toedit="toeditanimation" 
                           @todelete="todeleteanimation"></TDrightViews>
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
      
      animationapi.togetList(e.animation).then(res=>{
        //调用回调
        e.listcallback(res)
      })
    }
    //新增
    let toaddanimation = function(e){
              animationapi.toadd(e.animation).then(res=>{
                //调用回调
                e.addcallback(res)
              })
    }
    //修改
    let toeditanimation = function(e){
              animationapi.toedit(e.animation).then(res=>{
                //调用回调
                e.editcallback(res)
              })
    }
    //删除
    let todeleteanimation = function(e){
              animationapi.todelete(e.ids).then(res=>{
                //调用回调
                e.deletecallback(res)
              })  
    }

    return {getanimationList,
    toaddanimation,
    toeditanimation,
    todeleteanimation}
  }
}
</script>

<style scoped>
.animationcss{ 
    width:100%;
    height:100%;
}
</style>