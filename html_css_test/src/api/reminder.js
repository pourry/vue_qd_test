import { axiosget, axiospost, axiosdelete } from '../utils/axiosUtils/axiosMethods'

const BASE_URL = '/reminder'

const reminderApi = Object.assign({})

/**
 * 保存提醒（新增或更新）
 */
reminderApi.saveReminder = function (data) {
  return axiospost(BASE_URL + '/save', data)
}

/**
 * 取消提醒
 */
reminderApi.cancelReminder = function (id) {
  return axiospost(BASE_URL + '/cancel/' + id, null)
}

/**
 * 删除提醒
 */
reminderApi.deleteReminder = function (id) {
  return axiosdelete(BASE_URL + '/delete/' + id, null)
}

/**
 * 获取提醒详情
 */
reminderApi.getReminderDetail = function (id) {
  return axiosget(BASE_URL + '/detail/' + id, null)
}

/**
 * 获取我的提醒列表（分页）
 */
reminderApi.getMyReminders = function (params) {
  return axiosget(BASE_URL + '/myList', params)
}

/**
 * 根据目标信息查询提醒
 */
reminderApi.getReminderByTarget = function (targetType, targetId, userId) {
  return axiosget(BASE_URL + '/byTarget', { targetType, targetId, userId })
}

/**
 * 获取指定目标的活跃提醒
 */
reminderApi.getActiveReminder = function (targetType, targetId, userId) {
  return axiosget(BASE_URL + '/activeByTarget', { targetType, targetId, userId })
}

/**
 * 手动触发检查（测试用）
 */
reminderApi.checkReminders = function () {
  return axiospost(BASE_URL + '/check', null)
}

/**
 * 获取已触发但未读的提醒数量
 */
reminderApi.getUnreadCount = function (userId) {
  return axiosget(BASE_URL + '/unreadCount', { userId })
}

/**
 * 标记单条提醒为已读
 */
reminderApi.markAsRead = function (id) {
  return axiospost(BASE_URL + '/markRead/' + id, null)
}

/**
 * 标记所有已触发提醒为已读
 */
reminderApi.markAllAsRead = function (userId) {
  return axiospost(BASE_URL + '/markAllRead', { userId })
}

export default reminderApi
