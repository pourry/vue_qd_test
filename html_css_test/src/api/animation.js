import{axiosget,axiospost}from '../utils/axiosUtils/axiosMethods'

const animationapi = Object.assign({}) 

//新增 接口
animationapi.toadd =function toadd(data){
    return axiospost("/animation/toadd",data)
}

//列表查询 接口
animationapi.togetList =function (data){
    return axiosget("/animation/getList",data)
}
export default animationapi