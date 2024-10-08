import{axiosget,axiospost}from '../utils/axiosUtils/axiosMethods'



//新增 接口
export function toaddapi(data){
    return axiospost("/animation/toadd",data)
}