import { powerUpIntervals, upgrades } from "./constants/upgrades.js";
import {
  activateSingularityBoost,
  activateSolarFlare,
} from "./constants/skills.js";

let blackhole = document.querySelector(".blackhole-image");

blackhole.addEventListener("mousemove", (event) => {
  let x = event.offsetX / blackhole.offsetWidth - 0.5;
  let y = event.offsetY / blackhole.offsetHeight - 0.5;

  blackhole.style.transform = `scale(1.1) rotate(${x * 10}deg)`;
  blackhole.style.filter = `blur(${Math.abs(y) * 3}px)`;
});

blackhole.addEventListener("mouseleave", () => {
  blackhole.style.transform = "scale(1) rotate(0deg)";
  blackhole.style.filter = "blur(0px)";
});

let darkmatter = document.querySelector(".darkmatter-cost"); //
let parseddarkmatter = parseFloat(darkmatter.innerHTML);

let dpcText = document.getElementById("dpc-text"); // va cherche un élément par son ID
let dpsText = document.getElementById("dps-text");

let darkmatterImgContainer = document.querySelector(
  ".darkmatter-img-container"
);

let upgradesNavButton = document.getElementById("upgrades-nav-button");
let skillsNavButton = document.getElementById("skills-nav-button");
let artifactNavButton = document.getElementById("artifact-nav-button");

let dpc = 1; // darkmatterperclic

let dps = 0; // darkmatterpersecond

const bgm = new Audio("assets/audio/bgm.mp3"); // bgm = backgroundmusic
bgm.volume = 0.1;

function incrementdarkmatter(event) {
  // fonction pour effet +1 le fade
  const clickingSound = new Audio("assets/audio/pop-sound-effect-197846.mp3");
  clickingSound.volume = 0.1;
  clickingSound.play();

  darkmatter.innerHTML = Math.round((parseddarkmatter += dpc));

  const x = event.offsetX;
  const y = event.offsetY;

  const div = document.createElement("div");
  div.innerHTML = `+${Math.round(dpc)}`;
  div.style.cssText = `color: white; position: absolute; left: ${x}px; top: ${y}px; font-size: 15px; pointer-events: none;`; // pour le style, directement implementer dans le css
  darkmatterImgContainer.appendChild(div);

  div.classList.add("fade-up");

  timeout(div);
}

const timeout = (div) => {
  setTimeout(() => {
    div.remove();
  }, 800);
};

function buyUpgrade(upgrade) {
  // function qui généralise la création d'Upgrade. Réduit le nmbre de ligne
  const matchedUpgrade = upgrades.find(
    (currentUpgrade) => currentUpgrade.name === upgrade
  );

  if (!matchedUpgrade) {
    console.error("Upgrade non trouvée :", upgrade); // Pour trouver l'erreur si pb a la création d'une nouvelle Upgrade
    return;
  }

  const upgradeDiv = document.getElementById(`${matchedUpgrade.name}-upgrade`);
  const nextLevelDiv = document.getElementById(
    `${matchedUpgrade.name}-next-level`
  );
  const nextLevelP = document.getElementById(`${matchedUpgrade.name}-next-p`);

  if (parseddarkmatter >= matchedUpgrade.parsedCost) {
    matchedUpgrade.parsedCost = Math.round(
      matchedUpgrade.parsedCost * matchedUpgrade.costMultiplier
    );

    // Mise à jour du texte du coût DANS L'INTERFACE
    document.querySelector(`.${matchedUpgrade.name}-cost`).innerHTML =
      matchedUpgrade.parsedCost;

    // Mise à jour dans l'objet upgrade
    matchedUpgrade.cost.innerHTML = matchedUpgrade.parsedCost;
    const upgradeSound = new Audio(
      "assets/audio/creepy-space-signal-213834.mp3"
    );
    upgradeSound.volume = 0.1;
    upgradeSound.play();

    darkmatter.innerHTML = Math.round(
      (parseddarkmatter -= matchedUpgrade.parsedCost)
    );

    let index = powerUpIntervals.indexOf(
      parseFloat(matchedUpgrade.level.innerHTML)
    );

    if (index !== -1) {
      upgradeDiv.style.cssText = `border-color: white`;
      nextLevelDiv.style.cssText = `background-color: #5A5959; font-weight: normal`;
      matchedUpgrade.cost.innerHTML = Math.round(
        (matchedUpgrade.parsedCost *= matchedUpgrade.costMultiplier)
      );

      if (matchedUpgrade.name === "clicker") {
        dpc *= matchedUpgrade.powerUps[index].multiplier;
        nextLevelP.innerHTML = `+${matchedUpgrade.parsedIncrease} darkmatter per click`;
      } else {
        dps -= matchedUpgrade.powerUps[index].multiplier;
        dps += matchedUpgrade.power;
        nextLevelP.innerHTML = `+${matchedUpgrade.parsedIncrease} darkmatter per second`;
      }
    }

    document.querySelector(`.${matchedUpgrade.name}-level`).innerHTML =
      parseInt(
        document.querySelector(`.${matchedUpgrade.name}-level`).innerHTML
      ) + 1;

    matchedUpgrade.level.innerHTML++;

    index = powerUpIntervals.indexOf(
      parseFloat(matchedUpgrade.level.innerHTML)
    ); // parsefloat car dans le string donc va  cherche dans upgrades.js pour verifier

    if (index !== -1) {
      upgradeDiv.style.cssText = `border-color: red`;
      nextLevelDiv.style.cssText = `background-color: #CC4500; font-weight: bold`;
      nextLevelP.innerText = matchedUpgrade.powerUps[index].description;

      matchedUpgrade.cost.innerHTML = Math.round(
        matchedUpgrade.parsedCost *
          2.5 *
          1.004 ** parseFloat(matchedUpgrade.level.innerHTML)
      );
    } else {
      matchedUpgrade.cost.innerHTML = Math.round(
        (matchedUpgrade.parsedCost *= matchedUpgrade.costMultiplier)
      );
      matchedUpgrade.parsedIncrease = parseFloat(
        (
          matchedUpgrade.parsedIncrease * matchedUpgrade.darkmatterMultiplier
        ).toFixed(2)
      ); // tofixed pour avoir 2 chiffre après la virgule

      if (matchedUpgrade.name === "clicker")
        nextLevelP.innerHTML = `+${matchedUpgrade.parsedIncrease} darkmatter per click`;
      else
        nextLevelP.innerHTML = `+${matchedUpgrade.parsedIncrease} darkmatter per second`;
    }

    if (matchedUpgrade.name === "clicker") dpc += matchedUpgrade.parsedIncrease;
    else {
      dps += matchedUpgrade.power;
      matchedUpgrade.power += matchedUpgrade.parsedIncrease;
      dps += matchedUpgrade.power;
    }
  }
}

