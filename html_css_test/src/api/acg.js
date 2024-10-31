import{axiosget,axiospost,axiosupload}from '../utils/axiosUtils/axiosMethods'

const acgapi = Object.assign({}) 
//列表查询 接口
acgapi.getshowAce =function (data){
    return axiosget("/acg/public/getshowAce",data)
}
export default acgapi