import{axiosget,axiospost,axiosupload}from '../utils/axiosUtils/axiosMethods'

const gameapi = Object.assign({}) 

//新增 接口
gameapi.toadd =function (data){
    return axiosupload("/game/toadd",data)
}
//修改 接口
gameapi.toedit =function (data){
    return axiosupload("/game/toedit",data)
}
//删除 接口
gameapi.todelete =function (data){
    return axiospost("/game/todelete/"+data)
}


//列表查询 接口
gameapi.togetList =function (data){
    return axiosget("/game/getList",data)
}
export default gameapi