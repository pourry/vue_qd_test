<template>
    <div class='gamecss'>
            <TDrightViews @toadd="toaddgame" @togetList="getgameList" @toedit="toeditgame" 
                           @todelete="todeletegame"></TDrightViews>
    </div>
</template>

<script>
import TDrightViews from '@/view/middlePages/favorites/dimensions/twoDimensions/tDrightViews/TDrightViews.vue'
import gameapi from '@/api/game'
export default {
  name: 'Game',
  components: {
     TDrightViews
  },
  setup(){
    //查询列表
    let getgameList = function(e){
      
      gameapi.togetList(e.paramVale).then(res=>{
        //调用回调
        e.listcallback(res)
      })
    }
    //新增
    let toaddgame = function(e){
              gameapi.toadd(e.paramVale).then(res=>{
                //调用回调
                e.addcallback(res)
              })
    }
    //修改
    let toeditgame = function(e){
              gameapi.toedit(e.paramVale).then(res=>{
                //调用回调
                e.editcallback(res)
              })
    }
    //删除
    let todeletegame = function(e){
              gameapi.todelete(e.ids).then(res=>{
                //调用回调
                e.deletecallback(res)
              })  
    }

    return {getgameList,
    toaddgame,
    toeditgame,
    todeletegame}
  }
}
</script>

<style scoped>
.gamecss{ 
    width:100%;
    height:100%;
}
</style>