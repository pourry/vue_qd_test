<template>
    <div class= "loginpage">
         <div class= "loginpagechilds">登录页面</div>
         <div class= "loginpagechilds">
               <div class="wrapper">
                    <form action="#" class="formcss">
                      <h1>登录</h1>
                      <div class="input-box">
                        <i class="fas fa-envelope icon"></i>
                        <input id="usernameInput" type="username" required />
                        <label>用户名</label>
                      </div>
                      <div class="input-box">
                        <i class="icon" @click="passwordshow"><View  v-if = "!passwordisshow"/> <Hide  v-if = "passwordisshow"/></i>
                        <input id="passwordInput" type="password" required />
                        <label>密码</label>
                      </div>

                      <div class="row">
                

                        <a onclick="forgotman()">找回密码</a>
                      </div>

                      <button onclick="loginBrungle()" class="btn">登录</button>

                      <div class="signup-link">
                        <p>Don't have an account? <a href="#">Create one.</a></p>
                      </div>
                    </form>
                </div>
         </div>
      
    </div>
</template>

<script>
import {ref} from 'vue'
export default {
  name: 'Login',
  components: {
  },
  setup(){
  let passwordisshow = ref(true)

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
  

  return {passwordisshow,passwordshow}
  }
}
</script>

<style scoped>
.loginpage {
   height:100%;
   width:100%;
   display: grid; 
   place-items: center;
   grid-template-rows: 5% 80%;
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
  background: #3e404d;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(15px);
}

.formcss{
   width: 100%;
   height: 100%;
   display: grid; 
   place-items: center;
}

  .wrapper:hover {
    box-shadow: 0 0 40px rgba(255,255,255,0.5);
    background: #46474e;
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

@media (max-width: 360px) {
  .wrapper {
    width: 100%;
    height: 100vh;
    border: none;
    border-radius: 0px;
  }

  .wrapper .input-box {
    width: 290px;
  }
  #img {
  z-index: -90;
  }
}
  
</style>