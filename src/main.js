// Fantastic Four Runner Prototype - Infinite Track with Fire Animation
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { AudioLoader, Audio, AudioListener } from 'three';

// Player Setup
const player = new THREE.Mesh(
  new THREE.BoxGeometry(1, 2, 1),
  new THREE.MeshStandardMaterial({ color: 0x00ffcc })
);
player.position.set(0, 1, 0);


// Scene and Camera Setup
const scene = new THREE.Scene();
scene.add(player)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 20);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Background (Fracture)
const fractureTexture = new THREE.TextureLoader().load('public/fracture.webp');
scene.background = fractureTexture;

// Infinite Track Setup
const trackTexture = new THREE.TextureLoader().load('public/track.webp');
trackTexture.wrapS = THREE.RepeatWrapping;
trackTexture.wrapT = THREE.RepeatWrapping;
trackTexture.repeat.set(1, 60);
const trackMaterial = new THREE.MeshStandardMaterial({
  map: trackTexture,
  emissive: 0x0066ff,
  emissiveIntensity: 0.4,
});
const trackSegments = [];

function createTrackSegment(zPos) {
  const segment = new THREE.Mesh(
    new THREE.BoxGeometry(12, 0.1, 30),
    trackMaterial
  );
  segment.position.set(0, 0, zPos);
  scene.add(segment);
  trackSegments.push(segment);
}
for (let i = 0; i < 6; i++) {
  createTrackSegment(-i * 30);
}

// Fire Animation Along Track Edges
function createFireLine(xOffset) {
  for (let i = 0; i < 60; i++) {
    createObstacle({
      geometry: new THREE.PlaneGeometry(1.5, 4),
      material: new THREE.MeshBasicMaterial({ color: 0xFF4500, transparent: true, opacity: 0.7 }),
      position: [xOffset, 1, -i * 3],
      updateCallback: (obj) => {
        obj.position.z += 0.1;
        obj.material.opacity = Math.random() * 0.4 + 0.5;
        if (obj.position.z > 10) obj.position.z = -180;
      },
      name: 'FireLine'
    });
  }
}
createFireLine(6);
createFireLine(-6);

// Lighting Setup
scene.add(new THREE.AmbientLight(0x6699ff, 0.6));
const dirLight = new THREE.DirectionalLight(0xffeecc, 1);
dirLight.position.set(5, 15, 10);
scene.add(dirLight);

// Sound Effects Setup
const listener = new AudioListener();
player.add(listener);
const collisionSound = new Audio(listener);
new AudioLoader().load('collision.mp3', (buffer) => {
  collisionSound.setBuffer(buffer);
  collisionSound.setVolume(0.5);
});

// Obstacle System
function createObstacle({ geometry, material, position, updateCallback, name }) {
  const obstacle = new THREE.Mesh(geometry, material);
  obstacle.position.set(...position);
  scene.add(obstacle);
  function animateObstacle() {
    updateCallback(obstacle);
    if (checkCollision(obstacle)) handleCollision(obstacle);
    requestAnimationFrame(animateObstacle);
  }
  animateObstacle();
}

function checkCollision(obstacle) {
  return player.position.distanceTo(obstacle.position) < 1.3;
}

function handleCollision(obstacle) {
  console.log(`🔥 Collision with ${obstacle.name}`);
  player.material.color.set(0xff0000);
  collisionSound.play();
  setTimeout(() => player.material.color.set(0x00ffcc), 500);
  scene.remove(obstacle);
}

// Start Infinite Track Animation
function animate() {
  requestAnimationFrame(animate);
  trackSegments.forEach(segment => {
    segment.position.z += 0.1;
    if (segment.position.z > 15) {
      segment.position.z -= 180;
    }
  });
  renderer.render(scene, camera);
}
animate();

function createAsteroidRain() {
  createObstacle({
    geometry: new THREE.SphereGeometry(0.5, 16, 16),
    material: new THREE.MeshStandardMaterial({ color: 0x888888 }),
    position: [Math.random() * 8 - 4, 5, -50],
    updateCallback: (obj) => {
      obj.position.z += 0.2;
      obj.position.y -= 0.1;
      if (obj.position.y < -1) obj.position.set(Math.random() * 8 - 4, 5, -50);
    },
    name: 'Asteroid'
  });
}
createAsteroidRain();

// Infinite Track Animation Correction
function animateAsteroid() {
  requestAnimationFrame(animateAsteroid);
  trackSegments.forEach(segment => {
    segment.position.z += 0.1;
    if (segment.position.z > camera.position.z + 15) {
      segment.position.z -= 300;
    }
  });
  renderer.render(scene, camera);
}
animateAsteroid();