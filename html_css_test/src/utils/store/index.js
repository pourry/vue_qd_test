//引入Vuex
import { createStore } from 'vuex'
export default createStore({
    //存储数据
    state:{
        sm2 : {
            publicKey:undefined,
        }

    },
    //用于将state中的数据进行加工
    getters:{
        getSm2(state){
            return state.sm2;
        }
    },
    //操作数据
    mutations:{
        //给sm2赋值
        SETSM2(state,value){
            state.sm2 = value;
        }
 
    },
    //响应组件中的动作
    actions:{
        //从后台获取sm2的公钥
        getSm2Action(context,value){
            context.commit('SETSM2',value);
        }
    },
    modules:{

    }
})