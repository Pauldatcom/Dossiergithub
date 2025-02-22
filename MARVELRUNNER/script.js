import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

document.addEventListener("DOMContentLoaded", () => {
  const modelContainer = document.getElementById("model-container");
  const characterSlots = document.querySelectorAll(".character-slot");
  const playButton = document.getElementById("playButton");
  const bgMusic = document.getElementById("bgMusic");

  let scene, camera, renderer, loader, model;
  let selectedCharacter = "the_thing";
  importMenu();

  function initThree() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      45,
      modelContainer.clientWidth / modelContainer.clientHeight,
      0.1,
      1000
    );
    // Lumière directionnelle puissante (simule le soleil)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Lumière ambiante pour adoucir les ombres
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);
    camera.position.set(0, 2, 10);

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
    modelContainer.appendChild(renderer.domElement);

    loader = new GLTFLoader();
  }

  function loadModel(modelPath) {
    console.log("Chargement du modèle :", modelPath);
    if (model) {
      scene.remove(model);
    }

    loader.load(
      modelPath,
      (gltf) => {
        model = gltf.scene;
        model.scale.set(1, 1, 1);
        scene.add(model);
        

        const box = new THREE.Box3().setFromObject(model);
        const size = Math.max(
    
          box.getSize(new THREE.Vector3()).x,
          box.getSize(new THREE.Vector3()).y,
          box.getSize(new THREE.Vector3()).z
        );
        
        model.traverse((child) => {
          if (child.isMesh) {
            child.material.side = THREE.DoubleSide; // Permet d'afficher les deux côtés des surfaces
            child.material.needsUpdate = true; // Met à jour le rendu
            console.log("Matériau appliqué :", child.material);
          }
        });
        const scaleFactor = 3 / size; // Réduit l’échelle à une taille raisonnable
        // model.scale.set(scaleFactor, scaleFactor, scaleFactor);
        // const center = box.getCenter(new THREE.Vector3());
        // model.position.sub(center);
        // console.log("Nouveau centrage :", model.position);
        // console.log("Nouvelle échelle appliquée :", model.scale);
        // console.log("Position du modèle :", model.position);
        // console.log("Échelle du modèle :", model.scale);
        // console.log(
        //   "Dimensions du modèle :",
        //   new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3())
        // );

        console.log("Modèle chargé avec succès !");
      },
      undefined,
      (error) => {
        console.error("Erreur lors du chargement du modèle :", error);
      }
    );
  }

  function animate() {
    requestAnimationFrame(animate);
    if (model) model.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  initThree();
  animate();

  const modelPaths = [
    "public/models/mmefantastic.glb",
    "public/models/Humantorch.glb",
    "public/models/kang6.glb",
    "public/models/the_thingtexturedno_rig.glb",
  ];
  
  const modelKeys = [
    "mme_fantastic",
    "human_torch",
    "mr_kang",
    "the_thing",
  ];
  loadModel("public/models/kang6.glb");
  characterSlots.forEach((slot, index) => {
    slot.addEventListener("click", () => {
      selectedCharacter = modelKeys[index]; // ✅ Met à jour le personnage sélectionné
      localStorage.setItem("selectedCharacter", selectedCharacter); // ✅ Stocke la valeur
      console.log("Personnage sélectionné et stocké :", selectedCharacter);
  
      loadModel(modelPaths[index]); // ✅ Charge le bon modèle
    });
  });
});


function importMenu() {
  const menuIcon = document.createElement("img");
  menuIcon.src = "public/icons/settings.svg";  
  menuIcon.style.width = "40px";
  menuIcon.style.height = "40px";
  menuIcon.style.position = "absolute";
  menuIcon.style.top = "20px";
  menuIcon.style.right = "20px";
  menuIcon.style.cursor = "pointer";
  menuIcon.style.zIndex = "1000"; 

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
  SettingsMenu.style.display = "none"; 
  SettingsMenu.style.zIndex = "999"; 

  document.body.appendChild(SettingsMenu);

  const muteButton = document.createElement("button");
  muteButton.innerText = "Couper la musique";
  muteButton.style.padding = "10px 20px";
  muteButton.style.fontSize = "18px";
  muteButton.addEventListener("click", () => {
    const bgMusic = document.getElementById("bgMusic");
    if (bgMusic) {
      bgMusic.muted = !bgMusic.muted;
      muteButton.innerText = bgMusic.muted ? "Activer la musique" : "Couper la musique";
    }
  });

  const volumeSlider = document.createElement("input");
  volumeSlider.type = "range";
  volumeSlider.min = "0";
  volumeSlider.max = "1";
  volumeSlider.step = "0.01";
  volumeSlider.value = document.getElementById("bgMusic") ? document.getElementById("bgMusic").volume : 0.4;
  volumeSlider.addEventListener("input", (e) => {
    const bgMusic = document.getElementById("bgMusic");
    if (bgMusic) bgMusic.volume = e.target.value;
  });

  SettingsMenu.appendChild(muteButton);
  SettingsMenu.appendChild(volumeSlider);

  menuIcon.addEventListener("click", () => {
    SettingsMenu.style.display = SettingsMenu.style.display === "none" ? "flex" : "none";
  });
}



document.addEventListener("DOMContentLoaded", () => {
  const playButton = document.getElementById("playButton");

  if (bgMusic) {
    bgMusic.volume = 0.4; // Ajuste le volume (0.0 = muet, 1.0 = max)
  }
  if (playButton) {
    playButton.addEventListener("click", () => {
      if (bgMusic) {
        bgMusic.pause(); // Arrête la musique
        bgMusic.currentTime = 0; // Remet à zéro
      }
      window.location.href = "jeu.html"; // Redirige vers la page du jeu
    });
  }
});

// setTimeout(() => {
//   window.location.href = "jeu.html"; // Redirection vers la page du jeu
// }, 1000)