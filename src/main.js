// Fantastic Four Runner Prototype with Video Background and Advanced Obstacles
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";


// Launcher pour le jeu
window.onload = function() {
  const launcher = document.createElement('div');
  launcher.style.position = 'fixed';
  launcher.style.top = '0';
  launcher.style.left = '0';
  launcher.style.width = '100%';
  launcher.style.height = '100%';
  launcher.style.background = 'linear-gradient(135deg, #000000, #1f1f1f)';
  launcher.style.display = 'flex';
  launcher.style.flexDirection = 'column';
  launcher.style.alignItems = 'center';
  launcher.style.justifyContent = 'center';
  launcher.style.color = '#ffffff';
  launcher.innerHTML = `
    <h1>Fantastic Four Runner</h1>
    <p>Un jeu inspiré de l'univers Marvel Phase 6</p>
    <button id="startButton" style="padding: 10px 20px; font-size: 20px; margin-top: 20px; cursor: pointer;">Jouer</button>
  `;
  document.body.appendChild(launcher);

  document.getElementById('startButton').addEventListener('click', () => {
    launcher.remove();
    initGame();
  });


};
function initGame() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 10, 18);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

   // Ajout d'une lumière ambiante plus intense pour éclairer la piste
  

  const loader = new GLTFLoader();
  let trackModels = []; // Déclaration correcte en dehors de la boucle

  loader.load('public/models/trackmodele3d.glb', (gltf) => {
    for (let i = 0; i < 5; i++) {
      const trackModel = gltf.scene.clone(); // Cloner le modèle chargé
      trackModel.scale.set(12, 0.5, 40);
      trackModel.position.set(0, -1, -40 * i);
      scene.add(trackModel);
      trackModels.push(trackModel);
    }

    function animateTrack() {
      trackModels.forEach((trackModel) => {
        trackModel.position.z += 0.5;
        if (trackModel.position.z > 20) trackModel.position.z -= 200;
      });
      requestAnimationFrame(animateTrack);
    }
    animateTrack();
  }, undefined, (error) => {
    console.error('Erreur de chargement du modèle 3D:', error);
  })

  
  let powerAvailable = true;
  let powerActive = false;
  

  window.addEventListener('keydown', (e) => {
    if (e.key === 'p' && powerAvailable && !powerActive) {
      powerActive = true;
      powerAvailable = false;
      activatePower();
      setTimeout(() => { powerActive = false; }, 10000); // Pouvoir de 10 secondes
      setTimeout(() => { powerAvailable = true; }, 30000); // Recharge de 30 secondes
    }
  });

  function activatePower() {
    console.log('Pouvoir activé !');
    // Rendre le personnage invincible
    character.userData.invincible = true;
    setTimeout(() => {
      character.userData.invincible = false;
      console.log('Pouvoir terminé');
    }, 10000);
  }
  // Score Counter Setup
let score = 0;
const scoreElement = document.createElement("div");
scoreElement.style.position = "absolute";
scoreElement.style.top = "20px";
scoreElement.style.left = "20px";
scoreElement.style.color = "#fff";
scoreElement.style.fontSize = "24px";
scoreElement.innerText = `Score: ${score}`;
document.body.appendChild(scoreElement);

let gameOverElement;
let isGameOver = false;

// Game Over Display
function showGameOver() {
  gameOverElement = document.createElement("div");
  gameOverElement.style.position = "absolute";
  gameOverElement.style.top = "50%";
  gameOverElement.style.left = "50%";
  gameOverElement.style.transform = "translate(-50%, -50%)";
  gameOverElement.style.color = "#ff0000";
  gameOverElement.style.fontSize = "48px";
  gameOverElement.innerText = "GAME OVER\nPress Arrow Key to Restart";
  document.body.appendChild(gameOverElement);
  cancelAnimationFrame(animationId);
  isGameOver = true;
}

// Collision Detection
function checkCollision(a, b) {
  if (a.userData.invincible) return false;
  return a && b && a.position.distanceTo(b.position) < 2;
}

// Video Background Setup
const video = document.createElement("video");
video.src =
  "public/models/Gen-3 Alpha Turbo 1253773931, i want a video of th, Cropped - IMG 7webp, M 5.mp4";
video.loop = true;
video.muted = true;
video.play();
const videoTexture = new THREE.VideoTexture(video);
scene.background = videoTexture;

// Lighting Setup (to prevent black objects)
const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);



// Character Setup
const loaderCharacter = new GLTFLoader();
let character,
  isJumping = false,
  jumpVelocity = 0;
