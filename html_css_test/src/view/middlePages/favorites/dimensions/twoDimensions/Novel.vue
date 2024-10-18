<template>
    <div class='novelcss'>
            <TDrightViews @toadd="toaddnovel" @togetList="getnovelList" @toedit="toeditnovel" 
                           @todelete="todeletenovel"></TDrightViews>
    </div>
</template>

<script>
import TDrightViews from '@/view/middlePages/favorites/dimensions/twoDimensions/tDrightViews/TDrightViews.vue'
import novelapi from '@/api/novel'
export default {
  name: 'Novel',
  components: {
     TDrightViews
  },
    setup(){
    //查询列表
    let getnovelList = function(e){
      
      novelapi.togetList(e.paramVale).then(res=>{
        //调用回调
        e.listcallback(res)
      })
    }
    //新增
    let toaddnovel = function(e){
              novelapi.toadd(e.paramVale).then(res=>{
                //调用回调
                e.addcallback(res)
              })
    }
    //修改
    let toeditnovel = function(e){
              novelapi.toedit(e.paramVale).then(res=>{
                //调用回调
                e.editcallback(res)
              })
    }
    //删除
    let todeletenovel = function(e){
              novelapi.todelete(e.ids).then(res=>{
                //调用回调
                e.deletecallback(res)
              })  
    }

    return {getnovelList,
    toaddnovel,
    toeditnovel,
    todeletenovel}
  }
}
</script>

<style scoped>
.novelcss{
    width:100%;
    height:100%;
}
</style>