<template>
    <div class= "loginpage">
         <div class= "loginpagechilds">
               <div class="wrapper">
                    <div class="formcss">
                      <h1>登录</h1>
                      <div class="input-box">
                        <i class="fas fa-envelope icon"></i>
                        <input id="usernameInput" type="username" required />
                        <label>用户名</label>
                        <span id="usernamemsg"></span>
                      </div>
                      <div class="input-box">
                        <i class="icon" @click="passwordshow"><View  v-if = "passwordisshow"/> <Hide  v-if = "!passwordisshow"/></i>
                        <input id="passwordInput" type="password" required />
                        <label>密码</label>
                        <span id="passwordmsg"></span>
                      </div>

                      <div class="row">
                

                        <a onclick="forgotman()">找回密码</a>
                      </div>

                      <div class="loginbutcss">
                        <button @click="loginBrungle()" class="btn">登录</button>
                        <span id="loginfalsespan" class="loginfalse"></span>
                      </div>
                      <div class="signup-link">
                        <p>没有账号? <a href="#" @click="toSignUp()">去创建-></a></p>
                      </div>
                    </div>
                </div>
         </div>
      
    </div>
</template>

<script>
import {ref,onMounted,onBeforeUnmount} from 'vue'
import {login} from '@/api/login'
import router from '@/utils/router'
import store from '@/utils/store'
export default {
  name: 'Login',
  components: {
  },
  setup(){

  //控制 密码显隐
  let passwordisshow = ref(false)

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


 //登录
  let loginBrungle = function(){
      let username =  document.getElementById("usernameInput");
      let userpassword =  document.getElementById("passwordInput");
      if(username.value.trim() =='' || username.value.trim() == undefined){
         document.getElementById("usernamemsg").innerHTML= "*用户名不能为空";
         return;
      }else{
         document.getElementById("usernamemsg").innerHTML= "";
      }


      if(userpassword.value.trim() =='' || userpassword.value.trim() == undefined){
         document.getElementById("passwordmsg").innerHTML= "*密码不能为空";
         return;
      }else{
         document.getElementById("passwordmsg").innerHTML= "";
      }


      login(
      {'username': username.value,
       'password' : userpassword.value}
      ).then(res => {
         if(res.successful){
            document.getElementById("usernameInput").value = "";
            document.getElementById("passwordInput").value = "";
            document.getElementById("loginfalsespan").innerHTML= "";
            localStorage.setItem("Authorization",res.resultValue.token);
            store.commit("SETTOKEN",{value: res.resultValue.token});
            router.push("/home"); 
         }else{
            document.getElementById("loginfalsespan").innerHTML= res.resultValue
         }
      })
  }
// 前往 注册页面
  let toSignUp = function(){
      router.push("/signUp");
  }

  let keyDown = function(e) {
      // 回车则执行登录方法，enter键的ASCII是13
      if (e.keyCode === 13) {
        loginBrungle() // 需要执行的方法方法
      }
    }
  
  onMounted(() => {
    window.addEventListener('keydown', keyDown)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('keydown',keyDown)
  })

  return {passwordisshow,passwordshow,
          loginBrungle,
          toSignUp,
          keyDown}
  }
}
</script>

<style scoped>
.loginbutcss{
 height:100%;
 width:100%;
 display:grid;
 place-items:center;
}
.loginfalse{
  color: #eb2525;
}
.loginpage {
   height:100%;
   width:100%;
   /*display: grid; 
   place-items: center;
   grid-template-rows: 5% 80%; 
   */
}
.loginpagechilds{
   width:100%;
   height:100%;
   display: flex;
   justify-content: center;
   align-items: center;
}

.wrapper {
  width: 50%;
  height:55%;
  background: rgba(62, 64, 77, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(15px); /*背景添加滤镜  模糊*/
}

.formcss{
   width: 100%;
   height: 100%;
   display: grid; 
   place-items: center;
}

  .wrapper:hover {
    box-shadow: 0 0 40px rgba(255,255,255,0.5);
    background: rgba(62, 64, 77, 0.5);
  }

.wrapper h1 {
  font-size: 2em;
  color: #fff;
  text-align: center;
}

.wrapper .input-box {
  position: relative;
  width: 90%;
  margin: 30px 0;
  border-bottom: 2px solid #fff;
}

.wrapper .input-box input {
  width: 100%;
  height: 50px;
  background: transparent;
  outline: none;
  border: none;
  font-size: 1em;
  color: #fff;
  padding: 0 40px 0 5px;
}

.wrapper .input-box label {
  position: absolute;
  top: 50%;
  left: 5px;
  transform: translateY(-50%);
  font-size: 1em;
  color: #fff;
  pointer-events: none;
  transition: 0.5s;
}

.wrapper .input-box > span{
   position: absolute;
   top: 60px;
   color: #eb2525;

}

.wrapper .input-box input:focus ~ label,
.wrapper .input-box input:valid ~ label {
  top: -5px;
}

.wrapper .input-box .icon {
  position: absolute;
  right: 8px;
  color: #fff;
  font-size: 1.2em;
  width:5%;
  height:5%;
  top: 30%;
}

.wrapper .row {
  margin: -15px 0 15px;
  font-size: 0.9em;
  color: #fff;
  display: flex;
  justify-content: space-between;
}

.wrapper .row label {
  display: flex;
  align-items: center;
  gap: 5px;
}

.wrapper .row a {
  color: #fff;
  text-decoration: none;
}

.wrapper .options a:hover {
  text-decoration: underline;
}

.wrapper .btn {
  width: 40%;
  height: 40px;
  background: #fff;
  outline: none;
  border: none;
  border-radius: 40px;
  cursor: pointer;
  font-size: 1em;
  font-weight: 500;
  color: #000;
  margin-top: 10px;
}
  
  .btn:hover {
    background: #ffffea;
  }

.wrapper .signup-link {
  font-size: 0.9em;
  color: #fff;
  text-align: center;
  margin: 25px 0 10px;
}

.wrapper .signup-link a {
  color: #fff;
  text-decoration: none;
  font-weight: 600;
}

.wrapper .signup-link a:hover {
  text-decoration: underline;
}

</style>