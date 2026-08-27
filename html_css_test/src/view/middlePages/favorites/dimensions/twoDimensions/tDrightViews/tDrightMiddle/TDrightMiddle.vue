<template>
    <div class='tdrightmiddlecss'>
      <!-- 视图切换 -->
      <div class="view-toggle-bar">
        <div class="view-toggle">
          <el-tooltip content="卡片视图" placement="bottom">
            <button
              class="toggle-btn"
              :class="{ active: viewMode === 'card' }"
              @click="viewMode = 'card'"
            >
              <el-icon :size="16"><Grid /></el-icon>
            </button>
          </el-tooltip>
          <el-tooltip content="列表视图" placement="bottom">
            <button
              class="toggle-btn"
              :class="{ active: viewMode === 'list' }"
              @click="viewMode = 'list'"
            >
              <el-icon :size="16"><List /></el-icon>
            </button>
          </el-tooltip>
        </div>
      </div>

      <!-- 卡片视图 -->
      <div class='collectshowcss card-view' v-if="viewMode === 'card'">
         <div :class="item.css" @click="tochangeselect(item)" v-for="item in msgList.list" :key="item.id" class="collect-item">
                <span class="hasshareurl" v-if="item.share">
                    <el-icon class="hasshareicon"><Share /></el-icon>
                    <span class="hassharetext">已分享</span>
                </span>
            <div class="card-img-wrapper">
              <el-image class="clickimgcss" :src="item.pictures && item.pictures.length > 0 ? item.pictures[0].pictureUrl : undefined" fit="cover">
                <template #error>
                  <div class="img-error-placeholder">
                    <el-icon :size="32"><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
              <div class="card-hover-overlay">
                <el-icon :size="22"><View /></el-icon>
              </div>
              <div class="card-badges">
                <span class="type-badge" :class="'badge-' + (item.hasend || 'unknown')">
                  {{ getHasEndLabel(item.hasend) }}
                </span>
                <span class="img-count" v-if="item.pictures && item.pictures.length > 1">
                  <el-icon :size="12"><Picture /></el-icon>
                  {{ item.pictures.length }}
                </span>
              </div>
            </div>
            <div class="card-info">
              <h4 class="card-title" :title="item.name">{{ item.name }}</h4>
              <div class="card-detail-row" v-if="item.alias">
                <el-icon :size="12" class="detail-icon"><Document /></el-icon>
                <span class="detail-text" :title="item.alias">{{ item.alias }}</span>
              </div>
              <div class="card-detail-row" v-if="item.address">
                <el-icon :size="12" class="detail-icon"><Link /></el-icon>
                <a class="detail-link" :href="item.address" target="_blank" :title="item.address">{{ item.address }}</a>
              </div>
              <div class="card-detail-row" v-if="item.notes">
                <el-icon :size="12" class="detail-icon"><EditPen /></el-icon>
                <span class="detail-text" :title="item.notes">{{ item.notes }}</span>
              </div>
              <div class="card-footer">
                <el-popover
                  :popper-style="{width:'360px'}"
                  placement="bottom-start"
                  :title="item.name"
                  trigger="click"
                >
                  <template #reference>
                    <el-button type="primary" size="small" round @click.stop>
                      <el-icon :size="14"><View /></el-icon>
                      详情
                    </el-button>
                  </template>
                  <div class="detail-popup">
                    <div class="detail-row">
                      <span class="detail-label">名称</span>
                      <span class="detail-value">{{item.name || '-'}}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">别名</span>
                      <span class="detail-value">{{item.alias || '-'}}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">地址</span>
                      <a v-if="item.address" class="detail-value detail-link" :href="item.address" target="_blank">{{item.address}}</a>
                      <span v-else class="detail-value">-</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">完结状态</span>
                      <span class="detail-value">
                        <el-tag :type="getHasEndTagType(item.hasend)" size="small" effect="light">
                          {{item.hasendLabel || '-'}}
                        </el-tag>
                      </span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">备注</span>
                      <span class="detail-value detail-notes">{{item.notes || '-'}}</span>
                    </div>
                  </div>
                </el-popover>
              </div>
            </div>
            <el-popover
            :popper-style="{width:'360px'}"
              placement="right-start"
              :title="item.name"
              trigger="hover"
            >
                <template #reference>
                <span class="popover-trigger">
                    <ul class='animationmsg'>
                      <li>名称:{{item.name}}</li>
                      <li>地址:<a :href="item.address"  target="_blank">{{item.address}}</a></li>
                      <li>完结状态:{{item.hasendLabel}}</li>
                    </ul>
                </span>
                </template>
                <div class="detail-popup">
                  <div class="detail-row">
                    <span class="detail-label">名称</span>
                    <span class="detail-value">{{item.name || '-'}}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">别名</span>
                    <span class="detail-value">{{item.alias || '-'}}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">地址</span>
                    <a v-if="item.address" class="detail-value detail-link" :href="item.address" target="_blank">{{item.address}}</a>
                    <span v-else class="detail-value">-</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">完结状态</span>
                    <span class="detail-value">
                      <el-tag :type="getHasEndTagType(item.hasend)" size="small" effect="light">
                        {{item.hasendLabel || '-'}}
                      </el-tag>
                    </span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">备注</span>
                    <span class="detail-value detail-notes">{{item.notes || '-'}}</span>
                  </div>
                </div>
            </el-popover>
         </div>
      </div>

      <!-- 列表视图 -->
      <div class="list-view" v-else>
        <div
          v-for="item in msgList.list"
          :key="item.id"
          class="list-item"
          :class="item.css"
          @click="tochangeselect(item)"
        >
          <div class="list-img-wrapper">
            <el-image
              class="list-img"
              :src="item.pictures && item.pictures.length > 0 ? item.pictures[0].pictureUrl : undefined"
              fit="cover"
            >
              <template #error>
                <div class="img-error-placeholder">
                  <el-icon :size="24"><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <div class="list-hover-overlay">
              <el-icon :size="20"><View /></el-icon>
            </div>
            <div class="list-badges">
              <span class="type-badge" :class="'badge-' + (item.hasend || 'unknown')">
                {{ getHasEndLabel(item.hasend) }}
              </span>
              <span class="img-count" v-if="item.pictures && item.pictures.length > 1">
                <el-icon :size="12"><Picture /></el-icon>
                {{ item.pictures.length }}
              </span>
            </div>
            <span class="hasshareurl" v-if="item.share">
              <el-icon class="hasshareicon"><Share /></el-icon>
            </span>
          </div>
          <div class="list-info">
            <div class="list-info-top">
              <h4 class="list-title" :title="item.name">{{ item.name }}</h4>
            </div>
            <div class="list-detail-rows">
              <div class="card-detail-row" v-if="item.alias">
                <el-icon :size="12" class="detail-icon"><Document /></el-icon>
                <span class="detail-text" :title="item.alias">{{ item.alias }}</span>
              </div>
              <div class="card-detail-row" v-if="item.address">
                <el-icon :size="12" class="detail-icon"><Link /></el-icon>
                <a class="detail-link" :href="item.address" target="_blank" :title="item.address">{{ item.address }}</a>
              </div>
              <div class="card-detail-row" v-if="item.notes">
                <el-icon :size="12" class="detail-icon"><EditPen /></el-icon>
                <span class="detail-text" :title="item.notes">{{ item.notes }}</span>
              </div>
            </div>
            <div class="list-info-meta">
              <span class="meta-item">
                <el-icon :size="13"><Picture /></el-icon>
                {{ item.pictures ? item.pictures.length : 0 }} 张图片
              </span>
            </div>
            <div class="list-info-bottom">
              <el-popover
                :popper-style="{width:'360px'}"
                placement="bottom-start"
                :title="item.name"
                trigger="click"
              >
                <template #reference>
                  <el-button type="primary" size="small" round @click.stop>
                    <el-icon :size="14"><View /></el-icon>
                    详情
                  </el-button>
                </template>
                <div class="detail-popup">
                  <div class="detail-row">
                    <span class="detail-label">名称</span>
                    <span class="detail-value">{{item.name || '-'}}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">别名</span>
                    <span class="detail-value">{{item.alias || '-'}}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">地址</span>
                    <a v-if="item.address" class="detail-value detail-link" :href="item.address" target="_blank">{{item.address}}</a>
                    <span v-else class="detail-value">-</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">完结状态</span>
                    <span class="detail-value">
                      <el-tag :type="getHasEndTagType(item.hasend)" size="small" effect="light">
                        {{item.hasendLabel || '-'}}
                      </el-tag>
                    </span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">备注</span>
                    <span class="detail-value detail-notes">{{item.notes || '-'}}</span>
                  </div>
                </div>
              </el-popover>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import {ref,reactive,onMounted,watch} from 'vue'
