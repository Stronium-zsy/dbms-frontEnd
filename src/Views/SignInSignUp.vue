<script>
import axios from 'axios';
import {ref} from "vue";
import {UserStore} from "@/Store/index.js";

export default{
  name:'SignInSignUp',
  data(){
    return{
      SignInName:ref(""),
      SignInPassword:ref(""),
      SignUpName:ref(""),
      SignUpPassword:ref(""),
    } ;
  },
  mounted() {
    const container = document.getElementById('signcontainer');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');

    if (registerBtn) {
      registerBtn.addEventListener('click', () => {
        container.classList.add('active');
      });
    }

    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        container.classList.remove('active');
      });
    }
  },
  methods:{
    async SignInUser() {
      try {

        // 从你的表单中获取用户信息，例如：
        const userData = {
          email: this.SignInName,
          password: this.SignInPassword,
          // 其他用户信息...
        };
        console.log(userData);



        // 使用 Axios 发送 POST 请求到后端接口
        const response = await axios.post('http://localhost:8080/login',{
          username:this.SignInName,
          password:this.SignInPassword
        }).then(
            response=>{
              if(response.data.code===0){
                this.$emit("success",this.SignInName);
              }
              else{
                alert(response.data.message);
              }
            }
        )
        // 处理后端响应，根据实际情况处理成功或失败的情况
      } catch (error) {
        console.error('登录失败:', error);
        // 处理错误情况...
      }
    },
    async SignUpUser() {

      try {
        // 从你的表单中获取用户信息，例如：

        // 使用 Axios 发送 POST 请求到后端接口
        const response = await axios.post('http://localhost:8080/register',{
          username:this.SignUpName,
          password:this.SignUpPassword,
        }).then(
            response=>{
              console.log(this.SignUpName);
              console.log(this.SignUpPassword);
              console.log(response);
              if(response.data.code===0){
                alert(response.data.message===""?"注册成功":response.data.message);
                this.$emit("success",this.SignUpName);
              }
              else{
                alert(response.data.message);
              }
            }
        )
        console.log(response);

        // 处理后端响应，根据实际情况处理成功或失败的情况

      } catch (error) {
        console.error('注册失败:', error);
        // 处理错误情况...
      }
    }
  }
}

</script>

<template>
  <div class="mainbody">
    <div class="signcontainer" id="signcontainer">
      <div class="form-container sign-up">
        <div class="signupform">
          <h1>
            Create Account
          </h1>
          <input type="email" v-model="SignUpName"
                 placeholder="UserName">
          <input type="password" v-model="SignUpPassword"
                 placeholder="Password">
          <button @click="SignUpUser">
            Sign up
          </button>
        </div>


      </div>
      <div class="form-container sign-in">
        <div class="signinform">
          <h1 >
            Sign In
          </h1>


          <input type="email" v-model="SignInName"
                 placeholder="UserName">

          <input type="password" v-model="SignInPassword"
                 placeholder="Password">
          <button @click="SignInUser" >
            Sign In
          </button>
        </div>


      </div>
      <div class="toggle-container">
        <div class="toggle">
          <div class="toggle-panel toggle-left">
            <h1>
              Welcome Back!
            </h1>
            <p>
              Enter your personal details to use all of site features
            </p>
            <button class="hidden" id="login">
              Sign In
            </button>
          </div>
          <div class="toggle-panel toggle-right">

            <h1>
              Hello Children!
            </h1>
            <p>
              Register with your personal details to use all of site features
            </p>
            <button class="hidden" id="register">
              Sign Up
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>


</template>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Montserrat:400,800');
*{
  margin:0;
  padding:0;
  box-sizing:border-box;
  font-family:'Montserrat',sans-serif;
}
.mainbody{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items:center;
  background:linear-gradient(to right bottom,#9B24A6,#3282F6);
  background-size:cover;
  padding-right:20px;
  z-index:10001;
}
.signcontainer{
  background-color:#2E2E2E;
  border-radius:5px;
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.6);
  position:relative;
  overflow:hidden;
  width:900px;
  max-width:100%;
  min-height:500px;
}
.signcontainer p{
  font-size:14px;
  line-height:20px;
  letter-spacing:0;
  margin:20px 0;
}
.signcontainer span{
  font-size:12px;
}
.signcontainer a{
  color:#333;
  font-size:13px;
  text-decoration:none;
  margin:15px 0 10px;
}

.signcontainer button{
  background-color: transparent;
  border:1px solid white;
  color:#fff;
  font-size:12px;
  padding:10px 45px;
  border-radius:8px;
  font-weight:600;
  letter-spacing:1px;
  text-transform:uppercase;
  margin-top:10px;
  cursor:pointer;
}
.signcontainer button.hidden{
  background-color:transparent;
  border-color:#fff;

}
.signinform,.signupform{
  background-color:#2E2E2E;
  display:flex;
  align-items:center;
  justify-content:center;
  flex-direction:column;
  padding:0 40px;
  height:100%;
}
.signcontainer input{
  background-color:#eee;
  border:none;
  margin:8px 0;
  padding:10px 15px;
  font-size:13px;
  border-radius:8px;
  width:100%;
  outline:none;
}
.form-container{
  position:absolute;
  top:0;
  height:100%;
  transition:all 0.6s ease-in-out;

}
.sign-in{
  left:0;
  width:50%;
  z-index:2;
  color:white;
  border-right:1px white dashed;
}
.signcontainer.active .sign-in{
  transform: translateX(100%);
}
.sign-up{
  left:0;
  width:50%;
  opacity:0;
  z-index:1;
  color:white;
  border-left:1px white dashed;
}
.signcontainer.active .sign-up{
  transform: translateX(100%);
  opacity:1;
  z-index:5;
  animation:move 0.6s;
}
@keyframes move{
  0%, 49.99%{
    opacity:0;
    z-index:1;
  }
  50%, 100%{
    opacity:1;
    z-index:5;
  }
}
.toggle-container{
  position:absolute;
  top:0;
  left:50%;
  width:50%;
  height:100%;
  overflow:hidden;
  transition: all 0.6s ease-in-out;
  z-index:1000;
}
.signcontainer.active .toggle-container{
  transform: translateX(-100%);

}
.toggle{
  height:100%;
  background-color:#2E2E2E;
  color:#fff;
  position:relative;
  left:-100%;
  width:200%;
  transform: translateX(0);
  transition: all 0.6s ease-in-out;
}
.signcontainer.active .toggle{
  transform: translateX(50%);
}
.toggle-panel{
  position: absolute;
  width: 50%;
  height:100%;
  display:flex;
  justify-content:center;
  flex-direction:column;
  padding: 0 30px;
  text-align:center;
  top:0;
  transform: translateX(0);
  transition: all 0.6s ease-in-out;

}

.toggle-left{
  transform: translateX(-200%);
}
.signcontainer.active .toggle-left{
  transform: translateX(0);
}
.toggle-right{
  right:0;
  transform:translateX(0);
}
.signcontainer.active .toggle-right{
  transform: translateX(200%);
}
</style>