const lanes = [-5, 0, 5];
let characterLane = 1;
loaderCharacter.load("public/models/the_thingtexturedno_rig.glb", (gltf) => {
  character = gltf.scene;
  character.scale.set(1.2, 1.2, 1.2);
  character.position.set(lanes[characterLane], 1, 5);
  character.rotation.y = Math.PI;
  scene.add(character);
});

let flameModel, portalModel;

loader.load('public/models/flame.glb', (gltf) => {
  flameModel = gltf.scene; 
});

loader.load('public/models/portal.glb', (gltf) => {
  portalModel = gltf.scene;
});

// Keyboard Controls without Camera Movement
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && characterLane > 0) {
    characterLane--;
    character.position.x = lanes[characterLane];
  }
  if (e.key === "ArrowRight" && characterLane < lanes.length - 1) {
    characterLane++;
    character.position.x = lanes[characterLane];
  }
  if (e.key === "ArrowUp" && !isJumping) {
    isJumping = true;
    jumpVelocity = 0.3;
  }
  if (character) character.position.x = lanes[characterLane];
});



let gameSpeed = 0.4; 


// Obstacle Management (Flames, Portals, Rocks)
const obstacles = [];
const obstacleTypes = ["flame", "portal", "rock"];

// Fonction pour obtenir une voie aléatoire unique
function getUniqueLane(existingLanes) {
  const availableLanes = lanes.filter(lane => !existingLanes.includes(lane));
  if (availableLanes.length === 0) {
    // Si toutes les voies sont occupées, réinitialisez
    return lanes[Math.floor(Math.random() * lanes.length)];
  }
  return availableLanes[Math.floor(Math.random() * availableLanes.length)];
}

// Fonction pour créer un obstacle avec une position aléatoire unique
function createObstacle(type, zPos, existingLanes) {
  let obstacle;
  const obstacleLane = getUniqueLane(existingLanes);
  existingLanes.push(obstacleLane); // Ajoutez la voie utilisée

  switch (type) {
    case "flame":
      if (flameModel) {
        obstacle = flameModel.clone();
        obstacle.scale.set(5, 5, 5);
      }
      break;
    case "portal":
      if (portalModel) {
        obstacle = portalModel.clone();
        obstacle.scale.set(2, 2, 2);
        console.log("Creating portal obstacle at", obstacleLane, zPos);
      } else {
        console.warn("Portal model not loaded yet!");
      }
      break;
    case "rock":
      const geometry = new THREE.SphereGeometry(1.5, 16, 16);
      const material = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
      obstacle = new THREE.Mesh(geometry, material);
      obstacle.scale.set(0.7, 0.7, 0.7);
      break;
  }

  if (obstacle) {
    obstacle.position.set(lanes[obstacleLane], 1.5, zPos);
    obstacle.userData.type = type;
    scene.add(obstacle);
    obstacles.push(obstacle);
  }
}

// Création des obstacles avec une position initiale suffisamment loin
setTimeout(() => {
  const initialZPos = -200; // Position initiale loin du personnage
  const numberOfObstacles = 20;
  const existingLanes = []; // Suivi des voies utilisées
  for (let i = 0; i < 10; i++) {
    const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    createObstacle(type, initialZPos - i * 30, existingLanes); // Espacement entre les obstacles
  }
}, 3000); // Temporisation pour donner du temps au joueur

// Fonction pour gérer le mouvement des obstacles
function handleObstacles() {
  obstacles.forEach((obs) => {
    obs.position.z += gameSpeed;
    if (obs.position.z > 5) {
      obs.position.z = -200; // Réinitialiser la position pour réapparaître loin
    }
  });
}

// Jump Mechanics
function handleJump() {
  if (isJumping && character?.position) {
    character.position.y += jumpVelocity;
    jumpVelocity -= 0.01;
    if (character.position.y <= 0) {
      character.position.y = 0;
      isJumping = false;
    }
  }
}

// Restart Game
function restartGame() {
  if (isGameOver) {
    document.body.removeChild(gameOverElement);
    score = 0;
    scoreElement.innerText = `Score: ${score}`;
    character.position.set(0, 1, 5);
    obstacles.forEach((obstacle) => (obstacle.position.z = -300));
    isGameOver = false;
    animate();
  }
}

// Listen for restart key
window.addEventListener("keydown", restartGame);

let animationId;
function animate() {
  animationId = requestAnimationFrame(animate);
  handleJump();
  handleObstacles();
  score += 1;
  scoreElement.innerText = `Score: ${score}`;

  obstacles.forEach((obstacle) => {
    obstacle.position.z += 0.3;
    if (obstacle.position.z > 5) obstacle.position.z = -300;
    if (checkCollision(character, obstacle)) {
      showGameOver();
    }
  });

  renderer.render(scene, camera);
}



  animate();
}



