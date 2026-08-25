//引入Vuex
import { createStore } from 'vuex'

// 主题配置列表（与 themes.css 中的 data-app-theme 对应）
export const THEME_LIST = [
  { key: 'blue',   name: '深邃蓝', color: '#0082F4' },
  { key: 'green',  name: '翠绿',   color: '#00B42A' },
  { key: 'purple', name: '紫罗兰', color: '#722ED1' },
  { key: 'orange', name: '日落橙', color: '#FA541C' },
  { key: 'rose',   name: '玫红',   color: '#EB2F96' },
  { key: 'cyan',   name: '青蓝',   color: '#13C2C2' },
  { key: 'dark',   name: '灰黑',   color: '#818CF8' },
]

// 从 localStorage 读取或使用默认
const savedTheme = localStorage.getItem('app-theme') || 'blue'

// 应用主题到 html 根节点
// 使用 data-app-theme 而非 data-theme，避免与浏览器自动设置的 data-theme="light/dark" 冲突
function applyTheme(themeKey) {
  document.documentElement.setAttribute('data-app-theme', themeKey)
}
applyTheme(savedTheme)

export default createStore({
    //存储数据
    state:{
        sm2 : {
            publicKey:undefined,
        },
        //是否登录
        token: localStorage.getItem("Authorization")  == null || localStorage.getItem("Authorization") ==  undefined ? {value:undefined}: localStorage.getItem("Authorization"),
        //当前主题
        theme: savedTheme,
    },
    //用于将state中的数据进行加工
    getters:{
        getSm2 :(state) =>{
            return state.sm2;
        },
        getToken :(state) =>{
            return state.token;
        },
        getTheme :(state) =>{
            return state.theme;
        },
        getThemeList :() =>{
            return THEME_LIST;
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
        },
        SETTHEME(state, themeKey){
            state.theme = themeKey;
            localStorage.setItem('app-theme', themeKey);
            applyTheme(themeKey);
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
        },
        setTheme(context, themeKey){
            context.commit("SETTHEME", themeKey);
        }
    },
    modules:{

    }
})
