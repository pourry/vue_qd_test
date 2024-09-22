<template>
    <div class="overalllayout" >
        <Top class='topcss'></Top>
        <Middle class='middlecss' ></Middle>
        <Bottom class='bottomcss' ></Bottom>
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
  }
}
</script>


<style>
.overalllayout{
   height: 100%; 
   width: 100%;
}
.topcss {
  height: 5%;
  background-color: #CCD3DB;
  border-radius: 10px 10px 0 0;
}
.middlecss {
  height: 80%;
  background-color: #E7EBED;
  border: solid white 10px;
  margin: -10px;
  border-radius: 10px;
  background-image: url(../assets/homePage/83066660_p0.png);
  background-repeat: no-repeat; 
  background-position: center center; /* 水平垂直居中 */
  background-size: cover;
  
}
.bottomcss{
  height: 15%;
  background-color: #292B43;
  border-radius: 0 0 10px 10px;
}

/*  当窗口最小为600px 使用以下样式 */
@media (max-width: 550px) {
  .overalllayout {
      width:550px
  }
}
</style>