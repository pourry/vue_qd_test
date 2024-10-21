import{axiosget,axiospost,axiosupload}from '../utils/axiosUtils/axiosMethods'

const urlTypeCollectionapi = Object.assign({}) 

//新增 接口
urlTypeCollectionapi.toadd =function (data){
    return axiospost("/urlTypeCollection/toadd",data)
}
//修改 接口
urlTypeCollectionapi.toedit =function (data){
    return axiospost("/urlTypeCollection/toedit",data)
}
//删除 接口
urlTypeCollectionapi.todelete =function (data){
    return axiospost("/urlTypeCollection/todelete/"+data)
}
//查询 接口
urlTypeCollectionapi.geturltree =function (data){
    return axiosget("/urlTypeCollection/geturltree",data)
}


export default urlTypeCollectionapi