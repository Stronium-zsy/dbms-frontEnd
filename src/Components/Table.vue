<template>
  <div class="table" :style="{ top: top + 'px', left: left + 'px', width: width + 'px', height: height + 'px' }"
       @mousedown="startOperation">
    <button id="closeButton" @click="close">X</button>
    <table :style="{ width: tableWidth + 'px', height: tableHeight + 'px' }" >
      <thead id="tablehead">
      <tr>
        <th v-for="(value, key) in messages[0]" :key="key">{{ key }}</th>
      </tr>
      </thead>
      <tbody id="tablebody">
      <tr v-for="(message, index) in messages" :key="index">
        <td v-for="(value, key) in message" :key="key">{{ value }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

export default {
  name: "Table",
  props: {
    messages: {
      type: Array,
      required: true
    },
    index:0,
  },
  data() {
    return {
      dragging: false,
      resizing: false,
      startPosition: { x: 0, y: 0 },
      startSize: { width: 0, height: 0 },
      offset: { x: 0, y: 0 },
      top: 0,
      left: 0,
      width: 200,
      height: 100,
    };
  },
  computed: {
    tableWidth() {
      return this.width - 20; // 减去内边距的宽度
    },
    tableHeight() {
      return this.height - 20; // 减去内边距的高度
    }
  },
  methods: {
    close(){
      console.log(this.index);
      this.$emit('close',this.index);
    },
    startOperation(event) {
      const rect = event.target.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

      // 根据鼠标位置判断是拖拽还是调整大小
      if (offsetX < 5) {
        this.startResize(event, 'left');
      } else if (offsetX > rect.width - 5) {
        this.startResize(event, 'right');
      } else if (offsetY < 5) {
        this.startResize(event, 'top');
      } else if (offsetY > rect.height - 5) {
        this.startResize(event, 'bottom');
      } else {
        this.startDrag(event);
      }
    },
    startDrag(event) {
      this.dragging = true;
      this.startPosition.x = event.clientX;
      this.startPosition.y = event.clientY;
      this.offset.x = event.clientX - this.left;
      this.offset.y = event.clientY - this.top;
      window.addEventListener('mousemove', this.drag);
      window.addEventListener('mouseup', this.endDrag);

    },
    startResize(event, direction) {
      this.resizing = true;
      this.startSize.width = this.width;
      this.startSize.height = this.height;
      this.startPosition.x = event.clientX;
      this.startPosition.y = event.clientY;
      window.addEventListener('mousemove', (e) => this.resize(e, direction));
      window.addEventListener('mouseup', this.endResize);
    },
    drag(event) {
      if (this.dragging) {
        this.left = event.clientX - this.offset.x;
        this.top = event.clientY - this.offset.y;
      }
    },

    resize(event, direction) {
      if (this.resizing) {
        if (direction === 'left') {
          this.width = this.startSize.width - (event.clientX - this.startPosition.x);
          //this.left = event.clientX;
        } else if (direction === 'right') {
          this.width = this.startSize.width + (event.clientX - this.startPosition.x);
        } else if (direction === 'top') {
          this.height = this.startSize.height - (event.clientY - this.startPosition.y);
          //this.top = event.clientY;
        } else if (direction === 'bottom') {
          this.height = this.startSize.height + (event.clientY - this.startPosition.y);
        }
      }
    },
    endDrag() {
      this.dragging = false;
      window.removeEventListener('mousemove', this.drag);
      window.removeEventListener('mouseup', this.endDrag);
    },
    endResize() {
      this.resizing = false;
      window.removeEventListener('mousemove', this.resize);
      window.removeEventListener('mouseup', this.endResize);
    }
  }
};
</script>

<style scoped>
.table {
  position: absolute;
  cursor: move;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  padding: 10px;
  overflow:scroll;
  user-select:none;
  border-radius:5px;
  box-shadow:0 6px 8px rgba(0, 0, 0, 0.6);
  width:400px;
  height:400px;
  font-weight:600;

}
#tablehead{
  color:black;
  font-size:20px;
}
#tablebody{
  font-size:17px;
}
.table::-webkit-scrollbar{
  width:0;
  height:0;
}
.table:hover {
  cursor: pointer;
}

.table[left] {
  cursor: w-resize;
}

.table[right] {
  cursor: e-resize;
}
#closeButton{
  background:transparent;
  color:black;
  border:none;
  position:fixed;
  z-index:100000;

}
.table[top] {
  cursor: n-resize;
}

.table[bottom] {
  cursor: s-resize;
}
</style>
