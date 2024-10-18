import{axiosget,axiospost,axiosupload}from '../utils/axiosUtils/axiosMethods'

const novelapi = Object.assign({}) 

//新增 接口
novelapi.toadd =function (data){
    return axiosupload("/novel/toadd",data)
}
//修改 接口
novelapi.toedit =function (data){
    return axiosupload("/novel/toedit",data)
}
//删除 接口
novelapi.todelete =function (data){
    return axiospost("/novel/todelete/"+data)
}


//列表查询 接口
novelapi.togetList =function (data){
    return axiosget("/novel/getList",data)
}
export default novelapi