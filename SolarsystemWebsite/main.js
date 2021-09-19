import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
var renderer = new THREE.WebGLRenderer({canvas: document.querySelector('#bg'), antialias: true});
var controls = new OrbitControls(camera, renderer.domElement);
var ambientLight;
var bodies = [];
var generalSize = 1.5;
var generalSpeed = 0.01;

init();
animate();

function init(){
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.setZ(30);

  ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);

  Array(1000).fill().forEach(addFlyingStuff);

  createBody('Sun', 0.139 + generalSize, THREE.MathUtils.randFloatSpread(-10, 10) * generalSpeed, 0, Math.random() * generalSpeed);
  createBody('Mercury', 0.00049 + generalSize, THREE.MathUtils.randFloatSpread(-10, 10) * generalSpeed, 5.7, Math.random() * generalSpeed);
  createBody('Venus', 0.0012 + generalSize, THREE.MathUtils.randFloatSpread(-10, 10) * generalSpeed, 10.8, Math.random() * generalSpeed);
  createBody('Earth', 0.0013 + generalSize, THREE.MathUtils.randFloatSpread(-10, 10) * generalSpeed, 150, Math.random() * generalSpeed);
  createBody('Mars', 0.00068 + generalSize, THREE.MathUtils.randFloatSpread(-10, 10) * generalSpeed, 22.7, Math.random() * generalSpeed);
  createBody('Jupiter', 0.0143 + generalSize, THREE.MathUtils.randFloatSpread(-10, 10) * generalSpeed, 77.8, Math.random() * generalSpeed);
  createBody('Saturn', 0.01205 + generalSize, THREE.MathUtils.randFloatSpread(-10, 10) * generalSpeed, 143.4, Math.random() * generalSpeed);
  createBody('Uranus', 0.00511 + generalSize, THREE.MathUtils.randFloatSpread(-10, 10) * generalSpeed, 287, Math.random() * generalSpeed);
  createBody('Neptun', 0.00495 + generalSize, THREE.MathUtils.randFloat(-10, 10) * generalSpeed, 449.5, Math.random() * generalSpeed);

  var gridHelper = new THREE.GridHelper(1000, 70);
  //scene.add(gridHelper);
}

function addFlyingStuff(){
  const geometry = new THREE.SphereGeometry(0.15, 5, 5);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff});
  const blib = new THREE.Mesh(geometry, material);

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(1500));
  blib.position.set(x,y,z);
  scene.add(blib);
}

function animate(){
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);

  for (var i = 0; i < bodies.length; i++){
    bodies[i].rot += bodies[i].rotSpeed
    bodies[i].rotation.set(0, bodies[i].rot, 0);
    bodies[i].orbit += bodies[i].orbitSpeed;
    bodies[i].position.set(Math.cos(bodies[i].orbit) * bodies[i].orbitRadius, 0, Math.sin(bodies[i].orbit) * bodies[i].orbitRadius);
  }
}


function createBody(name, size, rotSpeed, orbitRadius, orbitSpeed) {
  const tex = new THREE.TextureLoader().load('textures/' + name + '.jpg');
  var body = new THREE.Mesh(
    new THREE.SphereGeometry(size, 24, 18, 0, Math.PI * 2, 0, Math.PI),
    new THREE.MeshStandardMaterial({map: tex})
  );

  bodies.push(body);

  bodies[bodies.length-1].rot = Math.random();
  bodies[bodies.length-1].rotSpeed = rotSpeed;
  bodies[bodies.length-1].orbitRadius = orbitRadius;
  bodies[bodies.length-1].orbit = Math.random() * Math.PI * 2;
  bodies[bodies.length-1].orbitSpeed = orbitSpeed;

  var ring = new THREE.Mesh(
    new THREE.TorusGeometry(orbitRadius, 0.1, 16, 100),
    new THREE.MeshStandardMaterial({color: 0xffffff, wireframe: false})
  );
    ring.rotation.x = 1.573;
  scene.add(body, ring);
}
