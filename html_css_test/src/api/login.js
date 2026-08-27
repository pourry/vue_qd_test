import{axiosget,axiospost}from '../utils/axiosUtils/axiosMethods'

//获取 sm2的公钥
export function getSm2(){
    return axiosget('/login/togetSm2',null)
} 

//登录 接口
export function login(data){
    return axiospost("/login/login",data)
}
//注册 接口
export function signUpApi(data){
    return axiospost("/login/signUp",data)
}
//判断用户名是否重复 接口
export function tochecknameApi(data){
    return axiospost("/login/tocheckname",data)
}
//获取验证码
export function getCaptcha(){
    return axiosget('/login/captcha',null)
}
//获取全局验证码开关（无需参数）
export function isGlobalCaptchaEnabled(){
    return axiosget('/login/globalCaptchaEnabled',null)
}
//保存验证码开关
export function saveCaptchaEnabled(data){
    return axiospost("/login/saveCaptchaEnabled",data)
}
//登出接口
export function logout(){
    return axiospost("/login/logout",null)
}
