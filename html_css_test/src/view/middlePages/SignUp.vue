<template>
    <div class= "loginpage">
         <div class= "loginpagechilds">
               <div class="wrapper">
                    <div  class="formcss">
                      <h1>注册</h1>
                      <div class="msgcss">
                          <div class="input-box">
                            <input id="nicknameInput" type="username" required />
                            <label>昵称</label>
                            <span id="nicknamemsg"></span>
                          </div>
                          <div class="input-box">
                            <input id="usernameInput" type="username" required @blur="checkname" />
                            <label>用户名</label>
                            <span id="usernamemsg"></span>
                          </div>
                          <div class="input-box">
                            <i class="icon" @click="passwordshow"><View  v-if="passwordisshow"/> <Hide  v-if="!passwordisshow"/></i>
                            <input id="passwordInput" type="password" required />
                            <label>密码</label>
                            <span id="passwordmsg"></span>
                          </div>
                          <div class="input-box">
                            <i class="icon" @click="rePasswordshow"><View  v-if="rePasswordisshow"/> <Hide  v-if="!rePasswordisshow"/></i>
                            <input id="rePasswordInput" type="password" required />
                            <label>确认密码</label>
                            <span id="rePasswordmsg"></span>
                          </div>
                          <div class="input-box">
                            <i class="icon"><Message /></i>
                            <input id="emailInput" type="username" required />
                            <label>邮箱</label>
                            <span id="emailmsg"></span>
                          </div>
                      </div>

                      <button @click="signUpBrungle()" class="btn">注册</button>

                      <div class="signup-link">
                        <p>已有账号? <a href="#" @click="toLogin()">立即登录</a></p>
                      </div>
                    </div>
                </div>
         </div>
      
    </div>
</template>

<script>
import {ref} from 'vue'
import router from '@/utils/router/index'
import {signUpApi,tochecknameApi} from '@/api/login'
import { ElMessage } from 'element-plus'

export default {
  name: 'SignUp',
  components: {
  },
    setup(){

        //控制 密码显隐
        let passwordisshow = ref(false);

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

        //控制 确认密码显隐
        let rePasswordisshow = ref(false);

        let rePasswordshow = function(){
            let passwordField = document.getElementById('rePasswordInput');
            if (passwordField.type === 'password') {
              passwordField.type = 'text';
              rePasswordisshow.value = true;
            } else {
              passwordField.type = 'password';
              rePasswordisshow.value = false;
            }
        }
        

        //注册
        let signUpBrungle = function(){
            
            let nickname = document.getElementById("nicknameInput"); 
            let username = document.getElementById("usernameInput"); 
            let password = document.getElementById("passwordInput");
            let email = document.getElementById("emailInput");
            let rePassword = document.getElementById("rePasswordInput");
            if(nickname.value.trim() == "" || nickname.value.trim() == undefined){
                document.getElementById("nicknamemsg").innerHTML = "*昵称不能为空"
                return;
            }else{
              document.getElementById("nicknamemsg").innerHTML = ""
            }
            if(username.value.trim() == "" || username.value.trim() == undefined){
                document.getElementById("usernamemsg").innerHTML = "*用户名不能为空"
                return;
            }else{
              document.getElementById("usernamemsg").innerHTML = ""
            }
            if(password.value.trim() == "" || password.value.trim() == undefined){
                document.getElementById("passwordmsg").innerHTML = "*密码不能为空"
                return;
            }else{
              document.getElementById("passwordmsg").innerHTML = ""
            }
            if(rePassword.value.trim() == "" || rePassword.value.trim() == undefined){
                document.getElementById("rePasswordmsg").innerHTML = "*确认密码不能为空"
                return;
            }else{
              document.getElementById("rePasswordmsg").innerHTML = ""
            }
            if(email.value.trim() !="" && email.value.trim() != undefined){
              if(!email.value.trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)){
                 document.getElementById("emailmsg").innerHTML = "*邮箱格式错误"
                  return;
              }
            }else{
              document.getElementById("emailmsg").innerHTML = ""
            }

            if(password.value !== rePassword.value){
                document.getElementById("passwordmsg").innerHTML = "*两次密码不一致"
                document.getElementById("rePasswordmsg").innerHTML = "*两次密码不一致"
                return;
            }else{
              document.getElementById("passwordmsg").innerHTML = ""
              document.getElementById("rePasswordmsg").innerHTML = ""
            }
           signUpApi(
            {"nickName":nickname.value.trim(),
             "username":username.value.trim(),
             "password":password.value.trim(),
             "email":email.value.trim()
            }
           ).then(res=>{
            if(res.successful){
                  ElMessage({
                    message: '注册成功',
                    type: 'success',
                  })
              resetfrom()
              toLogin();
            }else{
                  ElMessage({
                    message: '注册失败'+res.resultValue,
                    type: 'warning',
                  })
            }
           })
        }

        //验证用户名是否重复
        let checkname = function(){
          let username = document.getElementById("usernameInput"); 
          if(username.value.trim() !="" && username.value.trim() !=undefined){
            tochecknameApi({"username":username.value.trim()}).then(res=>{
              if(res.successful){
                document.getElementById("usernamemsg").innerHTML = ""
              }else{
                document.getElementById("usernamemsg").innerHTML = "*昵称已被注册"
              }
            })
          }
          
        }
        //重置表单
        let resetfrom = function(){
            document.getElementById("nicknameInput").value = ""
            document.getElementById("usernameInput").value = ""
            document.getElementById("passwordInput").value = ""
            document.getElementById("emailInput").value = ""
            document.getElementById("rePasswordInput").value = ""
        }
  
        let toLogin = function(){
           router.push("/login");
        }


        return {
                passwordisshow,passwordshow,
                rePasswordisshow,rePasswordshow,
                signUpBrungle,
                toLogin,
                resetfrom,
                checkname
                }
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
  width: 460px;
  max-height: 90vh;
  padding: 40px 36px;
  background: var(--theme-bg-card);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
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
.msgcss{
   width: 100%;
   display: flex;
   flex-direction: column;
   overflow: auto;
}

.wrapper h1 {
  font-size: 28px;
  color: var(--theme-text-primary);
  text-align: center;
  margin-bottom: 28px;
  font-weight: 600;
}

.wrapper .input-box {
  position: relative;
  width: 100%;
  margin: 12px 0;
  border-bottom: 2px solid var(--theme-border);
  transition: border-color 0.3s;
}

.wrapper .input-box:focus-within {
  border-bottom-color: var(--theme-primary);
}

.wrapper .input-box input {
  width: 100%;
  height: 42px;
  background: transparent;
  outline: none;
  border: none;
  font-size: 14px;
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
   top: 50px;
   color: var(--theme-danger);
   font-size: 12px;
}

.wrapper .input-box input:focus ~ label,
.wrapper .input-box input:valid ~ label {
  top: -18px;
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
  margin-top: 16px;
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

.wrapper .signup-link {
  font-size: 14px;
  color: var(--theme-text-secondary);
  text-align: center;
  margin: 16px 0 0;
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

</style>
