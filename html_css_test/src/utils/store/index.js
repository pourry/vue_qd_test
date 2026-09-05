//引入Vuex
import { createStore } from 'vuex'
import userInfoApi from '@/api/userInfo'
import rolePermissionApi from '@/api/rolePermission'

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

// 从 localStorage 读取角色权限
const savedRoleInfo = localStorage.getItem("roleInfo");
const parsedRoleInfo = savedRoleInfo ? JSON.parse(savedRoleInfo) : null;
const savedPermissions = localStorage.getItem("userPermissions");
const parsedPermissions = savedPermissions ? JSON.parse(savedPermissions) : [];
const savedAllowedPaths = localStorage.getItem("allowedPaths");
const parsedAllowedPaths = savedAllowedPaths ? JSON.parse(savedAllowedPaths) : [];

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
        //角色信息（包含 roleId, roleCode, roleName）
        roleInfo: parsedRoleInfo,
        //权限列表（完整权限对象列表）
        permissions: parsedPermissions,
        //允许访问的路由路径集合（用于快速路由守卫检查）
        allowedPaths: parsedAllowedPaths,
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
        },
        getRoleInfo :(state) =>{
            return state.roleInfo;
        },
        getPermissions :(state) =>{
            return state.permissions;
        },
        getAllowedPaths :(state) =>{
            return state.allowedPaths;
        },
        // 判断当前用户是否为管理员
        isAdmin :(state) =>{
            return state.roleInfo && state.roleInfo.roleCode === 'admin';
        },
        // 检查用户是否有访问某路径的权限
        hasPermission :(state) => (path) =>{
            if (!state.allowedPaths || state.allowedPaths.length === 0) return false;
            // 管理员放行所有
            if (state.roleInfo && state.roleInfo.roleCode === 'admin') return true;
            // 精确匹配
            if (state.allowedPaths.includes(path)) return true;
            // 检查是否有父路径权限（如 /twoDimensions 下的子路径）
            for (const p of state.allowedPaths) {
                if (path.startsWith(p + '/')) return true;
            }
            return false;
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
        },
        //设置角色信息
        SETROLEINFO(state, roleInfo){
            state.roleInfo = roleInfo;
            if(roleInfo){
                localStorage.setItem("roleInfo", JSON.stringify(roleInfo));
            }else{
                localStorage.removeItem("roleInfo");
            }
        },
        //设置权限列表
        SETPERMISSIONS(state, { permissions, allowedPaths }){
            state.permissions = permissions || [];
            state.allowedPaths = allowedPaths || [];
            if(permissions){
                localStorage.setItem("userPermissions", JSON.stringify(permissions));
            }else{
                localStorage.removeItem("userPermissions");
            }
            if(allowedPaths){
                localStorage.setItem("allowedPaths", JSON.stringify(allowedPaths));
            }else{
                localStorage.removeItem("allowedPaths");
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
        },
        // 加载当前用户的角色信息和权限列表
        async loadRolePermissions(context){
            const token = context.state.token;
            if(!token || !token.value){
                // 未登录，清除角色权限
                context.commit("SETROLEINFO", null);
                context.commit("SETPERMISSIONS", { permissions: [], allowedPaths: [] });
                return;
            }
            try{
                const res = await rolePermissionApi.getMyPermissions();
                if(res.successful && res.resultValue){
                    const data = res.resultValue;
                    // 保存角色信息
                    const roleInfo = {
                        roleId: data.roleId,
                        roleCode: data.roleCode,
                        roleName: data.roleName,
                    };
                    context.commit("SETROLEINFO", roleInfo);
                    // 保存权限列表和允许的路径
                    context.commit("SETPERMISSIONS", {
                        permissions: data.permissions || [],
                        allowedPaths: data.allowedPaths || [],
                    });
                }
            }catch(e){
                console.warn('加载角色权限失败:', e);
                // 失败时设置为访客角色
                context.commit("SETROLEINFO", { roleCode: 'guest', roleName: '访客' });
                context.commit("SETPERMISSIONS", { permissions: [], allowedPaths: ['/home'] });
            }
        },
        // 清除角色权限（登出时调用）
        clearRolePermissions(context){
            context.commit("SETROLEINFO", null);
            context.commit("SETPERMISSIONS", { permissions: [], allowedPaths: [] });
        }
    },
    modules:{

    }
})
