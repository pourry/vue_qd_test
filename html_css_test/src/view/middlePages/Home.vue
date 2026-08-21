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
  box-sizing: border-box;
}
.el-carousel__item h3 {
  color: var(--theme-text-regular);
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: var(--theme-primary-light);
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: var(--theme-bg-middle);
}
.zmdcss{
  height:20%;
  width:98%;
  overflow:hidden;
  border-radius: var(--theme-radius-lg);
  box-shadow: var(--theme-shadow-card);
  background: var(--theme-bg-card);
  padding: var(--theme-spacing-sm);
  box-sizing: border-box;
  margin-bottom: var(--theme-spacing-md);
}
.export{
  height:78%;
  width:98%;
  display:flex;
  gap: var(--theme-spacing-md);
}
.exportleft{
  height:100%;
  width:65%;
  display: flex;
  flex-direction: column;
  gap: var(--theme-spacing-md);
}
.exportmiddle{
  height:100%;
  width:3%;
}
.exportright{
  height:100%;
  width:32%;
  border:1px solid var(--theme-border);
  border-radius: var(--theme-radius-lg);
  background: var(--theme-bg-card);
  padding: var(--theme-spacing-md);
  box-sizing: border-box;
  box-shadow: var(--theme-shadow-card);
  overflow: hidden;
}
.urlexport{
  height:35%;
  width:100%;
  position: relative;
  border:1px solid var(--theme-border);
  border-radius: var(--theme-radius-md);
  background: var(--theme-bg-card);
  padding: var(--theme-spacing-sm);
  box-sizing: border-box;
  box-shadow: var(--theme-shadow-card);
}
.urlexporttitle{
  font-size: 1rem;
  font-weight: 600;
  height: 24px;
  display: flex;
  align-items: center;
  gap: var(--theme-spacing-xs);
  color: var(--theme-text-primary);
}

.urlshareul{
  display: flex; 
  align-content: flex-start;
  align-items: center;
  height: calc(100% - 28px);
  width: 100%;
  list-style-type:none;
  overflow-x: auto;
  overflow-y: hidden;
  margin:0;
  padding: 0;
  scroll-behavior: smooth;
}

.urlshareul > li{
  min-width: 120px;
  height: calc(100% - 8px);
  border:1px solid var(--theme-border);
  margin: 4px;
  background-color: var(--theme-primary-light);
  cursor:pointer;
  border-radius: var(--theme-radius-md);
  overflow: hidden;
  transition: all 0.2s ease;
}
.urlshareul > li:hover{
  transform:translateY(-2px);
  box-shadow: var(--theme-shadow-md);
  border-color: var(--theme-primary);
}
.urlexportimg{
  width: 100%;
  height:40%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 4px;
}
.urlexportmsg{
  width:100%;
  margin:0;
  padding: 4px 8px;
  height: 55%;
  list-style-type: none;
  font-size: 12px;
}
.urlexportmsg > li{
  height: 50%;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  color: var(--theme-text-regular);
}

