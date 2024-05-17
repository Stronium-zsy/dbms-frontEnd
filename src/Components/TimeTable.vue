<script>
import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {ref, render} from "vue";
import SignInSignUp from "@/Views/SignInSignUp.vue";
import SqlHistory from "@/Components/SqlHistory.vue";
import History from "@/Components/History.vue";
import Table from "@/Components/Table.vue";
import Ai from "@/Components/Ai.vue";
import html2canvas from 'html2canvas'
export default {
  name: "TimeTable",
  components: { Table},
  data(){
    return {
      tableInfo:null,
      table:ref([]),
    };
  },
  mounted() {
    this.tableInfo = this.initializeTableInfo();
    this.table = [
      ['1A', '1B', '1C'],
      ['1D', '1E', '1F'],
    ];
    this.init();
    this.$nextTick(() => {
      html2canvas(this.$refs.movetable).then(canvas => {
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        this.cube.material = material;
        this.animate();  // 开始动画循环
      });
    });
  },
  methods: {
    initializeTableInfo(){
      let size=30;
      let tableInfo=new Array(size);
      for (let i = 0; i < size; i++) {
        tableInfo[i] = new Array(size);
        for (let j = 0; j < size; j++) {
          tableInfo[i][j] = new Array(size).fill(0);  // 使用0初始化数组
        }
      }
      return tableInfo;

    },
    init() {
      const width = this.$el.clientWidth;
      const height = this.$el.clientHeight;
      this.camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
      this.camera.position.z = 1;

      this.scene = new THREE.Scene();
      const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const material = new THREE.MeshNormalMaterial({color: 0xffffff, opacity: 0.0, transparent: true});
      this.cube = new THREE.Mesh(geometry, material);
      this.scene.add(this.cube);

      const edgesGeometry = new THREE.EdgesGeometry(geometry);
      const edgesMaterial = new THREE.LineBasicMaterial({color: 0xffffff});
      const cubeEdges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
      this.scene.add(cubeEdges);

      this.renderer = new THREE.WebGLRenderer({antialias: true});
      this.renderer.setSize(width, height);
      this.$el.appendChild(this.renderer.domElement);

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableZoom = false;
      this.controls.enablePan = false;
      this.controls.addEventListener('change', () => this.renderer.render(this.scene, this.camera));

      this.renderer.render(this.scene, this.camera);
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
    }
  },

  beforeDestroy() {
    // 清理和移除Three.js场景等
  },

}
</script>

<template>
<div id="threejs-container">
  <div ref="movetable" style="width:200px;height:200px;position:absolute;opacity:0;">
    <Table  :index="0" :style="{ backgroundColor:0xffff00 }" :messages="table"/>
  </div>


</div>
</template>

<style scoped>
#threejs-container {
  width: 100%;
  height: 400px; /* Adjust as needed */
}
.movetable {
  width: 200px;
  height: 200px;
  background-color: red;  /* 仍然有颜色以确保能被 html2canvas 捕捉 */
}


</style>