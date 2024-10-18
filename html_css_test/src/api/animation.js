import{axiosget,axiospost,axiosupload}from '../utils/axiosUtils/axiosMethods'

const animationapi = Object.assign({}) 

//新增 接口
animationapi.toadd =function (data){
    return axiosupload("/animation/toadd",data)
}
//修改 接口
animationapi.toedit =function (data){
    return axiosupload("/animation/toedit",data)
}
//删除 接口
animationapi.todelete =function (data){
    return axiospost("/animation/todelete/"+data)
}


//列表查询 接口
animationapi.togetList =function (data){
    return axiosget("/animation/getList",data)
}
export default animationapi