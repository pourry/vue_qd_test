import { axiosget, axiospost, axiospostJson, axiosupload } from '../utils/axiosUtils/axiosMethods'

const userInfoApi = Object.assign({})

// 查询当前用户信息
userInfoApi.query = function () {
    return axiosget("/userInfo/query", null)
}

// 更新用户基本信息（昵称、邮箱、手机、生日、性别等）
userInfoApi.updateInfo = function (data) {
    return axiospost("/userInfo/updateInfo", data)
}

// 修改密码
userInfoApi.changePassword = function (data) {
    return axiospost("/userInfo/changePassword", data)
}

// 上传头像
userInfoApi.uploadAvatar = function (data) {
    return axiosupload("/userInfo/uploadAvatar", data)
}

// 保存用户主题
userInfoApi.saveTheme = function (theme) {
    return axiospost("/userInfo/saveTheme", { theme })
}

export default userInfoApi
