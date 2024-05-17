import App from '/src/App.vue';
import SignInSignUp from '@/Views/SignInSignUp.vue';
import Home from '@/Views/Home.vue';
import {createRouter, createWebHistory} from "vue-router";
import {ref} from "vue";
const routes=[
    { path: '/', component: SignInSignUp },
    { path: '/home', component: Home },
    { path: '/signinsignup', component: SignInSignUp}
];

const router=createRouter({
    history:createWebHistory(),
    routes,
})
export default router;