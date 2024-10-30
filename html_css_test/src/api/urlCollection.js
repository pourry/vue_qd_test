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
//保存logo 接口
urlCollectionapi.tosavelogo =function (data){
    return axiospost("/urlCollection/tosavelogo",data)
}
//删除 接口
urlCollectionapi.todelete =function (data){
    return axiospost("/urlCollection/todelete/"+data)
}
//查询分享出来的url 接口
urlCollectionapi.urlshow =function (data){
    return axiosget("/urlCollection/public/urlshow",data)
}
//查询热度的url 接口
urlCollectionapi.urlhot =function (data){
    return axiosget("/urlCollection/public/urlhot",data)
}


export default urlCollectionapi