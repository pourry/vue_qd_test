//引入Vuex
import { createStore } from 'vuex'
export default createStore({
    //存储数据
    state:{
        sm2 : {
            publicKey:undefined,
        },
        //是否登录
        token: localStorage.getItem("Authorization")  == null || localStorage.getItem("Authorization") ==  undefined ? {value:undefined}: localStorage.getItem("Authorization"),

    },
    //用于将state中的数据进行加工
    getters:{
        getSm2 :(state) =>{
            return state.sm2;
        },
        getToken :(state) =>{
            return state.token;
        }
    },
    //操作数据
    mutations:{
        //给sm2赋值
        SETSM2(state,value){
            state.sm2 = value;
        },
        SETTOKEN(state,value){
            state.token = value;
        }
 
    },
    //响应组件中的动作     acitons是提交给mustations 异步操作
    actions:{
        //从后台获取sm2的公钥
        getSm2Action(context,value){
            context.commit('SETSM2',value);
        },
        setToken(context,value){
            context.commit("SETTOKEN",value);
        }
    },
    modules:{

    }
})