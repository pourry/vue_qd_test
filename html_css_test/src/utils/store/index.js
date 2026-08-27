//引入Vuex
import { createStore } from 'vuex'
import userInfoApi from '@/api/userInfo'

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

// 从 localStorage 读取用户信息
const savedUserInfo = localStorage.getItem("userInfo");
const parsedUserInfo = savedUserInfo ? JSON.parse(savedUserInfo) : null;

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
        //用户信息
        userInfo: parsedUserInfo,
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
        },
        getUserInfo :(state) =>{
            return state.userInfo;
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
        },
        //设置用户信息
        SETUSERINFO(state, userInfo){
            state.userInfo = userInfo;
            if(userInfo){
                localStorage.setItem("userInfo", JSON.stringify(userInfo));
            }else{
                localStorage.removeItem("userInfo");
            }
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
        // 设置主题（同时保存到后端）
        async setTheme(context, themeKey){
            // 先更新本地状态
            context.commit("SETTHEME", themeKey);
            // 如果已登录，保存到后端
            const token = context.state.token;
            if(token && token.value){
                try{
                    await userInfoApi.saveTheme(themeKey);
                }catch(e){
                    // 保存失败不影响本地使用
                    console.warn('保存主题到服务器失败:', e);
                }
            }
        },
        // 从后端加载用户信息（主题、用户资料等）
        async loadUserTheme(context){
            const token = context.state.token;
            if(!token || !token.value){
                return;
            }
            try{
                const res = await userInfoApi.query();
                if(res.successful && res.resultValue){
                    // 保存用户信息到 store 和 localStorage（不存储敏感信息）
                    const userInfo = {
                        id: res.resultValue.id,
                        username: res.resultValue.username,
                        nickName: res.resultValue.nickName,
                        avatar: res.resultValue.avatar,
                        theme: res.resultValue.theme
                    };
                    context.commit("SETUSERINFO", userInfo);
                    // 如果有主题，应用主题
                    if(res.resultValue.theme){
                        context.commit("SETTHEME", res.resultValue.theme);
                    }
                }
            }catch(e){
                console.warn('加载用户信息失败:', e);
            }
        }
    },
    modules:{

    }
})
