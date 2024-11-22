<template>
    <div class="overalllayout" >
        <Top class='topcss'></Top>
        <Middle class='middlecss' ></Middle>
        <Bottom class='bottomcss' ></Bottom>
          <el-backtop :right="10" :bottom="100" />
        <div class="showBulletFrame" id="showBulletFrame" @click="toshow">
          <div> <el-icon><DArrowLeft /></el-icon></div>
        </div>
        <div class="bulletFrame" id="bulletFrame">
          <div>
              <div class="bulletFrame-left">
              <div @click="tohidden"><el-icon><DArrowRight /></el-icon></div>
              </div>
              <div class="bulletFrame-body" >111</div>
          </div>
        </div>
    </div>
</template>

<script>
import Top from './homePageForm/Top.vue'
import Middle from './homePageForm/Middle.vue'
import Bottom from './homePageForm/Bottom.vue'
export default {
  name: 'HomePage',
  components: {
    Top,
    Middle,
    Bottom
  },
  setup(){
    let tohidden =function(){
      let hiddenbody =document.getElementById("bulletFrame");
      hiddenbody.style.display = "none";
      let showbody = document.getElementById("showBulletFrame");
      showbody.style.display = "block";
    }
    let toshow = function(){
      let hiddenbody =document.getElementById("bulletFrame");
      hiddenbody.style.display = "block";
      let showbody = document.getElementById("showBulletFrame");
      showbody.style.display = "none";
    }
    return {tohidden,toshow}
  }
}
</script>


<style>
.overalllayout{
   height: 100%; 
   width: 100%;
   position:relative;
}
.topcss {
  height: 5%;
  background-color: #CCD3DB;
  border-radius: 10px 10px 0 0;
}
.middlecss {
  height: 80%;
  background-color: #E7EBED;
  border: solid white 5px;
  margin: 0 0 0 -5px ;
  border-radius: 10px;
  /*background-image: url(../assets/homePage/83066660_p0.png);*/
  background-repeat: no-repeat; 
  background-position: center center; /* 水平垂直居中 */
  background-size: cover;
  
}
.bottomcss{
  height: 15%;
  background-color: #292B43;
  border-radius: 0 0 10px 10px;
}

.bulletFrame{
  display:none;
  z-index:999;
  width:400px;
  height:300px;
  position:fixed;
  bottom:0;
  right:0;
  background-color:rgba(79,83,91);
}
.bulletFrame>div{
  height:100%;
  width:100%;
  display:flex;
}
.bulletFrame-left{
  height:100%;
  width:5%;
  position:relative;
  display:flex;
  align-items:center;
  justify-content:center;
  flex-direction: row-reverse;
  
  
}
.bulletFrame-left >div{
  background-color:rgba(127,130,136,0.5);
  height:100%;
  width:100%;
  display:flex;
  align-items:center;
  justify-content:center;
  

}
.bulletFrame-left >div:hover{
  background-color:rgba(127,130,136);
  cursor:pointer;

}
.bulletFrame-body{
  height:100%;
  width:95%;
  background-color:red;
}
.showBulletFrame{
  z-index:999;
  height:100px;
  position:fixed;
  bottom:0;
  right:0;
  background-color:rgba(79,83,91);

}
.showBulletFrame>div{
  height:100%;
  width:100%;
  display:flex;
  align-items:center;
  justify-content:center;
}
.showBulletFrame:hover{
  background-color:rgba(127,130,136);
  cursor:pointer;
}
/*  当窗口最小为600px 使用以下样式 */
@media (max-width: 550px) {
  .overalllayout {
      width:550px
  }
}
</style>