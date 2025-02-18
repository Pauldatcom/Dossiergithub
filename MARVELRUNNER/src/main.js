// Fantastic Four Runner Prototype with Video Background and Advanced Obstacles
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

document.body.style.overflow = 'hidden';
document.documentElement.style.overflow = 'hidden';

const characters = {
  mr_fantastique: "public/models/20_mr._fantastic_mua.glb",
  the_thing: "public/models/the_thingtexturedno_rig.glb",
  human_torch:"public/models/Humantorch.glb",
  mr_kang:"public/models/kang6.glb",
};

let selectedCharacter = "the_thing";

// Launcher pour le jeu
window.onload = function() {
  const launcher = document.createElement('div');
  launcher.style.position = 'fixed';
  launcher.style.top = '0';
  launcher.style.left = '0';
  launcher.style.width = '100%';
  launcher.style.height = '100%';
  launcher.style.background = 'linear-gradient(135deg,rgb(22, 22, 22), #1f1f1f)';
  launcher.style.display = 'flex';
  launcher.style.flexDirection = 'column';
  launcher.style.alignItems = 'center';
  launcher.style.justifyContent = 'center';
  launcher.style.color = '#ffffff';
  launcher.innerHTML = `
    <h1>Fantastic Four Runner</h1>
    <p>Un jeu inspiré de l'univers Marvel Phase 6</p>
    <div id="character-selection" style="display: flex; gap: 20px; margin: 20px;">
      <img src="public/mrfantasticicon.webp" style="width: 80px; cursor: pointer;" data-character="mr_fantastique">
      <img src="public/Thingicon.webp" style="width: 80px; cursor: pointer;" data-character="the_thing">
      <img src="public/torchicon.webp" style="width: 80px; cursor: pointer;" data-character="human_torch">
      <img src="public/kangicon.webp" style="width: 80px; cursor: pointer;" data-character="mr_kang">
    </div>
    <button id="startButton" style="padding: 10px 20px; font-size: 20px; margin-top: 20px; cursor: pointer;">Jouer</button>
  `;
  document.body.appendChild(launcher);
  
  document.querySelectorAll('#character-selection img').forEach(img => {
    img.addEventListener('click', () => {
      selectedCharacter = img.getAttribute('data-character');
      alert('Personnage sélectionné : ' + selectedCharacter);
    });
  });

  const launcherMusic = document.createElement('audio');
launcherMusic.src = 'public/sonMarvel.mp4'; // Chemin vers ta musique
// launcherMusic.loop = true;  // Pour qu'elle tourne en boucle
// launcherMusic.autoplay = true;   //Lance automatiquement
launcherMusic.volume = 0.1;


document.body.appendChild(launcherMusic);

  document.getElementById('startButton').addEventListener('click', () => {
    launcher.remove();
    initGame();
  });


};
function initGame() {
  
  const scene = new THREE.Scene();
  const wallShaderMaterial = new THREE.ShaderMaterial({ // Shaders GLSL , Variables globale , VertexShader "vUv" coordonnes
    uniforms: {
        time: { value: 0 },
        opacity: { value: 0.6 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        uniform float opacity;
        varying vec2 vUv;
        
        void main() {
            float wave = sin(vUv.y * 10.0 + time * 2.0) * 0.5 + 0.5;
            vec3 color = mix(vec3(0.0, 0.1, 0.5), vec3(0.2, 0.6, 1.0), wave);
            gl_FragColor = vec4(color, opacity * wave);
        }
    `,
    transparent: true
});
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 10, 18);
  const wallGeometry = new THREE.BoxGeometry(2, 10, 350);

const leftWall = new THREE.Mesh(wallGeometry, wallShaderMaterial);
const rightWall = new THREE.Mesh(wallGeometry, wallShaderMaterial);

leftWall.position.set(-12, 5, 0); // Ajuste à ta piste
rightWall.position.set(12, 5, 0);

scene.add(leftWall);
scene.add(rightWall);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  document.body.appendChild(renderer.domElement);

   // Ajout d'une lumière ambiante plus intense pour éclairer la piste
  

  const loader = new GLTFLoader();
  let trackModels = []; // Déclaration correcte en dehors de la boucle

  loader.load('public/models/trackmodele3d.glb', (gltf) => {
    for (let i = 0; i < 5; i++) {
      const trackModel = gltf.scene.clone(); // Cloner le modèle chargé
      trackModel.scale.set(25, 0.5, 50);
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
      setTimeout(() => { powerActive = false; }, 15000); // Pouvoir de 15 secondes
      setTimeout(() => { powerAvailable = true; }, 30000); // Recharge de 30 secondes
    }
  });

  function activatePower() {
    console.log('Pouvoir activé !');
    // Rendre le personnage invincible
    character.userData.invincible = true;
    let blinkInterval = setInterval(() => {
      character.visible = !character.visible; // Alterne la visibilité
  }, 200); // Change toutes les 200ms (tu peux ajuster)

  setTimeout(() => {
      clearInterval(blinkInterval);  // Arrête le clignotement
      character.visible = true;      // Remet visible
      character.userData.invincible = false;
      console.log('Pouvoir terminé');
  }, 15000); // Pouvoir pendant 15 secondes
}

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


const collisionSound = new Audio('public/songcollision1.mp3');
collisionSound.volume = 0.7;  // Volume à 70%
// Collision Detection
function checkCollision(a, b) {
  if (a.userData.invincible) return false;
  const boxA = new THREE.Box3().setFromObject(a);
  const boxB = new THREE.Box3().setFromObject(b);
  boxB.expandByScalar(0.5);

  
  if (boxA.intersectsBox(boxB)) {
    collisionSound.play();  // Joue le son de collision
    return true;
  }
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
loaderCharacter.load(characters[selectedCharacter], (gltf) => {
  character = gltf.scene;
  character.scale.set(1.2, 1.2, 1.2);
  character.position.set(lanes[characterLane], 1, 5);
  character.rotation.y = Math.PI;
  scene.add(character);
});

let flameModel, portalModel, rockModel;

loader.load('public/models/flame.glb', (gltf) => {
  flameModel = gltf.scene; 
});

loader.load('public/models/ObstacleShield.glb', (gltf) => {
  portalModel = gltf.scene;
});

loader.load('public/models/ObstacleDisque.glb', (gltf) => {
  rockModel = gltf.scene;
  rockModel.rotation.x = Math.PI / 2;
});

// Enlever les barres de scroll de la page
window.addEventListener('load', () => {
  document.body.style.overflow = 'hidden';
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
    if (e.key.toLowerCase() === 'S' && !isJumping) {
      e.preventDefault();
      if (character.position.y > 0){
        jumpVelocity = -1;
      }
      return false;
    }
  if (character) character.position.x = lanes[characterLane];
  
});


const trackWidth = 25;
const laneCount = 3;
const laneWidth = (trackWidth / laneCount) * 1;
lanes [0] = -laneWidth;
lanes [1] = 0;
lanes [2] = laneWidth;

let gameSpeed = 0.4;
function increaseSpeed() {
  if (score % 1500 === 0) gameSpeed += 0.1; 
}

// Obstacle Management (Flames, Portals, Rocks)
const laneObstacles = {
  [-8]:'rock',
  [0]:'flame',
  [8]:'portal'
};
const obstacles = [];
const obstacleTypes = [];

function createObstacle(type, zPos, lane) {
  let obstacle;
  let height = 0.5;
  switch (type) {
    case "flame":
      if (flameModel) obstacle = flameModel.clone();
      obstacle.scale.set(5, 5, 5);
      height = 1.2;
      break;
     case "portal":
       if (portalModel) obstacle = portalModel.clone();
      obstacle.scale.set(10, 10, 10);
      height = 1;
       break;
       case "rock":
        if (rockModel) obstacle = rockModel.clone();
        rockModel.rotation.x = Math.PI / 2;
       obstacle.scale.set(5, 5, 5);
       height = 1;
        break;
  }
  if (obstacle) {
    if (zPos > -5) zPos = -50; // Assure que l'obstacle n'apparaisse pas trop proche du joueur
    obstacle.position.set(lane, height, zPos);
    scene.add(obstacle);
    obstacles.push(obstacle)
  }
}

// Paramètres pour le spawn des obstacles
const obstacleSpawnCount = 2; // Nombre d'obstacles à générer à chaque intervalle
const obstacleSpacing = 200; // Distance minimale entre les obstacles

function createObstacles() {
  const lanes = [-8, 0, 8];
  for (let i = 0; i < obstacleSpawnCount; i++) {
    const lane = lanes[Math.floor(Math.random() * lanes.length)];
    const types = ["rock", "flame", "portal"];
    const type = types[Math.floor(Math.random() * types.length)];
    const zPos = -200 - (i * obstacleSpacing) - Math.random() * 100; // Ajout de l'espacement
    createObstacle(type, zPos, lane);
  };
};

setInterval(createObstacles, 2000); // Créer des obstacles régulièrement sur chaque lane

function createObstacleForLane(lane, zPos) {
  const type = laneObstacles[lane];
  createObstacle(type, zPos, lane); // Correction : plus d'appel récursif
}

// Création des obstacles avec une position initiale suffisamment loin
setTimeout(() => {
  const initialZPos = -300; // Position initiale loin du personnage
  const existingLanes = []; // Suivi des voies utilisées
  for (let i = 0; i < 10; i++) {
    const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    createObstacle(type, initialZPos - i * 40, existingLanes); // Espacement entre les obstacles
  }
}, 5000); // Temporisation pour donner du temps au joueur

// Fonction pour gérer le mouvement des obstacles
function handleObstacles() {
  obstacles.forEach((obs) => {
    obs.position.z += gameSpeed;
    if (obs.position.z > 5) {
      obs.position.z = -300; // Réinitialiser la position pour réapparaître loin
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




// Suppression de l'ancien conteneur UI et création d'un nouveau à gauche
const uiContainer = document.createElement("div");
uiContainer.style.position = "absolute";
uiContainer.style.left = "20px";
uiContainer.style.bottom = "20px";
uiContainer.style.display = "flex";
uiContainer.style.display = "grid";
uiContainer.style.gridTemplateAreas = `
  ".  P  ."
  ". up ."
  "left . right"
  ". down ."
`;
uiContainer.style.gap = "5px";
// uiContainer.style.flexDirection = "column"; // Empile les boutons verticalement
// uiContainer.style.justifyContent = "center"; // Centre verticalement
// uiContainer.style.alignItems = "center";     // Centre horizontalement
uiContainer.style.gap = "15px";
document.body.appendChild(uiContainer);


// Fonction pour créer des boutons interactifs
function createButton(iconPath, action) {
  const button = document.createElement("div");
  button.style.width = "80px";
  button.style.height = "80px";
  button.style.display = "flex";
  button.style.alignItems = "center";
  button.style.justifyContent = "center";
  button.style.cursor = "pointer";

  const iconButton = document.createElement("img");
  iconButton.src = iconPath;
  iconButton.style.width = "50px";
  iconButton.style.height = "50px";

  button.appendChild(iconButton);
    uiContainer.appendChild(button);
    return button;
}

// Simuler les actions du jeu
function moveLeft() { console.log("Déplacement à gauche"); }
function moveRight() { console.log("Déplacement à droite"); }
function jump() { console.log("Saut"); }
function down(){}




// Ajout des boutons
const leftButton = createButton("public/arrow-left-line.svg", moveLeft);
const rightButton = createButton("public/arrow-right-line.svg", moveRight);
const upButton = createButton("public/arrow-up-line.svg", jump);
const downButton = createButton("public/arrow-down-line.svg", down,);


leftButton.style.gridArea = "left";
rightButton.style.gridArea = "right";
upButton.style.gridArea = "up";
downButton.style.gridArea = "down";

// createButton("P", ActivatePower);

// Ajout du titre
const gameTitle = document.createElement("div");
gameTitle.innerText = "ESCAPE FROM KANG";
gameTitle.style.position = "absolute";
gameTitle.style.top = "30%";
gameTitle.style.left = "20px";
gameTitle.style.transform = "translateY(-50%)";
gameTitle.style.fontSize = "40px";
gameTitle.style.color = "#00ffff";
gameTitle.style.fontFamily = "Marvel, sans-serif";
gameTitle.style.textTransform = "uppercase";
gameTitle.style.textShadow = "3px 3px 15px rgba(0, 255, 255, 0.9)";
document.body.appendChild(gameTitle);

// Score dynamique
const scoreElement = document.createElement("div");
scoreElement.style.position = "absolute";
scoreElement.style.top = "250px";
scoreElement.style.left = "47%";
scoreElement.style.color = "#ffffff";
scoreElement.style.fontSize = "28px";
scoreElement.style.fontWeight = "bold";
scoreElement.style.fontFamily = "Marvel, sans-serif";
scoreElement.innerText = "Score: 0";
document.body.appendChild(scoreElement);

const menuIcon = document.createElement("img");
menuIcon.src = "public/settings.svg";  // Chemin vers ton icône
menuIcon.style.width = "40px";
menuIcon.style.height = "40px";
menuIcon.style.position = "absolute";
menuIcon.style.top = "20px";
menuIcon.style.right = "20px";
menuIcon.style.cursor = "pointer";
menuIcon.style.zIndex = "1000"; // Pour s'assurer qu'elle soit au-dessus






document.body.appendChild(menuIcon);







const SettingsMenu = document.createElement("div");
SettingsMenu.style.position = "absolute";
SettingsMenu.style.top = "0";
SettingsMenu.style.right = "0";
SettingsMenu.style.width = "250px";
SettingsMenu.style.height = "100%";
SettingsMenu.style.display = "flex";
SettingsMenu.style.flexDirection = "column";
SettingsMenu.style.alignItems = "center";
SettingsMenu.style.justifyContent = "center";
SettingsMenu.style.gap = "20px";
SettingsMenu.style.boxShadow = "5px 0 15px rgba(0,0,0,0.5)";
SettingsMenu.style.display = "none"; // Caché au départ
SettingsMenu.style.zIndex = "999"; // Juste sous l'icône



document.body.appendChild(SettingsMenu);



const resumeButton = document.createElement("button")

resumeButton.innerText = "Reprendre";
resumeButton.style.padding = "10px 20px";
resumeButton.style.fontSize = "18px";


resumeButton.addEventListener("click", () => {
  SettingsMenu.style.display = "none"; // Cache le menu
  animate(); // Relance l'animation du jeu
});


const muteButton = document.createElement("button");
muteButton.innerText = "Couper la musique";
muteButton.style.padding = "10px 20px";
muteButton.style.fontSize = "18px";

const quitButton = document.createElement("button");
quitButton.innerText = "Quitter";
quitButton.style.padding = "10px 20px";
quitButton.style.fontSize = "18px";
quitButton.addEventListener("click", () => {
  window.location.reload(); // Recharge la page pour revenir au menu principal
});

// Ajouter les boutons au menu
SettingsMenu.appendChild(resumeButton);
SettingsMenu.appendChild(muteButton);
SettingsMenu.appendChild(quitButton);

let animationId; // Déclaration globale de l'animation

// Vérifie si la fonction animate existe
if (typeof animate === 'undefined') {
  function animate() {
    animationId = requestAnimationFrame(animate);
    // Ajoute ici les appels nécessaires pour le rendu du jeu
  }
}

menuIcon.addEventListener("click", () => {
  SettingsMenu.style.display = SettingsMenu.style.display === "none" ? "flex" : "none";
  if (SettingsMenu.style.display === "flex") {
    cancelAnimationFrame(animationId); // Met le jeu en pause
  } else {
    animate(); // Relance l'animation si on ferme le menu
  }
});

function animateWalls() {
  wallShaderMaterial.uniforms.time.value += 0.05;
  requestAnimationFrame(animateWalls);
}
animateWalls();


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

// // Classement des meilleurs scores
// const leaderboard = document.createElement("div");
// leaderboard.style.position = "absolute";
// leaderboard.style.top = "120px";
// leaderboard.style.left = "20px";
// leaderboard.style.color = "#ffffff";
// leaderboard.style.fontSize = "24px";
// leaderboard.style.fontFamily = "Marvel, sans-serif";
// document.body.appendChild(leaderboard);

 let score = 0;
 let highScores = [0, 0, 0];

// function updateScore() {
//     score += 1;
//     scoreElement.innerText = `Score: ${score}`;
   
//     if (score > highScores[2]) {
//         highScores[2] = score;
//         highScores.sort((a, b) => b - a);
//     }
   
//     leaderboard.innerHTML = `
//         <div>Top Scores:</div>
//         <div>1st: ${highScores[0]}</div>
//         <div>2nd: ${highScores[1]}</div>
//         <div>3rd: ${highScores[2]}</div>
//     `;
//     requestAnimationFrame(updateScore);
// }
// updateScore();