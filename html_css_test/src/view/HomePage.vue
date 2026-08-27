<template>
    <div class="overalllayout" >
        <div class='topcss'><Top /></div>
        <div class='main-scroll'>
          <div class='middlecss'><Middle /></div>
          <div class='bottomcss'><Bottom /></div>
        </div>
        
        <!-- Chat widget -->
        <ShowChats />
    </div>
</template>

<script>
import Top from './homePageForm/Top.vue'
import Middle from './homePageForm/Middle.vue'
import Bottom from './homePageForm/Bottom.vue'
import ShowChats from './chats/Show_chats.vue'

export default {
  name: 'HomePage',
  components: {
    Top,
    Middle,
    Bottom,
    ShowChats
  },

}
</script>


<style>
.overalllayout{
   height: 100%; 
   width: 100%;
   position:relative;
   background-color: var(--theme-bg-page);
   display: flex;
   flex-direction: column;
}
.topcss {
  height: 56px;
  background: linear-gradient(180deg, var(--theme-bg-top) 0%, rgba(255,255,255,0.98) 100%);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03);
  z-index: 100;
  flex-shrink: 0;
  overflow: visible;
  position: relative;
}
.topcss::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    var(--theme-border-light) 20%, 
    var(--theme-border-light) 80%, 
    transparent 100%);
}
.main-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  /* 关键：flex 列布局，让子元素能正确分配高度 */
  display: flex;
  flex-direction: column;
}
.middlecss {
  background-color: var(--theme-bg-middle);
  position: relative;
  /* 关键：占满剩余高度，允许内部 flex 子元素正确传递高度 */
  flex: 1;
  min-height: 0;
}
.bottomcss{
  background-color: var(--theme-bg-bottom);
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
  position: relative;
  /* 关键：底部栏保持自身内容高度，不被压缩 */
  flex-shrink: 0;
}

/* 中间区域与顶/底的连接样式 */
.middlecss::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    var(--theme-border) 20%, 
    var(--theme-border) 80%, 
    transparent 100%);
}
</style>
