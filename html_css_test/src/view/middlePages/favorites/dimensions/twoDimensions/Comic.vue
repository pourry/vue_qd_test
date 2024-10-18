<template>
    <div class='comiccss'>
            <TDrightViews @toadd="toaddcomic" @togetList="getcomicList" @toedit="toeditcomic" 
                           @todelete="todeletecomic"></TDrightViews>
    </div>
</template>

<script>
import TDrightViews from '@/view/middlePages/favorites/dimensions/twoDimensions/tDrightViews/TDrightViews.vue'
import comicapi from '@/api/comic'
export default {
  name: 'Comic',
  components: {
     TDrightViews
  },
  setup(){
    //查询列表
    let getcomicList = function(e){
      
      comicapi.togetList(e.paramVale).then(res=>{
        //调用回调
        e.listcallback(res)
      })
    }
    //新增
    let toaddcomic = function(e){
              comicapi.toadd(e.paramVale).then(res=>{
                //调用回调
                e.addcallback(res)
              })
    }
    //修改
    let toeditcomic = function(e){
              comicapi.toedit(e.paramVale).then(res=>{
                //调用回调
                e.editcallback(res)
              })
    }
    //删除
    let todeletecomic = function(e){
              comicapi.todelete(e.ids).then(res=>{
                //调用回调
                e.deletecallback(res)
              })  
    }

    return {getcomicList,
    toaddcomic,
    toeditcomic,
    todeletecomic}
  }
}
</script>

<style scoped>
.comiccss{ 
    width:100%;
    height:100%;
}
</style>