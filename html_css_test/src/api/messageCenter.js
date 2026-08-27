/**
 * 消息中心API接口
 * 包含聊天室、通知、反馈相关接口
 */
import { axiosget, axiosdelete, axiospost, axiospostJson, axiosupload } from '../utils/axiosUtils/axiosMethods'

const messageCenterApi = Object.assign({})

// ==================== 用户接口 ====================

// 获取所有用户列表（用于发布通知时选择接收者）
messageCenterApi.getAllUsers = function () {
    return axiosget('/notification/allUsers', null)
}

// ==================== 聊天室接口 ====================

// 获取聊天室消息列表
messageCenterApi.getChatMessages = function (params) {
    return axiosget('/chat/messages', params)
}

// 分页获取聊天消息（加载更多历史消息）
messageCenterApi.getChatMessagesByPage = function (params) {
    return axiosget('/chat/messages/page', params)
}

// 获取消息总数
messageCenterApi.getChatMessageCount = function () {
    return axiosget('/chat/messages/count', null)
}

// 关键字搜索消息
messageCenterApi.searchChatMessages = function (params) {
    return axiosget('/chat/messages/search', params)
}

// 获取最近 N 条聊天消息（Top 浮层预览）
messageCenterApi.getRecentChatMessages = function (params) {
    return axiosget('/chat/recent', params)
}

// 发送聊天消息（表单格式）
messageCenterApi.sendChatMessage = function (data) {
    return axiospost('/chat/sendMessage', data)
}

// 删除聊天消息
messageCenterApi.deleteChatMessage = function (id) {
    return axiosdelete(`/chat/messages/${id}`, null)
}

// 获取在线用户列表
messageCenterApi.getOnlineUsers = function () {
    return axiosget('/chat/onlineUsers', null)
}

// 获取真实在线用户列表（基于WebSocket连接状态）
messageCenterApi.getRealOnlineUsers = function () {
    return axiosget('/chat/realOnlineUsers', null)
}

// ==================== 通知接口 ====================

// 获取当前用户的通知列表
messageCenterApi.getNotifications = function (params) {
    return axiosget('/notification/list', params)
}

// 获取未读通知数量
messageCenterApi.getUnreadCount = function () {
    return axiosget('/notification/unreadCount', null)
}

// 标记通知为已读（表单格式）
messageCenterApi.markAsRead = function (id) {
    return axiospost('/notification/markAsRead', { id })
}

// 标记所有通知为已读
messageCenterApi.markAllAsRead = function () {
    return axiospost('/notification/markAllAsRead', null)
}

// 发布通知（JSON格式）
messageCenterApi.publishNotification = function (data) {
    return axiospostJson('/notification/publish', data)
}

// 删除通知（表单格式）
messageCenterApi.deleteNotification = function (id) {
    return axiospost('/notification/delete', { id })
}

// 获取当前用户发布的通知列表
messageCenterApi.getPublishedNotifications = function () {
    return axiosget('/notification/publishedList', null)
}

// 获取当前用户发布的通知列表（支持分页）
messageCenterApi.getPublishedNotificationsPaged = function (params) {
    return axiosget('/notification/publishedListPage', params)
}

// 删除发布的通知（表单格式）
messageCenterApi.deletePublishedNotification = function (id) {
    return axiospost('/notification/deletePublished', { id })
}

// 获取当前用户发布的批次通知列表（支持分页，按批次聚合）
messageCenterApi.getPublishedBatchesPaged = function (params) {
    return axiosget('/notification/publishedBatchesPage', params)
}

// 获取批次的接收者详情
messageCenterApi.getBatchReceivers = function (batchId) {
    return axiosget('/notification/batchReceivers', { batchId })
}

// 获取批次的接收者详情（支持分页）
messageCenterApi.getBatchReceiversPaged = function (params) {
    return axiosget('/notification/batchReceiversPage', params)
}

// 删除发布的批次（表单格式）
messageCenterApi.deletePublishedBatch = function (batchId) {
    return axiospost('/notification/deletePublishedBatch', { batchId })
}

// 更新发布的批次内容（JSON格式）
messageCenterApi.updatePublishedBatch = function (data) {
    return axiospostJson('/notification/updatePublishedBatch', data)
}

// ==================== 反馈接口 ====================

// 获取当前用户的反馈列表
messageCenterApi.getMyFeedbacks = function (params) {
    return axiosget('/feedback/myList', params)
}

// 分页获取当前用户的反馈列表
messageCenterApi.getMyFeedbacksPaged = function (params) {
    return axiosget('/feedback/myList/page', params)
}

// 获取最近 N 条反馈（Top 浮层预览）
messageCenterApi.getRecentFeedbacks = function (params) {
    return axiosget('/feedback/recentList', params)
}

// 提交反馈（JSON格式）
messageCenterApi.submitFeedback = function (data) {
    return axiospostJson('/feedback/submit', data)
}

// 更新反馈（JSON格式）
messageCenterApi.updateFeedback = function (data) {
    return axiospostJson('/feedback/update', data)
}

// 删除反馈
messageCenterApi.deleteFeedback = function (id) {
    return axiospost('/feedback/delete', { id: id })
}

// 上传反馈图片（使用FormData）
messageCenterApi.uploadFeedbackImage = function (file) {
    const formData = new FormData()
    formData.append('file', file)
    return axiosupload('/feedback/uploadImage', formData)
}

// 获取反馈详情
messageCenterApi.getFeedbackDetail = function (id) {
    return axiosget('/feedback/detail', { id })
}


// ==================== 总反馈管理接口（管理员） ====================

// 获取所有反馈列表
messageCenterApi.getAllFeedbacks = function (params) {
    return axiosget('/feedback/allList', params)
}

// 分页获取所有反馈列表
messageCenterApi.getAllFeedbacksPaged = function (params) {
    return axiosget('/feedback/allList/page', params)
}

// 处理反馈（更新状态）（JSON格式）
messageCenterApi.processFeedback = function (data) {
    return axiospostJson('/feedback/process', data)
}

// 回复反馈（JSON格式）
messageCenterApi.replyFeedback = function (data) {
    return axiospostJson('/feedback/reply', data)
}

// 获取反馈统计数据
messageCenterApi.getFeedbackStats = function () {
    return axiosget('/feedback/stats', null)
}

export default messageCenterApi
