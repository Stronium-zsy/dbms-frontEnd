<template>
  <div
      id="drop-area"
      @dragover.prevent
      @dragenter.prevent
      @dragleave.prevent
      @drop.prevent="handleDrop"
  >
    <!-- 在这里放置拖放区域的内容 -->
    拖放文件到此处
  </div>
</template>

<script>
export default {
  name:"file",
  methods: {
    handleDrop(event) {
      // 阻止浏览器默认行为
      event.preventDefault();

      // 获取拖放的文件列表
      const files = event.dataTransfer.files;

      // 处理拖放的文件，例如上传或显示文件内容等
      this.processFiles(files);
    },

    processFiles(files) {
      // 处理拖放的文件，可以上传至服务器或在页面中显示文件内容等操作
      console.log(files);
    }
  }
};
</script>

<style>
#drop-area {
  width: 300px;
  height: 200px;
  border: 2px dashed #ccc;
  text-align: center;
  line-height: 200px;
  font-size: 18px;

}
</style>
