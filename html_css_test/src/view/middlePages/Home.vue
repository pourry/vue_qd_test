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
                      展示acg
                      <div class="animationexport">
                      动画
                      <ul>
                       <li>1</li>
                       <li>2</li>
                       <li>3</li>
                      </ul>
                      </div>
                      <div>漫画</div>
                      <div>小说</div>
                      <div>游戏</div>
                    </div>
           </div>
           <div class="exportmiddle">
           </div>
           <div class="exportright">
            <div class="rdphtitle">热度排行</div>
              <el-tabs v-model="activeName" class="demo-tabs rdphbody" @tab-click="handleClick" >
                <el-tab-pane label="网址" name="urlShare"  class="rdphlist">
                  <ul>
                   <li v-for="item of urlhotList.list" :key="item.urllogopath">
                     {{item.index}}.
                      <el-avatar shape="square" :size="20">
                        <img
                          :src="item.urllogopath" 
                        />
                      </el-avatar>
                      <span @click="tourl(item.url)">{{item.url}}</span>
                   </li>
                  </ul>

                </el-tab-pane>
                <el-tab-pane label="Config" name="second">Config</el-tab-pane>
                <el-tab-pane label="Role" name="third">Role</el-tab-pane>
                <el-tab-pane label="Task" name="fourth">Task</el-tab-pane>
              </el-tabs>
           
           </div>
        </div>


    </div>
</template>

<script>
import { ref,reactive,onMounted } from 'vue';
import urlCollectionapi from '@/api/urlCollection'
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
    })

    //   url 展示 ---------------------------------开始-----------------------------------------------
    let scoll = reactive({"scollValue": 0,
                          "leftcss":"urlexportleft",
                          "rightcss":"urlexportright"})
    let scrollToLeft = function () {
       let urlshareul = document.getElementById("urlshareul");
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
            tourl }
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
}

.urlshareul > li{
  width:6rem;
  height:80%;
  border:solid 1px red;
  margin-left:0.5%;
  margin-right:0.5%;
  background-color:rgba(106,241,230,0.2);
  
}
.urlshareul > li:hover{
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
}
.rdphlist ul li {
  margin:4%;
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
  height:40%
}
.animationexport{
  width:100%;
  height:33%;
  border: solid 1px red;
}
</style>