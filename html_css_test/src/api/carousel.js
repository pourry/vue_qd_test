import{axiosget,axiospost,axiosupload}from '../utils/axiosUtils/axiosMethods'

const carouselapi = Object.assign({}) 

// 查询全部走马灯（管理页使用）
carouselapi.querylist = function (data) {
    return axiosget("/carousel/querylist", data)
}

// 查询启用的走马灯（首页使用，无需登录）
carouselapi.queryenabled = function (data) {
    return axiosget("/carousel/public/queryenabled", data)
}

// 新增走马灯（含图片上传）
carouselapi.toadd = function (data) {
    return axiosupload("/carousel/toadd", data)
}

// 修改走马灯（可选更新图片）
carouselapi.toedit = function (data) {
    return axiosupload("/carousel/toedit", data)
}

// 删除走马灯
carouselapi.todelete = function (data) {
    return axiospost("/carousel/todelete/" + data, null)
}

// 启用/禁用切换
carouselapi.toggleEnabled = function (data) {
    return axiospost("/carousel/toggleEnabled", data)
}

export default carouselapi
