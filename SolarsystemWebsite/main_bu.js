import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
var renderer = new THREE.WebGLRenderer({canvas: document.querySelector('#bg'), antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);


var sunTex = new THREE.TextureLoader().load('textures/2k_sun.jpg');
var sun = new THREE.Mesh(
  new THREE.SphereGeometry(0.139, 24, 18, 0, Math.PI * 2, 0, Math.PI),
  new THREE.MeshStandardMaterial({map:sunTex})
);
scene.add(sun);

createPlanet('Mercury', 0.00049, 5.7);
createPlanet('Venus', 0.0012, 10.8);
createPlanet('Earth', 0.0013, 150);
createPlanet('Mars', 0.00068, 22.7);
createPlanet('Jupiter', 0.0143, 77.8);
createPlanet('Saturn', 0.01205, 143.4);
createPlanet('Uranus', 0.00511, 287);
createPlanet('Neptun', 0.00495, 449.5);

var planets = [];



var ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

var gridHelper = new THREE.GridHelper(100, 70);
//scene.add(lightHelper, gridHelper);

var controls = new OrbitControls(camera, renderer.domElement);


function addFlyingStuff(){
  const geometry = new THREE.SphereGeometry(0.15, 5, 5);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff});
  const blib = new THREE.Mesh(geometry, material);

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(500));
  blib.position.set(x,y,z);
  scene.add(blib);
}

function makeLabelCanvas(baseWidth, size, name) {
  const borderSize = 2;
  const ctx = document.createElement('canvas').getContext('2d');
  const font =  `${size}px bold sans-serif`;
  ctx.font = font;
  // measure how long the name will be
  const textWidth = ctx.measureText(name).width;

  const doubleBorderSize = borderSize * 2;
  const width = baseWidth + doubleBorderSize;
  const height = size + doubleBorderSize;
  ctx.canvas.width = width;
  ctx.canvas.height = height * 2;

  // need to set font again after resizing canvas
  ctx.font = font;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';

  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, width, height);

  // scale to fit but don't stretch
  const scaleFactor = Math.min(1, baseWidth / textWidth);
  ctx.translate(width / 2, height / 2);
  ctx.scale(scaleFactor, 1);
  ctx.fillStyle = 'white';
  ctx.fillText(name, 0, 0);

  return ctx.canvas;
}

function createPlanet(name, size, distance){
  const tex = new THREE.TextureLoader().load('textures/' + name + '.jpg');
  var planet = new THREE.Mesh(
    new THREE.SphereGeometry(size, 24, 18, 0, Math.PI * 2, 0, Math.PI),
    new THREE.MeshStandardMaterial({map: tex})
  );
  const planetRing = new THREE.Mesh(
    new THREE.TorusGeometry(distance, 0.01, 16, 100),
    new THREE.MeshStandardMaterial({color: 0xffffff})
  )
  const canvas = makeLabelCanvas(150, 50, name);
  const texture = new THREE.CanvasTexture(canvas);
  const planetLabelMaterial = new THREE.SpriteMaterial ({map: texture, transparent: true});
  const planetLabel = new THREE.Sprite(planetLabelMaterial);

  planet.position.set(distance, 0, 0);
  planetRing.rotation.set(90, 0, 0);
  planetLabel.position.set(planet.position.x, planet.position.y, planet.position.z);
  
  scene.add(planet, planetRing, planetLabel);
}


Array(1000).fill().forEach(addFlyingStuff);

function animate(){
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();