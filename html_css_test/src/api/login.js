import{axiosget}from '../utils/axiosUtils/axiosMethods'

//获取 sm2的公钥
export function getSm2(){
    return axiosget('/login/togetSm2',null)
} 