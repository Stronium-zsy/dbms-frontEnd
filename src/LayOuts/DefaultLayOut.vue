<script>
import Home from "@/Views/Home.vue";
import File from "@/Components/file.vue";
import SignInSignUp from "@/Views/SignInSignUp.vue";
import test from "./test.vue";
import {ref} from "vue";

export default {
  name: "DefaultLayOut",
  components: {SignInSignUp, File, Home,test},
  data(){
    return{
      IsLogin:ref(false),
    }
  },
  methods:{
    handleDrop(event) {
      // 阻止浏览器默认行为
      event.preventDefault();

      // 获取拖放的文件列表
      const files = event.dataTransfer.files;

      // 处理拖放的文件，例如上传或显示文件内容等
      this.processFiles(files);

    },
    async processFiles(files) {
      // 处理拖放的文件，可以上传至服务器或在页面中显示文件内容等操作
      console.log(files);
      await this.$refs.homeref.executeSqlFile(files[0]);


    },

    async processDirectory(directory) {
      const files = await this.readDirectory(directory);
      for (let i = 0; i < files.length; i++) {
        if (files[i].isDirectory) {
          await this.processDirectory(files[i]);
        } else {
          await this.$refs.homeref.executeSqlFile(files[i]);
        }
      }
    },
    showHome(username){
      this.username=username;
      this.IsLogin=true;
    },

    readDirectory(directory) {
      return new Promise((resolve, reject) => {
        const reader = directory.createReader();
        reader.readEntries((entries) => {
          resolve(entries);
        }, (error) => {
          reject(error);
        });
      });
    }

  }
}
</script>

<template>
  <div id="container" @dragover.prevent
       @dragenter.prevent
       @dragleave.prevent
       @drop.prevent="handleDrop">
    <Home v-if="IsLogin" ref="homeref"/>
    <SignInSignUp v-if="!IsLogin" @success="showHome"/>



  </div>

</template>

<style scoped>
#container{
  margin:0;
  padding:0;
  height:3000px;
  width:100%;
  background-color:#242424;
  overflow:hidden;
}
#container::-webkit-scrollbar{
  width:0;
  height:0;
}


</style>