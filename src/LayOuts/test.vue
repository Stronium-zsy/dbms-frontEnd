<template>
  <div>
    <div class="controls">
      <select v-model="selectedFile">
        <option v-for="file in pcdFiles" :key="file" :value="file">{{ file }}</option>
      </select>
      <input type="color" v-model="pointCloudColor" />
    </div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader';

export default {
  name:"test",
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      pcdFiles: [],
      selectedFile: '',
      pointCloudColor: '#87CEFA'
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x000000);

      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.set(0, 0, 10);

      this.renderer = new THREE.WebGLRenderer({ canvas: this.$refs.canvas });
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.25;
      this.controls.enableZoom = true;

      const response = await fetch('.');
      const files = await response.text();
      this.pcdFiles = [...new Set(files.match(/\w+\.pcd/g))];

      if (this.pcdFiles.length > 0) {
        this.selectedFile = this.pcdFiles[0];
        this.loadPCDFile(this.selectedFile);
      }

      window.addEventListener('resize', this.onWindowResize);
      this.animate();
    },
    loadPCDFile(file) {
      const loader = new PCDLoader();
      loader.load(file, points => {
        const previousPoints = this.scene.getObjectByName('points');
        if (previousPoints) {
          this.scene.remove(previousPoints);
        }

        points.name = 'points';
        points.material.color.set(this.pointCloudColor);
        this.scene.add(points);

        this.camera.position.set(0, 0, 10);
        this.controls.target.set(0, 0, 0);
        this.controls.update();

        const box = new THREE.Box3().setFromObject(points);
        const center = box.getCenter(new THREE.Vector3());
        this.controls.target.copy(center);
        this.controls.update();
      });
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    }
  }
};
</script>

<style>
body {
  margin: 0;
}

canvas {
  display: block;
}

.controls {
  position: absolute;
  top: 10px;
  left: 30px;
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 5px;
  border-radius: 5px;
}

.controls select,
.controls input {
  margin-right: 10px;
}
</style>
