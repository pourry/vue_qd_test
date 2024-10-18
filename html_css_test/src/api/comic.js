import{axiosget,axiospost,axiosupload}from '../utils/axiosUtils/axiosMethods'

const comicapi = Object.assign({}) 

//新增 接口
comicapi.toadd =function (data){
    return axiosupload("/comic/toadd",data)
}
//修改 接口
comicapi.toedit =function (data){
    return axiosupload("/comic/toedit",data)
}
//删除 接口
comicapi.todelete =function (data){
    return axiospost("/comic/todelete/"+data)
}


//列表查询 接口
comicapi.togetList =function (data){
    return axiosget("/comic/getList",data)
}
export default comicapi