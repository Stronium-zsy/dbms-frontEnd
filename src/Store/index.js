import {defineStore} from 'pinia'
export const UserStore=defineStore('User',{
    id:'user',
    state:()=>({
        UserName:'',
        Password:'',
        loggedIn:false,
        UserId:'',
        token:null,
    }),

    getters:{},
    actions:{
        setUsername(UserName){
            this.UserName=UserName;
        },
        setPassword(Password){
            this.Password=Password;
        },
        setUserId(UserId){
            this.UserId=UserId;
        },
        loadUserFromLocalStorage(){
            const user=JSON.parse(localStorage.getItem('user'));
            if(user){
                this.UserName=user.UserName;
                this.Password=user.Password;
                this.UserId=user.UserId;
                this.loggedIn=true;
            }

        },
        saveUserToLocalStorage(){
            localStorage.setItem('user',JSON.stringify({
                UserName:this.UserName,
                Email:this.Email,
                Password:this.Password,
            }))
        },
        setToken(token){
            this.token=token;
            console.log(this.token);
            this.$patch()
        },
        clearToken(){
            this.token=null;
            this.$patch()
        },
        getToken(){
            return this.token;
        },
        UpdateUser(UserName,Email,Password,UserId){
            this.UserName=UserName;
            this.Email=Email;
            this.Password=Password;
            this.UserId=UserId;
            this.loggedIn=true;
            console.log(this.UserName);
            console.log(this.Email);
            console.log(this.Password);
            console.log(this.UserId);
        }
    },
})