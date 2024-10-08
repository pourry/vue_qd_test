<template>
    <div class='tdrightcss'>
         <div class='tdtopcss'>
           <TDrightTop :msgList="msgList" :hasselecteds="hasselecteds"></TDrightTop>
         </div>
         <div class='tdmiddlecss'>
           <!-- 中部 -->
           <Tdrightmiddle :msgList="msgList" :hasselecteds="hasselecteds"></Tdrightmiddle>
         </div>
         <div class='tdbottomcss'>
            <TDrightBottom></TDrightBottom>
         </div>
    </div>
</template>

<script>
import Tdrightmiddle from '@/view/middlePages/favorites/dimensions/twoDimensions/tDrightViews/tDrightMiddle/TDrightMiddle.vue'
import TDrightBottom from '@/view/middlePages/favorites/dimensions/twoDimensions/tDrightViews/tDrightMiddle/TDrightBottom.vue'
import TDrightTop from '@/view/middlePages/favorites/dimensions/twoDimensions/tDrightViews/tDrightMiddle/TDrightTop.vue'

import {ref} from 'vue'
export default {
  name: 'Animation',
  components: {
    Tdrightmiddle,
    TDrightBottom,
    TDrightTop
  },
  setup(){
   let msgList = ref([
                       {
                       id: "id1",
                       name: "name1",
                       address: "address1",
                       css:"unselectedcss"
                       },
                       {
                       id: "id2",
                       name: "name2",
                       address: "address2",
                       css:"unselectedcss"
                       },
                       {
                       id: "id3",
                       name: "name3",
                       address: "address3",
                       css:"unselectedcss"
                       },
                       {
                       id: "id4",
                       name: "name4",
                       address: "address4",
                       css:"unselectedcss"
                       }
                     ]);

      let hasselecteds =ref([]);
      return{msgList,
             hasselecteds}
  }

}
</script>

<style scoped>
.tdrightcss{
   height:100%;
   width:100%;
}
.tdtopcss{
   height:5%;
   width:100%;
}
.tdmiddlecss{
   height:90%;
   width:100%;
}
.tdbottomcss{
   height:5%;
   width:100%;
   background-color: green;
}
</style>