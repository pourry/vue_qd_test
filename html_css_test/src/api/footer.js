import { axiosget, axiospost } from '../utils/axiosUtils/axiosMethods'

const footerApi = Object.assign({})

// ========== 内容板块接口 ==========

// 查询全部内容板块
footerApi.getSectionList = function () {
    return axiosget("/footer/section/list", null)
}

// 根据类型查询板块
footerApi.getSectionByType = function (type) {
    return axiosget("/footer/section/type/" + type, null)
}

// 新增内容板块
footerApi.addSection = function (data) {
    return axiospost("/footer/section/add", data)
}

// 修改内容板块
footerApi.updateSection = function (data) {
    return axiospost("/footer/section/update", data)
}

// 删除内容板块
footerApi.deleteSection = function (id) {
    return axiospost("/footer/section/delete", { id })
}

// ========== 快速链接接口 ==========

// 查询全部快速链接
footerApi.getLinkList = function () {
    return axiosget("/footer/link/list", null)
}

// 新增快速链接
footerApi.addLink = function (data) {
    return axiospost("/footer/link/add", data)
}

// 修改快速链接
footerApi.updateLink = function (data) {
    return axiospost("/footer/link/update", data)
}

// 删除快速链接
footerApi.deleteLink = function (id) {
    return axiospost("/footer/link/delete", { id })
}

// ========== 前端展示接口 ==========

// 获取底部完整配置（前端展示使用）
footerApi.getConfig = function () {
    return axiosget("/footer/config", null)
}

export default footerApi