function save() {
  //  fonctionne avec le local storage de la page qui est dans la partie application lorsque j'inspecte la page
  localStorage.clear();

  upgrades.map((upgrade) => {
    const object = JSON.stringify({
      // permet de convertir un objet JavaScript en une chaîne de texte au format JSON. Pour stocker dans le local storage
      parsedLevel: parseFloat(upgrade.level.innerHTML),
      parsedCost: upgrade.parsedCost,
      parsedIncrease: upgrade.parsedIncrease,
    });

    // console.log(object)

    localStorage.setItem(upgrade.name, object);
  });

  localStorage.setItem("dpc", JSON.stringify(dpc));
  localStorage.setItem("dps", JSON.stringify(dps));
  localStorage.setItem("darkmatter", JSON.stringify(parseddarkmatter));
}

function load() {
  upgrades.map((upgrade) => {
    const savedValues = JSON.parse(localStorage.getItem(upgrade.name));

    // console.log(upgrade.name, savedValues)
    upgrade.parsedCost = savedValues.parsedCost;
    upgrade.parsedIncrease = savedValues.parsedIncrease;

    upgrade.level.innerHTML = savedValues.parsedLevel;
    upgrade.cost.innerHTML = Math.round(upgrade.parsedCost);
    upgrade.increase.innerHTML = upgrade.parsedIncrease;
  });

  dpc = JSON.parse(localStorage.getItem("dpc"));
  dps = JSON.parse(localStorage.getItem("dps"));
  parseddarkmatter = JSON.parse(localStorage.getItem("darkmatter"));

  darkmatter.innerHTML = Math.round(parseddarkmatter);
  console.log(load);
}

setInterval(() => {
  parseddarkmatter += dps / 10;
  darkmatter.innerHTML = Math.round(parseddarkmatter);
  dpcText.innerHTML = Math.round(dpc);
  dpsText.innerHTML = Math.round(dps);
  //bgm.play()
}, 100);

skillsNavButton.addEventListener("click", function () {
  const upgradeContainers = document.querySelectorAll(".upgrade");

  upgradeContainers.forEach((container) => {
    if (container.classList.contains("type-skill"))
      container.style.display = "flex";
    else container.style.display = "none";
  });
});

upgradesNavButton.addEventListener("click", function () {
  const upgradesContainer = document.querySelectorAll(".upgrade");

  upgradesContainer.forEach((container) => {
    if (container.classList.contains("type-upgrade"))
      container.style.display = "flex";
    else container.style.display = "none";
  });
});

artifactNavButton.addEventListener("click", function () {
  const upgradesContainer = document.querySelectorAll(".upgrade");

  upgradesContainer.forEach((container) => {
    if (container.classList.contains("type-artifact"))
      container.style.display = "flex";
    else container.style.display = "none";
  });
});

