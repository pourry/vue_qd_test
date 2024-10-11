import axios from 'axios';
import qs from 'qs';
import { ref } from 'vue';
import router from '@/utils/router'
import store from '@/utils/store'
const baseUrl = "/api";
//设置 请求超市时间  设置为 10s
axios.defaults.timeout = 10000;

//                            -----拦截器 开始------
//请求拦截器
axios.interceptors.request.use(
    req =>{
        console.log("axios请求拦截执行。。。。。",req,"--结束--")
        //处理
        //config.headers
        let token = localStorage.getItem("Authorization");
            req.headers.Authorization = token;
            return req;

    },
    error =>{
        return Promise.err(error);
    }
)
//响应拦截器
axios.interceptors.response.use(
    res =>{
            console.log("axios响应拦截执行。。。。",res,"--结束--")
            if(res.data.code =="410"){
                localStorage.removeItem('Authorization');
                store.commit("SETTOKEN",{value:undefined});
                router.push("/login");
                return ;
            }
            return res;
    },
    error =>{
        return Promise.err(error);
    }
)
//                            -----拦截器 结束------

//                            -----请求 开始------
//get 请求
function axiosget(url,params){
    return new Promise((resolve,reject)=>{
      return  axios({
        method: 'get',
        url: baseUrl+url,
        params: params
      }).then(res =>{
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
        axios({
            method: 'post',
            url: baseUrl+url,
            data:qs.stringify(params)
           
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
//                            -----请求 结束------

//下载  get
//在 Vue.js 中，ref 是一个特殊的函数，用于创建响应式数据。
//当你使用 ref 函数创建一个变量时，这个变量就会成为一个响应式数据，即当它发生改变时会自动触发重新渲染。
//具体来说，当你声明一个 const 变量并将其赋值为 ref() 函数的返回值时，实际上是将这个变量绑定到了 ref 创建的响应式数据对象中。
//因此，你可以通过访问 a.value 来读取或修改这个响应式数据的值。
var onDownloadProgress = ref(0)
function axiosdown(url,params){
    
    return new Promise((resolve,reject)=>{
        axios(
            {
                url : baseUrl+url,
                responseType:'blob',
                method: 'get',
                params : params,
                 onDownloadProgress : function(progressEvent){
                    if(progressEvent.lengthComputable){
                        onDownloadProgress.value = progressEvent.loaded / progressEvent.total * 100
                     }
                }
        },
        ).then(res =>{
            let link = document.createElement("a");
            link.href = URL.createObjectURL(res.data);
            link.download =  "test";
            document.body.appendChild(link);
            link.click();
            URL.revokeObjectURL(link.href);
            // if(res){
            //     resolve(res.data)
            // }
        }).catch(err=>{
            if(err){
                reject(err.data)
            }
        })
    })
    
}
//上传
var onUploadProgress = ref(0)
function axiosupload(url,params){
   
    return new Promise((resolve,reject)=>{
        axios(
            {
                url : baseUrl+url,
                responseType:'blob',
                method: 'post',
                data : qs.stringify(params),
                 onUploadProgress : function(progressEvent){
                    if(progressEvent.lengthComputable){
                        onUploadProgress.value = progressEvent.loaded / progressEvent.total * 100
                     }
                }
        },
        ).then(res =>{
            let link = document.createElement("a");
            link.href = URL.createObjectURL(res.data);
            link.download =  "test";
            document.body.appendChild(link);
            link.click();
            URL.revokeObjectURL(link.href);
            // if(res){
            //     resolve(res.data)
            // }
        }).catch(err=>{
            if(err){
                reject(err.data)
            }
        })
    })
    
}

//export导出 变量   export default  导出 值
export {
    axiosget,
    axiospost,
    axiosdown,
    axiosupload
}