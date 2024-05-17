// src/views/Home.vue
<script>
import axios from "axios";
import {ref} from "vue";
import Table from "@/Components/Table.vue";
import History from "@/Components/History.vue";
import SqlHistory from "@/Components/SqlHistory.vue";
import SignInSignUp from "@/Views/SignInSignUp.vue";
import Ai from "@/Components/Ai.vue";
import TimeTable from "@/Components/TimeTable.vue";

export default {
  name: "Home",
  components: {TimeTable, SignInSignUp, SqlHistory, History, Table,Ai},
  data(){
    return{
      sql:"",
      messages:ref([]),
      responsemessage:ref(""),
      lastInputTime:null,
      tables:ref([]),
      count:1,
      colors: ['#ff9999', '#99ff99', '#9999ff', '#ffff99', '#ff99ff', '#99ffff', '#ffa07a', '#7fffd4', '#ffd700', '#20b2aa'], // 颜色数组
    }
  },
  computed: {
    // 计算属性，根据索引返回对应的背景颜色
    getBackgroundColor() {
      return (index) => {
        // 使用索引对颜色数组取模，以确保索引超出颜色数组长度时仍然能够获取到颜色
        return this.colors[index % this.colors.length];
      };
    },
  },
  methods:{
    async handleInput(){
      const now = Date.now();
      if (!this.lastInputTime || now - this.lastInputTime >= 10000) {
        // 如果是第一次调用或者距离上次调用已经超过10秒
        // 执行你的逻辑
        // 这里假设你调用的函数是 executeFunction
        this.executeFunction();

        // 更新上次调用的时间戳
        this.lastInputTime = now;
      }

    },
    async executeFunction(){
      if(this.sql.length<=5)return;
      await axios.post("http://localhost:8080/aihelper", { userMessage: this.sql })
          .then(response => {
            if(response.data.code === 0) {
              var answer = response.data.data;
              this.sql+=answer;
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
    async executesql(index,sqlmessage) {
      try {
        console.log(sqlmessage);
        this.sql=sqlmessage;
        const response = await axios.post("http://localhost:8080/processsql", { sql: this.sql });// 发送SQL语句作为请求主体
        if(response.data.code===0) {
          console.log(response.data);
          this.messages = response.data.data;
          console.log(this.messages);
          this.tables[index] = this.messages;
          this.responsemessage = response.data.message;
          this.count++;
          console.log(this.tables);
          console.log(this.responsemessage);
          this.$refs.sqlHistoryRef.appendMessage(this.responsemessage + ': ' + this.sql);
          this.sql="";
        }else if(response.data.code===1){
          this.responsemessage=response.data.message;
          this.count++;
          this.$refs.sqlHistoryRef.appendMessage(this.responsemessage + ': ' + this.sql);

        }
      } catch (e) {
        console.error(e);
      }
    },
    async executeSqlFile(file) {
      try {
        // 读取文件内容
        const reader = new FileReader();
        reader.onload = async (event) => {
          const fileContent = event.target.result;
          const sanitizedContent = fileContent.replace(/[\n\r\t]/g, '');

// 按照分号分割文件内容，得到每一行 SQL 语句
          const sqlStatements = sanitizedContent.split(';');

// 遍历每一条 SQL 语句，并执行
          for (let i = 0; i < sqlStatements.length; i++) {
            let sql = sqlStatements[i].trim();
            // 检查是否为最后一条非空 SQL 语句
            if (sql !== '' && i !== sqlStatements.length - 1) {
              sql += ';'; // 在非最后一条语句后添加分号
            }
            if (sql !== '') {
              await this.executesql(this.count, sql);
            }
          }

        }

        // 以文本格式读取文件
        reader.readAsText(file);
      } catch (error) {
        console.error('Error reading SQL file:', error);
      }
    },




    async execute(index) {
      try {
        console.log(this.sql);
        const response = await axios.post("http://localhost:8080/processsql", { sql: this.sql });// 发送SQL语句作为请求主体
        if(response.data.code===0) {
          console.log(response.data);
          this.messages = response.data.data;
          console.log(this.messages);
          this.tables[index] = this.messages;
          this.responsemessage = response.data.message;
          this.count++;
          console.log(this.tables);
          console.log(this.responsemessage);
          this.$refs.sqlHistoryRef.appendMessage(this.responsemessage + ': ' + this.sql);
          this.sql="";
        }else if(response.data.code===1){
          this.responsemessage=response.data.message;
          this.count++;
          this.$refs.sqlHistoryRef.appendMessage(this.responsemessage + ': ' + this.sql);

        }
      } catch (e) {
        console.error(e);
      }
    },
    closetable(index) {
      console.log(this.tables);
      this.tables[index]=Array().fill().map(()=>[]); // 使用 $set 方法确保 Vue 能够正确地响应数据变化
      console.log(this.tables);
    },

  },
  mounted() {
    this.tables = Array(100).fill().map(() => []);
    this.responsemessage = [];

  }

}
</script>
<!--['#ff9999', '#99ff99', '#9999ff', '#ffff99', '#ff99ff', '#99ffff', '#ffa07a', '#7fffd4', '#ffd700', '#20b2aa']-->
<template>
<!--  <TimeTable/>-->

  <div id="home" >

    <div id=container>



      <div id="title">
      <div id="inside" >
        <div style="color:#E16363" >Y</div>
        <div style="color:#FFB74D" >o</div>
        <div style="color:#9FA8DA" >u</div>
        <div style="color:#E16363" >r</div>
        <div style="color:#EC407A" >S</div>
        <div style="color:#FFCC80" >q</div>
        <div style="color:#FFFFFF;background-color: #3282F6" >l</div>

      </div>
    </div>
      <div id="pagebody">
    <input v-model="this.sql" @keyup.enter="execute(count%10)" placeholder="Press Enter To Execute  SQL" />

    <div v-for="(table, index) in tables" :key="index" id="tables">

      <Table  v-if="table.length>0" :messages="table" :index="index" @close="closetable(index)" :style="{ backgroundColor: getBackgroundColor(index) }"/>
    </div>

        </div>

      </div>
    <div id="history">
      <SqlHistory ref="sqlHistoryRef"/>
    </div>




  </div>


</template>

<style scoped>
#maincontainer{
  display: flex;
  flex-direction: row;
}
#home{
  width:1016px;
  height:100%;
  background-color:transparent;
  transform:translate(499px,200px);
  display:flex;
  flex-direction:row;
}
#history{
  transform:translate(165px,-200px);
  z-index:1000;
  overflow-x:hidden;
}
#history::-webkit-scrollbar{
  width:0;
  height:0;
}

