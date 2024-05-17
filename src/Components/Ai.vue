<template>
  <div id="container" :style="{ transform: `translateX(${offset}px)` }">

    <div id="historybody">
      <div v-for="(message, index) in messages" :key="index" class="message" v-if="message!==null" :style="{ backgroundColor: getBackgroundColor(index) }">
        <div >{{ message }}</div>

      </div>

      <input id="aiquestion" v-model="question" @keyup.enter="questionAi">
    </div>
    <button id="historybutton" @click="toggleOffset">
      >
    </button>
  </div>


</template>

<script>
import {ref} from "vue";
import axios from "axios";

export default {
  name: "Ai",
  data() {
    return {
      offset: 0, // 组件位置的偏移量
      messages:ref([]),
      colors: ['#ff6b6b', '#48dbfb', '#1dd1a1', '#feca57', '#ff9f43', '#ff6b81', '#f9ca24', '#7ed6df', '#778beb', '#e056fd', '#686de0', '#30336b'],
      question:ref(""),

    };
  },

  methods: {
    toggleOffset() {
      this.offset = this.offset === 0 ? -330 : 0; // 切换偏移量的值
    },
    appendMessage(answer) {
      console.log(this.messages);
      this.messages.push(answer); // 将数据追加到messages数组中
    },
    async questionAi(){
      try {
        console.log(this.question);
        const response = await axios.post("http://localhost:5000/execute", { userMessage: this.question });// 发送SQL语句作为请求主体
        if(response.data.code===0) {
          console.log(response.data);
          var answer=response.data.data;
          this.messages.push(answer);
          console.log(this.messages);

        }else if(response.data.code===1){
          this.responsemessage=response.data.message;


        }
      } catch (e) {
        console.error(e);
      }
    },
    getBackgroundColor(index) {
      // 根据索引对颜色数组取模，确保索引超出颜色数组长度时仍然能够获取到颜色
      return this.colors[index % this.colors.length];
    },
  }
};
</script>

<style scoped>
h2 {
  color: black;
}
#container {
  width: 350px;
  height: 7000px;
  background-color: transparent;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: row;
  overflow-x:hidden;
  transition: transform 0.5s ease; /* 添加过渡效果 */
}
#aiquestion{
  height:40px;
  width:300px;
  transform:translate(-300px,400px);

}
.message {
  margin-bottom: 10px; /* 设置消息间距 */
  padding-bottom:10px;
  width:290px;
  padding-left:10px;
  box-shadow:0 6px 8px rgba(0, 0, 0, 0.6);
  border-radius:2px;
}
#historybody {
  height: 7000px;
  width: 330px;
  background-color: transparent;
  transform: translate(19px, -60px);
  border-right:1px dashed lightgray;
  font-size:17px;
  color:black;
  font-weight:600;
  padding-left:20px;
  padding-top:80px;
  overflow-y:scroll;
}
#historybutton {
  width: 10px;
  height: 60px;
  transform: translate(21px, 370px);
  background-color:#242424;
  color:white;
  border:1px solid gray;
  border-radius: 0 4px 4px 0;
  border-left:none;
  font-size:15px;
  text-align:left;
  padding-left:0;
  position:fixed;
}

#historybody::-webkit-scrollbar {
  width: 0;
  height: 0;
}

</style>
