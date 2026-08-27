<template>
    <div class= "loginpage">
         <div class= "loginpagechilds">
               <div class="wrapper">
                    <div class="formcss">
                      <h1>登录</h1>
                      <div class="input-box">
                        <i class="fas fa-envelope icon"></i>
                        <input id="usernameInput" type="username" required v-model="username"  />
                        <label>用户名</label>
                        <span id="usernamemsg"></span>
                      </div>
                      <div class="input-box">
                        <i class="icon" @click="passwordshow"><View  v-if = "passwordisshow"/> <Hide  v-if = "!passwordisshow"/></i>
                        <input id="passwordInput" type="password" required v-model="password" />
                        <label>密码</label>
                        <span id="passwordmsg"></span>
                      </div>

                      <!-- 验证码区域：仅在启用时显示 -->
                      <div class="captcha-row" v-if="captchaEnabled">
                        <div class="input-box captcha-input">
                          <input id="captchaInput" type="text" required v-model="captchaCode" placeholder="验证码" maxlength="4" />
                          <span id="captchamsg"></span>
                        </div>
                        <div class="captcha-img" @click="refreshCaptcha" title="点击刷新验证码">
                          <img v-if="captchaImg && !captchaLoading" :src="captchaImg" alt="验证码" />
                          <span v-if="captchaLoading" class="captcha-loading">加载中...</span>
                          <span v-if="!captchaImg && !captchaLoading && !captchaError" class="captcha-loading">点击加载</span>
                          <span v-if="captchaError" class="captcha-error" :title="captchaError">失败重试</span>
                        </div>
                      </div>

                      <div class="row">
                        <a onclick="forgotman()">忘记密码？</a>
                      </div>

                      <div class="loginbutcss">
                        <button @click="loginBrungle()" class="btn">登录</button>
                        <span id="loginfalsespan" class="loginfalse"></span>
                      </div>
                      <div class="signup-link">
                        <p>没有账号? <a href="#" @click="toSignUp()">立即注册</a></p>
                      </div>
                    </div>
                </div>
         </div>
      
    </div>
</template>

<script>
import {ref,onMounted,onBeforeUnmount} from 'vue'
import {login, getCaptcha, isGlobalCaptchaEnabled} from '@/api/login'
import router from '@/utils/router'
import store from '@/utils/store'
export default {
  name: 'Login',
  components: {
  },
  setup(){


  //控制 密码显隐
  let passwordisshow = ref(false)
  let username = ref('')
  let password = ref('')

  // 验证码相关
  let captchaEnabled = ref(false)
  let captchaImg = ref('')
  let captchaKey = ref('')
  let captchaCode = ref('')
  let captchaLoading = ref(false)
  let captchaError = ref('')


  let passwordshow = function(){
      let passwordField = document.getElementById('passwordInput');
      if (passwordField.type === 'password') {
        passwordField.type = 'text';
        passwordisshow.value = true;
      } else {
        passwordField.type = 'password';
        passwordisshow.value = false;
      }
  }

  /** 刷新验证码 */
  let refreshCaptcha = function(){
      captchaLoading.value = true
      captchaError.value = ''
      getCaptcha().then(res => {
        if (res.successful && res.resultValue) {
          captchaImg.value = res.resultValue.image
          captchaKey.value = res.resultValue.captchaKey
          captchaCode.value = ''
        } else {
          captchaError.value = res.resultValue || '验证码获取失败'
          captchaImg.value = ''
        }
      }).catch((err) => {
        captchaError.value = '验证码加载失败，请点击刷新'
        captchaImg.value = ''
      }).finally(() => {
        captchaLoading.value = false
      })
  }

  //登录
  let loginBrungle = function(){
      if(username.value.trim() =='' || username.value.trim() == undefined){
         document.getElementById("usernamemsg").innerHTML= "*用户名不能为空";
         return;
      }else{
         document.getElementById("usernamemsg").innerHTML= "";
      }

      if(password.value.trim() =='' || password.value.trim() == undefined){
         document.getElementById("passwordmsg").innerHTML= "*密码不能为空";
         return;
      }else{
         document.getElementById("passwordmsg").innerHTML= "";
      }

      // 验证码校验
      if (captchaEnabled.value) {
        if (!captchaCode.value.trim()) {
          document.getElementById("captchamsg").innerHTML = "*请输入验证码";
          return;
        } else {
          document.getElementById("captchamsg").innerHTML = "";
        }
      }

      // 构造登录参数
      let params = {
        'username': username.value,
        'password': password.value
      }
      if (captchaEnabled.value) {
        params.captchaCode = captchaCode.value
        params.captchaKey = captchaKey.value
      }

      login(params).then(res => {
         if(res.successful){
            username.value = "";
            password.value = "";
            captchaCode.value = "";
            document.getElementById("loginfalsespan").innerHTML= "";
            localStorage.setItem("Authorization",res.resultValue.token);
            store.commit("SETTOKEN",{value: res.resultValue.token});
            store.dispatch('loadUserTheme');
            // 登录成功后刷新验证码
            router.push("/home"); 
         }else{
            document.getElementById("loginfalsespan").innerHTML= res.resultValue
            if (captchaEnabled.value) { refreshCaptcha() }
         }
      })
  }
// 前往 注册页面
  let toSignUp = function(){
      router.push("/signUp");
  }

  let keyDown = function(e) {
      if (e.keyCode === 13) {
        loginBrungle()
      }
    }
  
  onMounted(() => {
    window.addEventListener('keydown', keyDown)
    // 从后端接口获取全局验证码开关
    isGlobalCaptchaEnabled().then(res => {
      if (res.successful && res.resultValue === true) {
        captchaEnabled.value = true
        refreshCaptcha()
      }
    }).catch(() => {
      // 接口失败时回退到 localStorage
      if (localStorage.getItem('captchaEnabled') === 'true') {
        captchaEnabled.value = true
        refreshCaptcha()
      }
    })
  })
  onBeforeUnmount(() => {
    window.removeEventListener('keydown',keyDown)
  })

  return {passwordisshow,passwordshow,
          username,password,
          captchaEnabled,captchaImg,captchaCode,captchaLoading,captchaError,
          refreshCaptcha,
          loginBrungle,
          toSignUp,
          keyDown}
  }
}
</script>

