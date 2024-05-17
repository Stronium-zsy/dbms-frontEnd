<script>
import {defineComponent} from "vue";
import DefaultLayout from "@/LayOuts/DefaultLayOut.vue";
import Home from "@/Views/Home.vue";
import SignInSignUp from "@/Views/SignInSignUp.vue";
export default defineComponent({
name: "App",
components: {
  SignInSignUp,
  Home,
DefaultLayout,
},

})


</script>

<template>
  <div id="app">
    <DefaultLayout/>
  </div>
</template>

<style scoped>

</style>