function createParticle() {
  let particle = document.createElement("div");
  particle.classList.add("particle");

  let container = document.getElementById("particle-container");
  container.appendChild(particle);

  let x = Math.random() * window.innerWidth;
  let y = Math.random() * window.innerHeight * 0.5 + window.innerHeight * 0.3;
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;

  setTimeout(() => {
    particle.remove();
  }, 2000);
}

setInterval(createParticle(), 200);

function createOrbitingObjects(numObjects = 10) {
  // Augmente à 10 objets
  let orbitContainer = document.createElement("div");
  orbitContainer.classList.add("orbit-container");

  document
    .querySelector(".darkmatter-img-container")
    .appendChild(orbitContainer);

  for (let i = 0; i < numObjects; i++) {
    let orbitObject = document.createElement("div");
    orbitObject.classList.add("orbit-object");

    let size = Math.random() * 12 + 3; // Taille entre 3px et 15px
    let speed = Math.random() * 5 + 3; // Vitesse entre 3s et 8s
    let distance = Math.random() * 100 + 50; // Distance entre 50px et 150px
    let startAngle = Math.random() * 360; // Position de départ aléatoire

    orbitObject.style.width = `${size}px`;
    orbitObject.style.height = `${size}px`;
    orbitObject.style.animation = `orbit-${i} ${speed}s linear infinite`;
    orbitObject.style.animationDelay = `${Math.random() * 2}s`; // Délai de départ aléatoire

    let orbitKeyframes = `
            @keyframes orbit-${i} {
                0% { transform: rotate(${startAngle}deg) translateX(${distance}px) rotate(-${startAngle}deg); }
                100% { transform: rotate(${
                  startAngle + 360
                }deg) translateX(${distance}px) rotate(-${
      startAngle + 360
    }deg); }
            }
        `;

    let styleSheet = document.styleSheets[0];
    styleSheet.insertRule(orbitKeyframes, styleSheet.cssRules.length);

    orbitContainer.appendChild(orbitObject);
  }
}
createOrbitingObjects(12);

function launchRocket() {
  let rocket = document.createElement("img");
  rocket.src = "assets/rocket1.png";
  let randomClass = "moving-rocket" + Math.round(Math.random() + 1);
  rocket.classList.add(randomClass);
  rocket.classList.add("rocket");

  let yPos = Math.random() * 50 + 20; // Hauteur aléatoire entre 20% et 70%
  rocket.style.top = `${yPos}%`;

  document.body.appendChild(rocket);

  setTimeout(() => {
    rocket.remove();
  }, 5000); // Supprime la fusée après 5s
}

// Lance une fusée toutes les 7 secondes
setInterval(() => {
  const allShips = document.querySelectorAll(".rocket");
  const rocketLevel = document.querySelector(".rocket-level");
  console.log(allShips.length);
  console.log(rocketLevel.innerHTML);
  if (allShips.length < Number(rocketLevel.innerHTML)) {
    launchRocket();
  }
}, 1000);

function createAspiratingParticles(event) {
  const particle = document.createElement("div");
  particle.classList.add("particle");

  // Position de la particule au moment du clic
  const x = event.offsetX;
  const y = event.offsetY;

  // Définir les propriétés CSS personnalisées pour la position initiale
  particle.style.setProperty("--x", `${x}px`);
  particle.style.setProperty("--y", `${y}px`);

  // Positionner la particule
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;

  // Ajouter la particule à l'écran
  document.body.appendChild(particle);

  // Créer l'animation de particule aspirée vers le trou noir
  particle.style.animation = "moveToCenter 1s forwards";

  // Supprimer la particule après l'animation
  setTimeout(() => {
    particle.remove();
  }, 1000);
}

// Ajout de l'écouteur d'événements pour le clic sur le trou noir
blackhole.addEventListener("click", createAspiratingParticles);

let satelliteUpgradeLevel = 0;

function activateSatelliteUpgrade() {
  satelliteUpgradeLevel += 1;

  // Ajouter des satellites et augmenter la vitesse de rotation tous les 10 niveaux
  if (satelliteUpgradeLevel % 10 === 0) {
    increaseOrbitSpeed();
  }
}

function increaseOrbitSpeed() {
  const orbitalObjects = document.querySelectorAll(".orbital-object");
  orbitalObjects.forEach((object, index) => {
    const currentDuration = parseFloat(
      getComputedStyle(object).animationDuration
    );
    const newDuration = currentDuration * 0.9; // Augmente la vitesse de 10%
    object.style.animationDuration = `${newDuration}s`;
  });
}

// Simuler un clic sur l'upgrade satellite
setInterval(activateSatelliteUpgrade, 10000); // À chaque 10 secondes, un upgrade est effectué pour simuler le jeu

window.incrementdarkmatter = incrementdarkmatter;
window.buyUpgrade = buyUpgrade;
window.save = save;
window.load = load;
window.activateSingularityBoost = activateSingularityBoost;
window.activateSolarFlare = activateSolarFlare;