import { Grid, List, Picture, View, Link, Document, EditPen, Share } from '@element-plus/icons-vue'

export default {
  name: 'TDrightMiddle',
  components: {
    Grid, List, Picture, View, Link, Document, EditPen, Share
  },
  props:{
    msgList:{
      type:Object,
      required: true
    },
    hasselecteds:{
      type:Object,
      required: true
    },
    pagemsg:{
      type:Object,
      required: true
    },
    hasendoptions:{
      type:Object,
      required: true
    }
  },
  emits:["togetList"],
  setup(props,{emit}){
    
    let hasendoptions = reactive(props.hasendoptions)
    let hasselected = ref("unselectedcss")
    let msgList = reactive(props.msgList);
    let hasselecteds = reactive(props.hasselecteds);
    let viewMode = ref("card") // 'card' | 'list'

    const getHasEndLabel = (value) => {
      const found = hasendoptions.find(o => o.value === value)
      return found ? found.label : '未知'
    }

    const getHasEndTagType = (value) => {
      const map = {
        'end': 'success',
        'serialize': '',
        'beforeStart': 'warning'
      }
      return map[value] || 'info'
    }

    const truncateText = (text, maxLen) => {
      if (!text) return ''
      return text.length > maxLen ? text.substring(0, maxLen) + '...' : text
    }

    let toselectcss = function(){
      if(hasselected.value == "unselectedcss"){
         hasselected.value = "selectedcss";
      }else{
         hasselected.value = "unselectedcss";
      }
    }

    let tochangeselect = function(item){
        for(let i = 0; i< msgList.list.length;i++){
          if(item.id == msgList.list[i].id){
            if(msgList.list[i].css == "unselectedcss"){
              msgList.list[i].css = "selectedcss";
              break;
            }else if(msgList.list[i].css == "selectedcss"){
              msgList.list[i].css = "unselectedcss";
              break;
            }else{
              msgList.list[i].css = "selectedcss";
              break;
            }
          }
        }
        for(let i = 0; i< hasselecteds.list.length;i++){
          
          if(item.id == hasselecteds.list[i].id){
            hasselecteds.list.splice(i,1);
            return;
          }
        }
        hasselecteds.list.push(item);
    }

    let pagemsg = reactive(props.pagemsg)
    //列表查询
    let togetList = function(){
      emit("togetList",pagemsg.animation)
    }

    onMounted(()=>{
      togetList();
    })

    return{
      hasselected,
      toselectcss,
      msgList,
      hasselecteds,
      tochangeselect,
      togetList,
      pagemsg,
      viewMode,
      getHasEndLabel,
      getHasEndTagType,
      truncateText
    }
  }
}
</script>