.urlexportleft{
  position: absolute;
  height:100%;
  width:24px;
  display:flex;
  align-items:center;
  justify-content: center;
  
}
.urlexportlefthidden{
  display:none;
}
.urlexportleft >div{
  width:24px;
  height:24px;
  background-color: var(--theme-bg-card);
  border-radius: 50%;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content: center;
  border: 1px solid var(--theme-border);
  transition: all 0.2s;
}
.urlexportleft >div:hover{
  background-color: var(--theme-primary);
  color: var(--theme-text-light);
  border-color: var(--theme-primary);
}
.urlexportright{
  position:absolute;
  height:100%;
  right:0;
  width:24px;
  display:flex;
  align-items:center;
  justify-content: center;
}
.urlexportrighthidden{
  display:none;
}
.urlexportright >div{
  width:24px;
  height:24px;
  background-color: var(--theme-bg-card);
  border-radius: 50%;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content: center;
  border: 1px solid var(--theme-border);
  transition: all 0.2s;
}
.urlexportright >div:hover{
  background-color: var(--theme-primary);
  color: var(--theme-text-light);
  border-color: var(--theme-primary);
}
/* 网址收藏展示 ----------------------------------------------------------完毕 */
.rdphtitle{
  width:100%;
  height: 32px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--theme-spacing-xs);
  color: var(--theme-text-primary);
}
.rdphbody{
  width:100%;
  height: calc(100% - 32px);
}
.rdphlist{
  height:100%;
  width:100%;
  border: none;
}
.rdphlist ul{
  padding:0;
  height:100%;
  width:100%;
  list-style: none;
}
.rdphlist ul li {
  height: 36px;
  width: 100%;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  display:flex;
  align-items:center;
  cursor:pointer;
  padding: 4px 8px;
  border-radius: var(--theme-radius-sm);
  transition: background-color 0.2s;
  color: var(--theme-text-regular);
  font-size: 13px;
}
.rdphlist ul li >div{
  width:30px;
  text-align:right;
  flex-shrink: 0;
}
.rdphlist ul li >div:nth-child(2){
  flex: 1;
  text-align:left;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
.rdphlist ul li:hover {
  background-color: var(--theme-primary-bg);
  color: var(--theme-primary);
}
.rdphlist ul li span{
  cursor:pointer;
}
/* 网址热度排行展示 ----------------------------------------------------------完毕 */

.acgexport{
  width:100%;
  height:62%;
  border: 1px solid var(--theme-border);
  border-radius: var(--theme-radius-md);
  background: var(--theme-bg-card);
  padding: var(--theme-spacing-sm);
  box-sizing: border-box;
  box-shadow: var(--theme-shadow-card);
  overflow: hidden;
}
.acgexporttitle{
  width:100%;
  height: 28px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--theme-spacing-xs);
  color: var(--theme-text-primary);
}
.acgexportbody{
  width:100%;
  height: calc(100% - 28px);
  display: flex;
  flex-wrap: wrap;
  gap: var(--theme-spacing-sm);
  overflow-y: auto;
}
.exportmsg{
  position: relative;
  flex: 1;
  min-width: 45%;
  height: auto;
  display: flex;
  flex-direction: column;
}
.exportmsgtitle{
  width:100%;
  height: 24px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--theme-text-regular);
}
.exportmsgtitleflx{
  display: flex;
  height: 24px;
  justify-content: space-between;
  gap: 4px;
}
.exportmsgtitleflx>div{
  flex: 1;
  cursor: pointer;
  background-color: var(--theme-primary-bg);
  color: var(--theme-primary);
  border-radius: var(--theme-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.2s;
}
.exportmsgtitleflx>div:hover{
  background-color: var(--theme-primary);
  color: var(--theme-text-light);
}
.exportmsgtableflx{
  position: relative;
  display: flex;
  height: calc(100% - 28px);
  justify-content: space-between;
  gap: 4px;
}
.exportmsgtableflx>div{
  flex: 1;
  height: 100%;
  cursor: pointer;
  border: 1px solid var(--theme-border);
  border-radius: var(--theme-radius-sm);
  overflow: hidden;
  position: relative;
}
.exportmsgtableflx>div>div{
  height: 100%;
  width: 100%;
  overflow:hidden;
  text-overflow:ellipsis;
  padding: 4px;
  box-sizing: border-box;
  font-size: 12px;
}
.scollborder{
  position: absolute;
  width: 33.33%;
  border: solid 2px var(--theme-primary) !important;
  left: 0;
  top: 0;
  bottom: 0;
  border-radius: var(--theme-radius-sm);
  transition: all 0.3s ease;
  pointer-events: none;
}

.exportmsg>ul{
  width:100%;
  height: calc(100% - 28px);
  display:flex;
  flex-wrap:wrap;
  gap: 4px;
  margin:0;
  padding:0;
  list-style: none;
  overflow-y: auto;
}
.exportmsg> ul>li{
  position:relative;
  height: 100px;
  flex: 1 1 calc(50% - 4px);
  margin:0;
  cursor:pointer;
  border-radius: var(--theme-radius-sm);
  overflow: hidden;
  transition: all 0.2s ease;
  background: var(--theme-bg-card);
  border: 1px solid var(--theme-border);
}
.exportmsg> ul>li:hover{
  transform:translateY(-2px);
  box-shadow: var(--theme-shadow-md);
  border-color: var(--theme-primary);
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
  background: var(--theme-primary-light);
  color: var(--theme-text-secondary);
}
.exportmsgdetails{
  position:absolute;
  width:100%;
  right:0;
  bottom:0;
  z-index:1;
  padding: 4px 6px;
  box-sizing: border-box;
}
.exportmsgdetails>li{
  background-color: rgba(0,0,0,0.6);
  color: var(--theme-text-light);
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  font-size: 11px;
  border-radius: var(--theme-radius-sm);
}
</style>