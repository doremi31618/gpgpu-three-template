import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

export default class Sketch{
  constructor({dom}){
    this.container=dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.scene = new THREE.Scene();

    //init renderer
    this.renderer = new THREE.WebGLRenderer({
      alpha : true,
      antialias: true
    })
    this.renderer.setSize(this.width, this.height);
    this.container.appendChild(this.renderer.domElement);
    
    //init camera
    this.camera = new THREE.PerspectiveCamera(70, this.width/this.height, 0.01, 10);
    this.camera.position.z = 1;
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    
    this.addObject();
    this.setupResize();
    this.render();
  }
  setupResize(){
    // window.addEventListener('resize', this.resize.bind(this));
    this.container.addEventListener('resize', this.resize.bind(this));
  }
  resize(){
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.renderer.setSize(this.width, this.height)
    this.camera.aspect = this.width/this.height;

    this.camera.updateProjectionMatrix()
    
  }
  addObject(){
    //add object geometry -> material -> mesh -> add to scene
    this.geometry = new THREE.PlaneGeometry(10,10,50,50);
    this.material = new THREE.MeshNormalMaterial();
    
    this.time = 0;
    this.material = new THREE.ShaderMaterial({
        uniforms: {
            time: {value: this.time}
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
    })
    this.mesh = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.mesh);

  }
  render(){
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;

    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));
  }
}

new Sketch({
  dom: document.querySelector('#container')
})