<style scoped>
.tdrightmiddlecss{
   height:100%;
   width:100%;
   display: flex;
   flex-direction: column;
   background: var(--theme-bg-page);
   position: relative;
}

/* 视图切换栏 */
.view-toggle-bar {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
}

.view-toggle {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: var(--theme-bg-card);
  border-radius: 8px;
  border: 1px solid var(--theme-border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--theme-text-secondary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  color: var(--theme-primary);
  background: var(--theme-primary-bg);
}

.toggle-btn.active {
  background: var(--theme-primary);
  color: #fff;
}

/* ========== 卡片视图 ========== */
.card-view {
   flex: 1;
   display:flex;
   flex-wrap: wrap;
   align-content: flex-start;
   justify-content: center;
   height: 100%;
   width: 100%;
   overflow:auto;
   padding: 16px;
   box-sizing: border-box;
   gap: 12px;
}

.collect-item {
   position:relative;
   height: auto;
   min-height: 0;
   width: 220px;
   padding: 0;
   margin: 0;
   cursor: pointer;
   flex: 0 0 auto;
   background: var(--theme-bg-card);
   border: 2px solid var(--theme-border);
   border-radius: 10px;
   overflow: hidden;
   transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
   display: flex;
   flex-direction: column;
}

.collect-item:hover {
  border-color: var(--theme-primary);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}

.collect-item.selectedcss {
  border-color: var(--theme-primary);
  box-shadow: 0 0 0 3px var(--theme-primary-bg);
}

.card-img-wrapper {
  position: relative;
  width: 100%;
  height: 130px;
  overflow: hidden;
  background: var(--theme-bg-page);
  flex-shrink: 0;
}

.clickimgcss {
  width: 100%;
  height: 100%;
  transition: transform 0.4s ease;
}

.collect-item:hover .clickimgcss {
  transform: scale(1.08);
}

.img-error-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--theme-primary-light), var(--theme-bg-page));
  color: var(--theme-text-placeholder);
}

