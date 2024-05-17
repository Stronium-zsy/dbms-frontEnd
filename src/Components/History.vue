<template>
  <div class="sidebar" :style="{ left: sidebarLeft + 'px', display: isSidebarVisible ? 'block' : 'none' }">
    <!-- 侧边栏内容 -->
    <div class="sidebar-content">
      <!-- Your sidebar content here -->
    </div>
    <!-- 控制侧边栏显示或隐藏的箭头按钮 -->
    <div class="arrow-button" @click="toggleSidebarVisibility">
      <i class="fa fa-chevron-right" :class="{ 'fa-rotate-180': isSidebarVisible }"></i>
    </div>
  </div>
</template>

<script>
export default {
  name:"History",
  data() {
    return {
      isSidebarVisible: true, // 控制侧边栏显示或隐藏状态
      sidebarLeft: 0, // 侧边栏的左偏移量
      startX: 0, // 鼠标按下时的初始X坐标
      sidebarStartLeft: 0 // 鼠标按下时的侧边栏初始左偏移量
    };
  },
  methods: {
    toggleSidebarVisibility() {
      this.isSidebarVisible = !this.isSidebarVisible;
    },
    handleMouseDown(event) {
      this.startX = event.clientX;
      this.sidebarStartLeft = this.sidebarLeft;
      document.addEventListener('mousemove', this.handleMouseMove);
      document.addEventListener('mouseup', this.handleMouseUp);
    },
    handleMouseMove(event) {
      const deltaX = event.clientX - this.startX;
      this.sidebarLeft = this.sidebarStartLeft + deltaX;
    },
    handleMouseUp() {
      document.removeEventListener('mousemove', this.handleMouseMove);
      document.removeEventListener('mouseup', this.handleMouseUp);
    }
  },
  mounted() {
    // 将mousedown事件绑定到侧边栏头部，实现拖拽功能
    const sidebarHeader = document.querySelector('.sidebar-content');
    sidebarHeader.addEventListener('mousedown', this.handleMouseDown);
  },
  beforeUnmount() {
    // 在组件销毁前移除事件监听器，避免内存泄漏
    const sidebarHeader = document.querySelector('.sidebar-content');
    sidebarHeader.removeEventListener('mousedown', this.handleMouseDown);
  }
};
</script>

<style>
.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 200px;
  background-color: #f0f0f0;
  transition: left 0.3s ease; /* 添加过渡效果 */
}

.sidebar-content {
  padding: 20px;
}

.arrow-button {
  position: absolute;
  top: 50%;
  left: -20px;
  transform: translateY(-50%);
  cursor: pointer;
  width:100px;
  height:100px;
  background-color:white;
}
</style>
