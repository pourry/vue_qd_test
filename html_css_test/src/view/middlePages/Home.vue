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
                      <div class="urlexporttitle">
                       <el-icon><Eleme /></el-icon>
                        展示网址收藏 已共享的
                      </div>
                      <div :class="scoll.leftcss"><div @click="scrollToRight"><el-icon><ArrowLeftBold /></el-icon></div></div>
                      <div :class="scoll.rightcss"><div  @click="scrollToLeft"><el-icon><ArrowRightBold /></el-icon></div></div>
                      <ul class="urlshareul" id="urlshareul">
                       <li v-for="item of urlList.list" :key="item.id">

                                <div  class="urlexportimg">
                                    <el-avatar>
                                      <img
                                        :src="item.urllogopath" 
                                      />
                                    </el-avatar>
                                </div>
                                <ul class="urlexportmsg">
                                  <li>名称：{{item.urlname}}</li>
                                  <li>网址：
                                        <el-tooltip
                                          class="box-item"
                                          effect="dark"
                                          :content="item.url"
                                          placement="bottom-start"
                                        >
                                          <a :href="item.url"  target="_blank">{{item.url}}</a>
                                        </el-tooltip>
                                  </li> 
                                </ul>
                       </li>
                      </ul>
                    </div>
                    <div class="acgexport">
                     <div class="acgexporttitle">
                       展示acg
                     </div>
                     <div class="acgexportbody">
                          <div class="exportmsg">
                              <div class="exportmsgtitle">
                                <el-icon><Aim /></el-icon>
                                动画
                              </div>
                              <ul>
                              <li  v-for="item of acgList.animationList" :key="item.id">
                                    <ul class="exportmsgdetails">
                                    <li>名称：{{item.name}}</li>
                                    </ul>
                                    <el-image class="exportmsgimg" :src="item.pictures.length >0 ? item.pictures[0].pictureUrl : undefined" >
                                            <template #error>
                                                <div class="exportmsgimg-slot">
                                                  <el-icon><Picture /></el-icon>
                                                </div>
                                              </template>
                                    </el-image>
                              </li>
                              </ul>
                          </div>
                          <div class="exportmsg">
                              <div class="exportmsgtitle">
                                <el-icon><Aim /></el-icon>
                                漫画
                              </div>
                              <ul>
                              <li  v-for="item of acgList.comicList" :key="item.id">
                                    <ul class="exportmsgdetails">
                                    <li>名称：{{item.name}}</li>
                                    </ul>
                                    <el-image class="exportmsgimg" :src="item.pictures.length >0 ? item.pictures[0].pictureUrl : undefined" >
                                            <template #error>
                                                <div class="exportmsgimg-slot">
                                                  <el-icon><Picture /></el-icon>
                                                </div>
                                              </template>
                                    </el-image>
                              </li>
                              </ul>
                          </div>
                          <div class="exportmsg">
                                                    <div class="exportmsgtitle">
                                <el-icon><Aim /></el-icon>
                                小说
                              </div>
                              <ul>
                              <li  v-for="item of acgList.novelList" :key="item.id">
                                    <ul class="exportmsgdetails">
                                    <li>名称：{{item.name}}</li>
                                    </ul>
                                    <el-image class="exportmsgimg" :src="item.pictures.length >0 ? item.pictures[0].pictureUrl : undefined" >
                                            <template #error>
                                                <div class="exportmsgimg-slot">
                                                  <el-icon><Picture /></el-icon>
                                                </div>
                                              </template>
                                    </el-image>
                              </li>
                              </ul>
                          </div>
                          <div class="exportmsg">
                              <div class="exportmsgtitle">
                                <el-icon><Aim /></el-icon>
                                游戏
                              </div>
                              <ul>
                              <li  v-for="item of acgList.gameList" :key="item.id">
                                    <ul class="exportmsgdetails">
                                    <li>名称：{{item.name}}</li>
                                    </ul>
                                    <el-image class="exportmsgimg" :src="item.pictures.length >0 ? item.pictures[0].pictureUrl : undefined" >
                                            <template #error>
                                                <div class="exportmsgimg-slot">
                                                  <el-icon><Picture /></el-icon>
                                                </div>
                                              </template>
                                    </el-image>
                              </li>
                              </ul>
                          </div>
                          <div class="exportmsg">
                            <div class="exportmsgtitle exportmsgtitleflx">
                              <div  @click="toselectdiv(1)">1</div>
                              <div @click="toselectdiv(2)">2</div>
                              <div  @click="toselectdiv(3)">3</div>
                            </div>
                            <div class="exportmsgtableflx">
                              <div class="scollborder"></div>
                              <div>
                                <div>111111111111111111111111111111111111</div>
                              </div>
                              <div><div>22222</div></div>
                              <div><div>33333</div></div>
                            </div>
                          </div>
                        </div>
                        
                     </div>
                      
           </div>
           <div class="exportmiddle">
           </div>
           <div class="exportright">
            <div class="rdphtitle">
            <el-icon><Histogram /></el-icon>
            热度排行</div>
              <el-tabs v-model="activeName" class="demo-tabs rdphbody" @tab-click="handleClick" >
                <el-tab-pane label="网址" name="urlShare"  class="rdphlist">
                  <ul>
                   <li v-for="item of urlhotList.list" :key="item.urllogopath">
                     <div   >{{item.index}}.</div>
                      <div @click="tourl(item.url)">
                          <el-avatar shape="square" :size="20">
                            <img
                              :src="item.urllogopath" 
                            />
                          </el-avatar>
                          {{item.url}}
                      </div>
                      <div>{{item.countpath}}</div>
                   </li>
                  </ul>

                </el-tab-pane>
                <el-tab-pane label="动画" name="动画">Animation</el-tab-pane>
                <el-tab-pane label="漫画" name="Comic">Comic</el-tab-pane>
                <el-tab-pane label="小说" name="Novel">Novel</el-tab-pane>
                <el-tab-pane label="游戏" name="Game">Game</el-tab-pane>
              </el-tabs>
           
           </div>
        </div>


    </div>
