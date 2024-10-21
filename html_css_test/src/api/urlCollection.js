import{axiosget,axiospost,axiosupload}from '../utils/axiosUtils/axiosMethods'

const urlCollectionapi = Object.assign({}) 

//新增 接口
urlCollectionapi.toadd =function (data){
    return axiospost("/urlCollection/toadd",data)
}
//修改 接口
urlCollectionapi.toedit =function (data){
    return axiospost("/urlCollection/toedit",data)
}
//删除 接口
urlCollectionapi.todelete =function (data){
    return axiospost("/urlCollection/todelete/"+data)
}


export default urlCollectionapi