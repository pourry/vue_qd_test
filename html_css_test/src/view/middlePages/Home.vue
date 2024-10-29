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
                      <div class="urlexportleft"><div><el-icon><ArrowLeftBold /></el-icon></div></div>
                      <div class="urlexportright"><div><el-icon><ArrowRightBold /></el-icon></div></div>
                      <ul class="urlshareul" id="urlshareul">
                       <li>
                                <div  class="urlexportimg">
                                    <el-avatar src="https://empty" @error="errorHandler">
                                      <img
                                        src="###" 
                                      />
                                    </el-avatar>
                                </div>
                                <ul class="urlexportmsg">
                                  <li>名称：</li>
                                  <li>网址：
                                        <el-tooltip
                                          class="box-item"
                                          effect="dark"
                                          :content="11111"
                                          placement="bottom-start"
                                        >
                                          <a href="#"  target="_blank">11111111111</a>
                                        </el-tooltip>
                                  </li> 
                                </ul>
                       </li>
                       <li>
                        <div  class="urlexportimg">
                                    <el-avatar src="https://empty" @error="errorHandler">
                                      <img
                                        src="###" 
                                      />
                                    </el-avatar>
                                </div>
                                <ul class="urlexportmsg">
                                  <li>名称：</li>
                                  <li>网址：
                                        <el-tooltip
                                          class="box-item"
                                          effect="dark"
                                          :content="11111"
                                          placement="bottom-start"
                                        >
                                          <a href="#"  target="_blank">22222222222</a>
                                        </el-tooltip>
                                  </li> 
                                </ul>
                       </li>
                       <li>
                        <div  class="urlexportimg">
                                    <el-avatar src="https://empty" @error="errorHandler">
                                      <img
                                        src="###" 
                                      />
                                    </el-avatar>
                                </div>
                                <ul class="urlexportmsg">
                                  <li>名称：</li>
                                  <li>网址：
                                        <el-tooltip
                                          class="box-item"
                                          effect="dark"
                                          :content="11111"
                                          placement="bottom-start"
                                        >
                                          <a href="#"  target="_blank">33333333333333</a>
                                        </el-tooltip>
                                  </li> 
                                </ul>
                       </li>
                       <li>
                        <div  class="urlexportimg">
                                    <el-avatar src="https://empty" @error="errorHandler">
                                      <img
                                        src="###" 
                                      />
                                    </el-avatar>
                                </div>
                                <ul class="urlexportmsg">
                                  <li>名称：</li>
                                  <li>网址：
                                        <el-tooltip
                                          class="box-item"
                                          effect="dark"
                                          :content="11111"
                                          placement="bottom-start"
                                        >
                                          <a href="#"  target="_blank">4444444444444</a>
                                        </el-tooltip>
                                  </li> 
                                </ul>
                       </li>
                       <li>
                        <div  class="urlexportimg">
                                    <el-avatar src="https://empty" @error="errorHandler">
                                      <img
                                        src="###" 
                                      />
                                    </el-avatar>
                                </div>
                                <ul class="urlexportmsg">
                                  <li>名称：</li>
                                  <li>网址：
                                        <el-tooltip
                                          class="box-item"
                                          effect="dark"
                                          :content="11111"
                                          placement="bottom-start"
                                        >
                                          <a href="#"  target="_blank">555555555555555</a>
                                        </el-tooltip>
                                  </li> 
                                </ul>
                       </li>
                       <li>
                        <div  class="urlexportimg">
                                    <el-avatar src="https://empty" @error="errorHandler">
                                      <img
                                        src="###" 
                                      />
                                    </el-avatar>
                                </div>
                                <ul class="urlexportmsg">
                                  <li>名称：</li>
                                  <li>网址：
                                        <el-tooltip
                                          class="box-item"
                                          effect="dark"
                                          :content="11111"
                                          placement="bottom-start"
                                        >
                                          <a href="#"  target="_blank">6666666666666</a>
                                        </el-tooltip>
                                  </li> 
                                </ul>
                       </li>
                       <li>
                        <div  class="urlexportimg">
                                    <el-avatar src="https://empty" @error="errorHandler">
                                      <img
                                        src="###" 
                                      />
                                    </el-avatar>
                                </div>
                                <ul class="urlexportmsg">
                                  <li>名称：</li>
                                  <li>网址：
                                        <el-tooltip
                                          class="box-item"
                                          effect="dark"
                                          :content="11111"
                                          placement="bottom-start"
                                        >
                                          <a href="#"  target="_blank">77777777777777777</a>
                                        </el-tooltip>
                                  </li> 
                                </ul>
                       </li>
                       <li>
                        <div  class="urlexportimg">
                                    <el-avatar src="https://empty" @error="errorHandler">
                                      <img
                                        src="###" 
                                      />
                                    </el-avatar>
                                </div>
                                <ul class="urlexportmsg">
                                  <li>名称：</li>
                                  <li>网址：
                                        <el-tooltip
                                          class="box-item"
                                          effect="dark"
                                          :content="11111"
                                          placement="bottom-start"
                                        >
                                          <a href="#"  target="_blank">888888888888</a>
                                        </el-tooltip>
                                  </li> 
                                </ul>
                       </li>
                       <li>
                        <div  class="urlexportimg">
                                    <el-avatar src="https://empty" @error="errorHandler">
                                      <img
                                        src="###" 
                                      />
                                    </el-avatar>
                                </div>
                                <ul class="urlexportmsg">
                                  <li>名称：</li>
                                  <li>网址：
                                        <el-tooltip
                                          class="box-item"
                                          effect="dark"
                                          :content="11111"
                                          placement="bottom-start"
                                        >
                                          <a href="#"  target="_blank">999999999999</a>
                                        </el-tooltip>
                                  </li> 
                                </ul>
                       </li>
                       <li>
                        <div  class="urlexportimg">
                                    <el-avatar src="https://empty" @error="errorHandler">
                                      <img
                                        src="###" 
                                      />
                                    </el-avatar>
                                </div>
                                <ul class="urlexportmsg">
                                  <li>名称：</li>
                                  <li>网址：
                                        <el-tooltip
                                          class="box-item"
                                          effect="dark"
                                          :content="11111"
                                          placement="bottom-start"
                                        >
                                          <a href="#"  target="_blank">101011010101011</a>
                                        </el-tooltip>
                                  </li> 
                                </ul>
                       </li>
                      </ul>
                    </div>
                    <div class="acgexport">
                      展示acg
                      <div>动画</div>
                      <div>漫画</div>
                      <div>小说</div>
                      <div>游戏</div>
                    </div>
           </div>
           <div class="exportmiddle">
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
    onMounted(()=>{
      console.log(document.getElementById("urlshareul").scrollWidth)
    })
    let errorHandler = () => true
    return {errorHandler }
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
  width:65%;
}
.exportmiddle{
  height:100%;
  width:3%;
}
.exportright{
  height:100%;
  width:32%
  
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
    white-space:nowrap; /*不让文字内容换行*/
    overflow:hidden;/*文字溢出的部分隐藏起来*/
    text-overflow:ellipsis; /*用...替代溢出的部分*/
}
.acgexport{
  width:100%;
  height:40%
}
.urlexportleft{
  position: absolute;
  height:80%;
  width:30px;
  display:flex;
  align-items:center;
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
</style>