<style scoped>
.loginpage {
   height:100%;
   width:100%;
   display: flex;
   justify-content: center;
   align-items: center;
   background: linear-gradient(135deg, var(--theme-bg-page) 0%, var(--theme-primary-light) 100%);
}
.loginpagechilds{
   width:100%;
   height:100%;
   display: flex;
   justify-content: center;
   align-items: center;
}

.wrapper {
  width: 420px;
  padding: 48px 40px;
  background: var(--theme-bg-card);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.3s;
}

.wrapper:hover {
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
}

.formcss{
   width: 100%;
   display: flex;
   flex-direction: column;
   align-items: center;
}

.wrapper h1 {
  font-size: 28px;
  color: var(--theme-text-primary);
  text-align: center;
  margin-bottom: 32px;
  font-weight: 600;
}

.wrapper .input-box {
  position: relative;
  width: 100%;
  margin: 16px 0;
  border-bottom: 2px solid var(--theme-border);
  transition: border-color 0.3s;
}

.wrapper .input-box:focus-within {
  border-bottom-color: var(--theme-primary);
}

.wrapper .input-box input {
  width: 100%;
  height: 44px;
  background: transparent;
  outline: none;
  border: none;
  font-size: 15px;
  color: var(--theme-text-primary);
  padding: 0 40px 0 5px;
}

.wrapper .input-box input::placeholder {
  color: var(--theme-text-secondary);
}

.wrapper .input-box label {
  position: absolute;
  top: 50%;
  left: 5px;
  transform: translateY(-50%);
  font-size: 14px;
  color: var(--theme-text-secondary);
  pointer-events: none;
  transition: 0.3s;
}

.wrapper .input-box > span{
   position: absolute;
   top: 52px;
   color: var(--theme-danger);
   font-size: 12px;
}

.wrapper .input-box input:focus ~ label,
.wrapper .input-box input:valid ~ label {
  top: -20px;
  font-size: 12px;
  color: var(--theme-primary);
}

.wrapper .input-box .icon {
  position: absolute;
  right: 8px;
  color: var(--theme-text-secondary);
  font-size: 18px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  transition: color 0.3s;
}

.wrapper .input-box .icon:hover {
  color: var(--theme-primary);
}

.wrapper .row {
  margin: 8px 0 20px;
  font-size: 13px;
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.wrapper .row a {
  color: var(--theme-primary);
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s;
}

.wrapper .row a:hover {
  color: var(--theme-primary-dark);
}

.wrapper .btn {
  width: 100%;
  height: 44px;
  background: var(--theme-primary);
  color: var(--theme-text-light);
  outline: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  margin-top: 12px;
  transition: all 0.3s;
}

.wrapper .btn:hover {
  background: var(--theme-primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 130, 244, 0.3);
}

.wrapper .btn:active {
  transform: translateY(0);
}

.loginbutcss{
 width:100%;
 display:flex;
 flex-direction: column;
 align-items: center;
}

.loginfalse{
  color: var(--theme-danger);
  font-size: 13px;
  margin-top: 8px;
}

.wrapper .signup-link {
  font-size: 14px;
  color: var(--theme-text-secondary);
  text-align: center;
  margin: 20px 0 0;
}

.wrapper .signup-link a {
  color: var(--theme-primary);
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.3s;
}

.wrapper .signup-link a:hover {
  color: var(--theme-primary-dark);
  text-decoration: underline;
}

/* 验证码区域 */
.captcha-row {
  width: 100%;
  display: flex;
  align-items: flex-end;
  gap: 10px;
  margin: 8px 0;
}

.captcha-input {
  flex: 1;
  margin: 0 !important;
}

.captcha-img {
  width: 120px;
  height: 44px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid var(--theme-border);
  transition: border-color 0.3s;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--theme-bg-middle);
}

.captcha-img:hover {
  border-color: var(--theme-primary);
}

.captcha-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.captcha-loading {
  font-size: 12px;
  color: var(--theme-text-placeholder);
}

.captcha-error {
  font-size: 12px;
  color: var(--theme-danger);
  cursor: pointer;
}

</style>
