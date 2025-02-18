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
function increaseSpeed() {
  if (score % 500 === 0) gameSpeed += 0.1; 
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
  createObstacleForLane();
  increaseSpeed();
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





// window.onload = function() {
//   const dataForm = document.createElement('div');
//   dataForm.style.position = 'fixed';
//   dataForm.style.top = '0';
//   dataForm.style.left = '0';
//   dataForm.style.width = '100%';
//   dataForm.style.height = '100%';
//   dataForm.style.background = 'linear-gradient(135deg, #000000, #1f1f1f)';
//   dataForm.style.display = 'flex';
//   dataForm.style.flexDirection = 'column';
//   dataForm.style.alignItems = 'center';
//   dataForm.style.justifyContent = 'center';
//   dataForm.style.color = '#ffffff';
//   dataForm.innerHTML = `
//     <h1>Bienvenue sur Fantastic Four Runner</h1>
//     <form id="userForm" style="display: flex; flex-direction: column; gap: 15px;">
//       <input type="text" placeholder="Nom" id="username" required>
//       <input type="email" placeholder="Email" id="email" required>
//       <input type="number" placeholder="Âge" id="age" required>
//       <button type="submit" style="padding: 10px 20px; font-size: 20px; cursor: pointer;">Commencer</button>
//     </form>
//   `;

//   document.body.appendChild(dataForm);

//   document.getElementById('userForm').addEventListener('submit', (e) => {
//     e.preventDefault();
//     const userData = {
//       name: document.getElementById('username').value,
//       email: document.getElementById('email').value,
//       age: document.getElementById('age').value
//     };
//     localStorage.setItem('userData', JSON.stringify(userData));
//     dataForm.remove();
//     initGame();
//   });
// };




// Création du shader pour un effet animé
const wallShaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
      time: { value: 0 },  // Variable pour l’animation
      opacity: { value: 0.6 }  // Transparence du mur
  },
  vertexShader: 
      varying vec2 vUv;
      void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
  ,
  fragmentShader: 
      uniform float time;
      uniform float opacity;
      varying vec2 vUv;
      
      void main() {
          // Générer un effet de vagues dynamiques
          float wave = sin(vUv.y * 10.0 + time * 2.0) * 0.5 + 0.5;
          
          // Couleur du mur (bleu énergétique)
          vec3 color = mix(vec3(0.0, 0.1, 0.5), vec3(0.2, 0.6, 1.0), wave);
          
          // Appliquer la transparence et l'effet lumineux
          gl_FragColor = vec4(color, opacity * wave);
      }
  ,
  transparent: true // Permet la transparence
});


const wallGeometry = new THREE.BoxGeometry(2, 10, 100);


const leftWall = new THREE.Mesh(wallGeometry, wallShaderMaterial);
const rightWall = new THREE.Mesh(wallGeometry, wallShaderMaterial);


leftWall.position.set(-3, 5, 0);
rightWall.position.set(3, 5, 0);


scene.add(leftWall);
scene.add(rightWall);


function animateWalls() {
  wallShaderMaterial.uniforms.time.value += 0.05; // Change la vitesse ici
  requestAnimationFrame(animateWalls);
}


animateWalls();