</template>

<script>
import { ref,reactive,onMounted,onUnmounted} from 'vue';
import urlCollectionapi from '@/api/urlCollection'
import acgapi from '@/api/acg'
import $ from 'jquery' 
export default {
  name: 'Home',
  components: {
  },
  setup(){
    onMounted(()=>{
      //  console.log(document.getElementById("urlshareul").scrollWidth); //获取滚动条长度
      //  console.log(document.getElementById("urlshareul").clientWidth); //获取元素长度
      //  console.log(document.getElementById("urlshareul").offsetWidth); //滑块的长度
      togeturlshow();
      togeturlhot();
      getacgList();
      automaticscroll();

    })
    onUnmounted(()=>{
      //销毁定时器
      clearInterval(timer.value);
    })

    //   url 展示 ---------------------------------开始-----------------------------------------------
    let scoll = reactive({"scollValue": 0,
                          "leftcss":"urlexportleft",
                          "rightcss":"urlexportright"})
    let scrollToLeft = function () {
       let urlshareul = document.getElementById("urlshareul");
      //  urlshareul.scrollIntoView({
      //      behavior: 'smooth' // 平滑滚动
      //   });
       scoll.scollValue = scoll.scollValue + 100;
       //scrollWidth  滚动条的 长度   offsetWidth 滑块的长度
       if((urlshareul.scrollWidth -  scoll.scollValue- urlshareul.offsetWidth ) <= 0){
         scoll.scollValue = urlshareul.scrollWidth - urlshareul.offsetWidth;
         scoll.rightcss = "urlexportrighthidden";
       } else if(scoll.scollValue  >= 0){
        scoll.leftcss = "urlexportleft";
       }

       urlshareul.scrollLeft =  scoll.scollValue;
    }
        let scrollToRight = function () {
       let urlshareul = document.getElementById("urlshareul");
        scoll.scollValue =  scoll.scollValue - 100;
       if( scoll.scollValue  <= 0){
         scoll.scollValue = 0;
         scoll.leftcss ="urlexportlefthidden"
       }else if((urlshareul.scrollWidth -  scoll.scollValue- urlshareul.offsetWidth ) >= 0){
        scoll.rightcss ="urlexportright"
       }
       urlshareul.scrollLeft =  scoll.scollValue;
    }
    let urlList = reactive({"list":[]})
    let togeturlshow = function(){
      urlCollectionapi.urlshow().then(res=>{
         if(res.successful){
          urlList.list = res.resultValue;
         }
      })
    }
    let timer = ref("");
    let automaticscroll = function(){
      //每3秒 向右移动100
      timer.value =setInterval(function() {
        scoll.scollValue = scoll.scollValue + 100;
         let urlshareul = document.getElementById("urlshareul");
         
         if((urlshareul.scrollWidth -  scoll.scollValue- urlshareul.offsetWidth ) <= 0){
            urlshareul.scrollLeft = 0;
            scoll.scollValue = 0;
         }else{
          scrollToLeft();
         }
       }, 10000)
    }
    //   url 展示 ---------------------------------------结束-----------------------------------------

    let activeName = ref('urlShare')
    let urlhotList = reactive({"list":[]})

    let handleClick = (tab, event) => {
      console.log(tab, event)
      if(tab.props.name == "urlShare"){
         togeturlhot();
      }
    }

    let togeturlhot = function(){
        urlCollectionapi.urlhot().then(res=>{
          if(res.successful){
            urlhotList.list = res.resultValue
          }
        })
    }
    let tourl = function(url){
      window.open(url, '_blank');
    }

    let acgList = reactive({"animationList":[],
                            "comicList":[],
                            "novelList":[],
                            "gameList":[]})
    let getacgList =function(){
       acgapi.getshowAce().then(res=>{
        if(res.successful){
          acgList.animationList = res.resultValue.animations;
          acgList.comicList = res.resultValue.comics;
          acgList.novelList = res.resultValue.novels;
          acgList.gameList = res.resultValue.games;
        }
       })
    }

    let toselectdiv = function(index){
      let width = parseInt($('.scollborder').css("width"));
      let scoll =  parseInt($('.exportmsgtableflx').css("width"));
      if(index == 1){
        $('.scollborder').css("left","0px")
      }
     else if(index == 2){
      $('.scollborder').css("left",(scoll/2-width/2)+"px")
     }else{
      $('.scollborder').css("left",(scoll-width)+"px")
      
     }
     
    }
    return {
            scoll,
            scrollToLeft,
            scrollToRight,
            togeturlshow,
            urlList,
            activeName,
            handleClick,
            urlhotList,
            togeturlhot,
            tourl,
            acgList,
            getacgList,
            automaticscroll,
            toselectdiv }
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
  height:80%;
  width:98%;
  display:flex;
}
.exportleft{
  height:100%;
  width:65%;
}
.exportmiddle{
  height:100%;
  width:3%;
}
.exportright{
  height:100%;
  width:32%;
  border:solid 1px red;
  
}
.urlexport{
  height:10%;
  width:100%;
  position: relative;
  border:solid 1px red;
}
.urlexporttitle{
  font-size:1.5rem;
  position: reactive;
  height:20%;
}

.urlshareul{
  position: reactive;
  display: flex; 
  align-content: flex-start; /*从左到右*/
  align-items: center;  /*上下居中*/
  height:80%;
  width:98%;
  list-style-type:none;
  overflow: hidden; 
  margin:0;
  padding:0;
  margin-left:1%;
  scroll-behavior: smooth; /*平滑滚动*/
}

.urlshareul > li{
  width:6rem;
  height:80%;
  border:solid 1px red;
  margin-left:0.5%;
  margin-right:0.5%;
  background-color:rgba(106,241,230,0.2);
  cursor:pointer;
  
}
.urlshareul > li:hover{
  transform:scale(1.1);
  transition: all 0.1s;
  background-color:rgba(106,241,230,0.6);
  
}
.urlexportimg{
  width: 100%;
  height:50%;
}
.urlexportmsg{
  width:100%;
  margin:0;
  padding:0;
  height:50%;
  list-style-type: none;
}
.urlexportmsg > li{
  font-size:0.8rem;
  height:50%;
  white-space:nowrap; /*不让文字内容换行*/
  overflow:hidden;/*文字溢出的部分隐藏起来*/
  text-overflow:ellipsis; /*用...替代溢出的部分*/
}

.urlexportleft{
  position: absolute;
  height:80%;
  width:30px;
  display:flex;
  align-items:center;
  
}
.urlexportlefthidden{
  display:none;
}
.urlexportleft >div{
  width:100%;
  height:40%;
  background-color:rgba(18,23,81,.0);
  cursor:pointer;
  display:flex;
  align-items:center;
}
.urlexportleft >div:hover{
  background-color:rgba(18,23,81,.3);
}
.urlexportleft >div .el-icon{
  
  position:absolute;
  right:0px;
}
.urlexportright{
  position:absolute;
  height:80%;
  right:0;
  width:30px;
  display:flex;
  align-items:center;
}
.urlexportrighthidden{
  display:none;
}
.urlexportright >div{
  width:100%;
  height:40%;
  background-color:rgba(18,23,81,.0);
  cursor:pointer;
  display:flex;
  align-items:center;
}
.urlexportright >div:hover{
  background-color:rgba(18,23,81,.3);
}
/* 网址收藏展示 ----------------------------------------------------------完毕 */
.rdphtitle{
  width:100%;
  height:2%;
  font-size:1.5rem;
}
.rdphbody{
  width:100%;
  height:98%;
}
.rdphlist{
  height:100%;
  width:100%;
  border: solid 1px red;
}
.rdphlist ul{
  padding:0;
  height:100%;
  width:100%;
}
.rdphlist ul li {
  height:3.3%;
  width:100%;
  white-space:nowrap; /*不让文字内容换行*/
  overflow:hidden;/*文字溢出的部分隐藏起来*/
  text-overflow:ellipsis; /*用...替代溢出的部分*/
  display:flex;
  align-items:center;
  cursor:pointer;
}
.rdphlist ul li >div{
  width:30px;
  text-align:right;
}
.rdphlist ul li >div:nth-child(2){
  width:80%;
  text-align:left;
white-space:nowrap; /*不让文字内容换行*/
  overflow:hidden;/*文字溢出的部分隐藏起来*/
  text-overflow:ellipsis; /*用...替代溢出的部分*/
}
.rdphlist ul li:hover {
  background-color:rgba(18,23,81,.2);
}
.rdphlist ul li span{
  cursor:pointer;
}
/* 网址热度排行展示 ----------------------------------------------------------完毕 */

.acgexport{
  width:100%;
  height:90%;
}
.acgexporttitle{
  width:100%;
  height:5%;
  font-size:1.5rem;
}
.acgexportbody{
  width:100%;
  height:95%;
    border: solid 1px green;
}
.exportmsg{
  position: relative;
  width:100%;
  height:20%;
}
.exportmsgtitle{
  width:100%;
  height:20%;
  font-size:1.5rem;
}
.exportmsgtitleflx{
  display: flex;
  height: 15%;
  justify-content: space-between;
}
.exportmsgtitleflx>div{
  width:30%;
  cursor: pointer;
  background-color: red;
}
.exportmsgtableflx{
  position: relative;
  display: flex;
  height: 85%;
  justify-content: space-between;
  
}
.exportmsgtableflx>div{

  width: 30%;
  height: 100%;
  cursor: pointer;
  border: solid 1px green;
 
}
.exportmsgtableflx>div>div{
  
  height: 100%;
  cursor: pointer;
  width: 100%;
  overflow:hidden;
  text-overflow:ellipsis;
}
.scollborder{
  position: absolute;
  width: 30%;
  border: solid 1px red !important;

  /* left: 50%;
  transform: translate(-50%, 0); */
  /* left: calc(100%/3); */
  /* transform-origin: 0 0; */
  left: 0;
  transition: all 1s;
}

/* .exportmsgtableflx>div>div:hover{
  position: relative;
  cursor: pointer;
  background-color: rgb(0, 225, 255);
  width: 150%;
  border: solid 1px red;
  z-index: 9999;
  margin-left: -25%;
} */


.exportmsg>ul{
  width:100%;
  height:80%;
  display:flex;
  flex-wrap:wrap;
  
  margin:0;
  padding:0;
}
.exportmsg> ul>li{
  position:relative;
  height:48.2%;
  width:19.2%;
  margin:0.2%;
  list-style-type: none;
  display:flex;
  transition: all 0.1s;
  cursor:pointer;
}
.exportmsg> ul>li:hover{
  transform:scale(1.2); /*scale 定义 2D 缩放转换。*/
  
  z-index:999;
}
.exportmsg>ul>li>div{
  height:auto;
  width:100%;
}
.exportmsgimg{
  height:100%;
  width:100%;
}
.exportmsgimg-slot{
  width:100%;
  height:100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
}
.exportmsgdetails{
  position:absolute;
  width:100%;
  right:0;
  bottom:0;
  z-index:1;

}
.exportmsgdetails>li{
  background-color:rgba(18,23,81,.2);
  white-space:nowrap; /*不让文字内容换行*/
  overflow:hidden;/*文字溢出的部分隐藏起来*/
  text-overflow:ellipsis; /*用...替代溢出的部分*/
}
</style>