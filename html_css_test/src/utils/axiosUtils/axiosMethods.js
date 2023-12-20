import axios from 'axios';
import qs from 'qs';

const baseUrl = "/api";
//设置 请求超市时间  设置为 10s
axios.defaults.timeout = 10000;

//                            -----拦截器 开始------
//请求拦截器
axios.interceptors.request.use(
    req =>{
        //处理
        //config.headers
        console.log("axios请求拦截执行。。。。。",req)
        return req;
       
    },
    error =>{
        return Promise.err(error);
    }
)
//响应拦截器
axios.interceptors.response.use(
    res =>{
            console.log("axios响应拦截执行。。。。",res)
    }
)
//                            -----拦截器 结束------

//                            -----请求 开始------
//get 请求
function axiosget(url,params){
    return new Promise((resolve,reject)=>{
        axios.get(
            baseUrl+url,
            {
                params: params
            }
        ).then(res =>{
            if(res){
                resolve(res.data)
            }
        }).catch(err=>{
            if(err){
                reject(err.data)
            }
        })
    })
    
}

//post 请求
function axiospost(url,params){
    return new Promise((resolve,reject)=>{
        axios.post(
            baseUrl+url,
            qs.stringify(params)
        ).then(res =>{
            if(res){
                resolve(res.data)
            }
        }).catch(err=>{
            if(err){
                reject(err.data)
            }
        })
    })
    
}
//                            -----请求 结束------


//export导出 变量   export default  导出 值
export {
    axiosget,
    axiospost
}