.card-hover-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.collect-item:hover .card-hover-overlay {
  opacity: 1;
}

.card-badges {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  gap: 6px;
}

.type-badge {
  padding: 2px 8px;
  font-size: 11px;
  border-radius: 10px;
  color: #fff;
  font-weight: 500;
}

.badge-end {
  background: var(--theme-success, #67c23a);
}

.badge-serialize {
  background: var(--theme-primary, #409eff);
}

.badge-beforeStart {
  background: var(--theme-warning, #e6a23c);
}

.badge-unknown {
  background: var(--theme-info, #909399);
}

.img-count {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px 6px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 11px;
  border-radius: 10px;
}

.card-info {
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
}

.card-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--theme-text-primary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 2px;
  padding-top: 4px;
  border-top: 1px dashed var(--theme-border);
}

.card-detail-row {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  font-size: 11px;
  line-height: 1.4;
}

.detail-icon {
  flex-shrink: 0;
  margin-top: 1px;
  color: var(--theme-text-secondary);
}

.detail-text {
  color: var(--theme-text-regular);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.detail-link {
  color: var(--theme-primary);
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.detail-link:hover {
  text-decoration: underline;
}

.popover-trigger {
  display: none;
}

.hasshareurl{
  position:absolute;
  left:0px;
  bottom:0px;
  width:auto;
  min-width:60px;
  height:auto;
  padding:4px 8px;
  display:flex;
  align-items: center;
  justify-content: center;
  gap:4px;
  background-color: var(--theme-danger) !important;
  clip-path: polygon(0 0, 0 100%, 100% 100%, 100% 30%, 70% 0);
  border-radius: 0 0 0 5px;
  z-index:1;
}
.hasshareicon{
  font-size: 12px;
  color: #fff;
}
.hassharetext{
  font-size: 10px;
  color: #fff;
  font-weight: 500;
  white-space: nowrap;
}

/* ========== 列表视图 ========== */
.list-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  overflow: auto;
  box-sizing: border-box;
}

.list-item {
  position: relative;
  display: flex;
  gap: 14px;
  padding: 0;
  background: var(--theme-bg-card);
  border: 2px solid var(--theme-border);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-item:hover {
  border-color: var(--theme-primary);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}

.list-item.selectedcss {
  border-color: var(--theme-primary);
  box-shadow: 0 0 0 3px var(--theme-primary-bg);
}

.list-img-wrapper {
  position: relative;
  flex-shrink: 0;
  width: 160px;
  height: 120px;
  overflow: hidden;
  background: var(--theme-bg-page);
}

.list-img {
  width: 100%;
  height: 100%;
  transition: transform 0.4s ease;
}

.list-item:hover .list-img {
  transform: scale(1.08);
}

.list-hover-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.list-item:hover .list-hover-overlay {
  opacity: 1;
}

.list-badges {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  gap: 6px;
}

.list-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px 14px;
  min-width: 0;
  gap: 4px;
}

.list-info-top {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.list-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--theme-text-primary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.list-detail-rows {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.list-info-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 11px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 3px 8px;
  background: var(--theme-bg-page);
  border-radius: 6px;
  color: var(--theme-text-secondary);
  max-width: 240px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meta-item a {
  color: var(--theme-primary);
  text-decoration: none;
}

.meta-item a:hover {
  text-decoration: underline;
}

.list-info-bottom {
  display: flex;
  justify-content: flex-end;
  padding-top: 4px;
}

/* ========== 详情弹窗样式 ========== */
.detail-popup {
  padding: 4px 0;
  color: var(--theme-text-primary);
}

.detail-popup .detail-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid var(--theme-border);
  font-size: 13px;
  line-height: 1.5;
}

.detail-popup .detail-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.detail-popup .detail-row:first-child {
  padding-top: 0;
}

.detail-popup .detail-label {
  flex-shrink: 0;
  width: 80px;
  color: var(--theme-text-placeholder);
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.5px;
}

.detail-popup .detail-value {
  flex: 1;
  color: var(--theme-text-primary);
  word-break: break-all;
  font-size: 13px;
}

.detail-popup .detail-value.detail-link {
  color: var(--theme-primary);
  text-decoration: none;
  transition: color 0.2s;
}

.detail-popup .detail-value.detail-link:hover {
  color: var(--theme-primary-hover, var(--theme-primary));
  text-decoration: underline;
}

.detail-popup .detail-value.detail-notes {
  white-space: pre-wrap;
  max-height: 80px;
  overflow-y: auto;
  color: var(--theme-text-regular);
  background: var(--theme-bg-page);
  padding: 6px 8px;
  border-radius: 6px;
  line-height: 1.6;
}

/* ========== 通用 ========== */
.animationmsg{
  height:100%;
  width:100%;
  padding: 0px;
  margin: 0px;
  list-style: none;
}
.animationmsg >li{
  padding: 3px;
  height:20%;
  width:90%;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  font-size: 12px;
  color: var(--theme-text-regular);
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .card-view {
    gap: 10px;
    padding: 12px;
  }

  .collect-item {
    width: 160px;
  }

  .card-img-wrapper {
    height: 100px;
  }

  .list-item {
    flex-direction: column;
    gap: 0;
  }

  .list-img-wrapper {
    width: 100%;
    height: 140px;
  }

  .list-info-bottom {
    justify-content: flex-start;
  }
}
</style>

<style>
/*popover 专用*/
.el-popover.el-popper {
  background-color: var(--theme-bg-card) !important;
  color: var(--theme-text-primary);
  border: 1px solid var(--theme-border);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
.el-popover__title {
  color: var(--theme-text-primary);
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid var(--theme-border);
  padding-bottom: 8px;
  margin-bottom: 4px;
}
.el-popover__content {
  color: var(--theme-text-primary);
  padding: 4px 0;
}
.el-popover .popper__arrow,
.el-popover .popper__arrow::after {
  border-bottom-color: var(--theme-border) !important;
  border-top-color: var(--theme-border) !important;
}
.el-popover .popper__arrow::after {
  background-color: var(--theme-bg-card) !important;
}
</style>