input{
  background-color:transparent;
  width:500px;
  height:50px;
  margin-top:100px;
  border:none;
  border-bottom:1px solid white;
  color:white;
  font-size:25px;
  padding-left:20px;
  z-index:1000;
  font-weight:700;


}
#title{
  color:white;
  font-size:100px;
  font-weight:600;
  transform:translate(70px,50px);
  z-index:1000;
  user-select: none;
}
#pagebody{
  display:flex;
  flex-direction:row;
}
#tables{
  transform:translate(-500px,155px);
}
input:focus{
  outline:none;
}
#container{
  display:flex;
  flex-direction:column;
}
#submit{
  width:100px;
  height:30px;
  background-color:transparent;
  color:white;
  font-size:15px;
  font-weight:600;
  transform:translate(-200px,121px);
  border:none;
  z-index:1000;
}
#ai{
  transform: translate(310px,0);
}
::placeholder{
  text-indent:120px;
  color: lightgray; /* 设置颜色 */
  font-size: 18px; /* 设置字体大小 */
  font-weight:400;
  user-select: none;
}
#inside{
  display:flex;
  flex-direction:row;
  font-family: "Work Sans", sans-serif;

}
/*
<div style="color:#E16363" >Y</div>
<div style="color:#FFB74D" >o</div>
<div style="color:#9FA8DA" >u</div>
<div style="color:#E16363" >r</div>
<div style="color:#EC407A" >S</div>
<div style="color:#FFCC80" >q</div>
<div style="color:#FFFFFF" >l</div>

 */

#insid {
  /* Create a conic gradient. */
  /* Double percentages to avoid blur (#000 10%, #fff 10%, #fff 20%, ...). */
  background: #CA4246;
  background-color: #CA4246;
  background: conic-gradient(
      #CA4246 0%,
      #FFB74D 10%,
      #F18F43 20%,
      #EC407A 30%,
      #E16363 40%,
      #A7489B 50%,
      #CA4246 60%,
      #FFB74D 70%,
      #F18F43 80%,
      #EC407A 90%);


  /* Set thee background size and repeat properties. */
  background-size: 70%;
  background-repeat: repeat;

  /* Use the text as a mask for the background. */
  /* This will show the gradient as a text color rather than element bg. */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  /* Animate the text when loading the element. */
  /* This animates it on page load and when hovering out. */
  animation: rainbow-text-animation-rev 15s ease infinite;

  cursor: pointer;
}

/* Add animation on hover. */
/*.rainbow-text:hover {
//  animation: rainbow-text-animation 0.5s ease infinite;
//}*/
.rainbow-text {
  /* 设置文字为透明，因为我们要使用背景动画来产生彩虹效果 */
  -webkit-background-clip: text;
  background-clip:text;
  /* 设置背景动画 */
  animation: rainbow-text-animation 5s ease infinite;
}

/* Move the background and make it larger. */
/* Animation shown when hovering over the text. */
@keyframes rainbow-text-animation {
  0% {
    background-size: 57%;
    background-position: 0 0;
  }
  20% {
    background-size: 57%;
    background-position: 0 1em;
  }
  100% {
    background-size: 300%;
    background-position: -9em 1em;
  }
}
.canvas {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  width:100px;
  height:100px;
}
/* Move the background and make it smaller. */
/* Animation shown when entering the page and after the hover animation. */
@keyframes rainbow-text-animation-rev {
  0% {
    background-size: 300%;
    background-position: -9em 1em;
  }
  20% {
    background-size: 57%;
    background-position: 0 1em;
  }
  50% {
    background-size: 57%;
    background-position: 0 0;
  }
  80%{
    background-size: 57%;
    background-position: 0 1em;
  }
  100%{
    background-size: 300%;
    background-position: -9em 1em;
  }
}
/* HTML: <div class="loader"></div> */
.loader {
  --r1: 154%;
  --r2: 68.5%;
  width: 60px;
  height:60px;
  aspect-ratio: 1;
  border-radius: 50%;
  background:
      radial-gradient(var(--r1) var(--r2) at top   ,#0000 79.5%,#FFB74D 80%),
      radial-gradient(var(--r1) var(--r2) at bottom,#FFB74D 79.5%,#0000 80%),
      radial-gradient(var(--r1) var(--r2) at top   ,#0000 79.5%,#FFB74D 80%),
      radial-gradient(transparent 50%, transparent),
      white;
  background-size: 50.5% 220%;
  background-position: -100% 0%,0% 0%,100% 0%;
  background-repeat:no-repeat;
  animation: l9 5s infinite linear;
  transform:translate(-5px,50px);
}
@keyframes l9 {
  33%  {background-position:    0% 33% ,100% 33% ,200% 33% }
  66%  {background-position: -100%  66%,0%   66% ,100% 66% }
  100% {background-position:    0% 100%,100% 100%,200% 100%}
}
</style>