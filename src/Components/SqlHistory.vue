<template>
  <div id="container" :style="{ transform: `translateX(${offset}px)` }">
    <button id="historybutton" @click="toggleOffset">
      <
    </button>
    <div id="historybody">
      <div v-for="(message, index) in messages" :key="index" class="message" v-if="message!==null" :style="{ backgroundColor: getBackgroundColor(index) }">
        <div >
          {{ message }}
        </div>
      </div>
      <div id="input">
        <div id="loadercontainer" v-if="showloader">
          <div class="loader"></div>
        </div>
      <input id="aiquestion"
             v-model="question"
             @keyup.enter="Aiquestion"
             style="  width: 290px;
               height:40px;
               background-color: transparent;
               border-radius: 4px ;
               border:1px solid white;
               color:white;
               padding-left:10px;
               font-size:15px;
               font-weight:600;
               margin-bottom:50px;"
             placeholder="Sqlpilot" />
      </div>


    </div>


  </div>
</template>

<script>
import {ref} from "vue";
import axios from "axios";

export default {
  name: "SqlHistory",
  data() {
    return {
      showloader:ref(false),
      offset: 0, // 组件位置的偏移量
      messages:ref([]),
      colors: ['#ff6b6b', '#48dbfb', '#1dd1a1', '#feca57', '#ff9f43', '#ff6b81', '#f9ca24', '#7ed6df', '#778beb', '#e056fd', '#686de0', '#30336b'],
      question:ref(""),


    };
  },

  methods: {
    toggleOffset() {
      this.offset = this.offset === 0 ? 330 : 0; // 切换偏移量的值
    },
    Aiquestion() {
      var userquestion = this.question;
      this.messages.push(userquestion);
      this.question = "";
      this.showloader=true;
      this.questionAi(userquestion);
    },

    async questionAi(userquestion) {
       // 开始请求时显示加载动画

      await axios.post("http://localhost:5000/execute", { userMessage: userquestion })
          .then(response => {
            console.log(response);
            if(response.status === 200) {
              var answer = response.data;
              this.messages.push(answer);
            } else if(response.data.code === 1) {
              this.responsemessage = response.data.message;
            }
          })
          .catch(error => {
            console.error(error);
          })
          .finally(() => {
            this.showloader=false;

             // 请求完成后隐藏加载动画
          });
    },
    appendMessage(sql) {
      console.log(this.messages);
      this.messages.push(sql); // 将数据追加到messages数组中
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
#input{
  margin-top:0;
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
  border-left:1px dashed lightgray;
  font-size:17px;
  color:black;
  font-weight:600;
  padding-left:20px;
  padding-top:80px;
  overflow-y:scroll;

}
  /* HTML: <div class="loader"></div> */
.loader {
    width: 25px;
    aspect-ratio: 1;
    display: grid;
    border-radius: 50%;
    background: conic-gradient(#25b09b 25%,#f03355 0 50%,#514b82 0 75%,#ffa516 0);
    animation: l22 2s infinite linear;
  }
  .loader::before,
  .loader::after {
    content: "";
    grid-area: 1/1;
    margin: 15%;
    border-radius: 50%;
    background: inherit;
    animation: inherit;
  }
  .loader::after {
    margin: 25%;
    animation-duration: 3s;
  }
  @keyframes l22 {
    100% {transform: rotate(1turn)}
  }
#historybutton {
  width: 10px;
  height: 60px;
  transform: translate(10px, 370px);
  background-color:transparent;
  color:white;
  border:1px solid gray;
  border-radius: 4px 0 0 4px;
  border-right:none;
  font-size:15px;
  text-align:left;
  padding-left:0;
  position:fixed;
}
#loadercontainer{
  transform:translate(265px,35px);
}
#historybody::-webkit-scrollbar {
  width: 0;
  height: 0;
}

</style>
