<template>
    <div class="zycss">
        <div class="zmdcss">
             <el-carousel :interval="4000" type="card"  height="200px" >
                <el-carousel-item v-for="item in 6" :key="item">
                  <h3 text="2xl" justify="center">{{ item }}</h3>
                </el-carousel-item>
              </el-carousel>
        </div>
        <div class="export">
           <div class="exportleft">
                    <div class="urlexport"> 
                      展示网址收藏 已共享的
                    </div>
                    <div class="acgexport">
                      展示acg
                      <div>动画</div>
                      <div>漫画</div>
                      <div>小说</div>
                      <div>游戏</div>
                    </div>
           </div>
           <div class="exportright">
           右侧 热度
           </div>
        </div>


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
.zycss{
  width:100%;
  height:100%;
  padding-left:1%;
  padding-right:1%;
}
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.zmdcss{
  height:20%;
  width:98%;
  overflow:hidden
}
.export{
  height:100%;
  width:100%;
  display:flex;
}
.exportleft{
  height:100%;
  width:70%;
}
.exportright{
  height:100%;
  width:30%
}
.urlexport{
  height:10%;
  width:100%;
}
.acgexport{
  width:100%;
  height:40%
}
</style>