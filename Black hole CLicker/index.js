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

let darkmatter = document.querySelector(".darkmatter-cost");
let parseddarkmatter = parseFloat(darkmatter.innerHTML);

let dpcText = document.getElementById("dpc-text"); // Will fetch an element by its ID
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
  div.style.cssText = `color: white; position: absolute; left: ${x}px; top: ${y}px; font-size: 15px; pointer-events: none;`; // for the style, directly implement in the css
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
  let matchedUpgrade = upgrades.find(
    (currentUpgrade) => currentUpgrade.name === upgrade
  );

  if (!matchedUpgrade) {
    if (upgrade === "Singularity Boost") {
      parseddarkmatter = activateSingularityBoost(
        parseddarkmatter,
        darkmatter,
        dpc
      );
    } else if (upgrade === "Solar Flare") {
      parseddarkmatter = activateSolarFlare(parseddarkmatter, darkmatter, dpc);
    }
    return;
  }

  if (!matchedUpgrade) {
    console.error("Upgrade non trouvée :", upgrade); // To find the error if there's a problem when creating a new Upgrade
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

    // Update cost text IN THE INTERFACE
    document.querySelector(`.${matchedUpgrade.name}-cost`).innerHTML =
      matchedUpgrade.parsedCost;

    // Update in the upgrade object
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
    ); // parseFloat because it's in a string, so it will check in upgrades.js to verify

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
      ); // toFixed to have 2 decimal places

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
  //  works with the local storage of the page which is in the application part when I inspect the page
  localStorage.clear();

  upgrades.forEach((upgrade) => {
    const object = JSON.stringify({
      // converts a JavaScript object into a text string in JSON format. To store in local storage
      parsedLevel: parseFloat(upgrade.level.innerHTML),
      parsedCost: upgrade.parsedCost,
      parsedIncrease: upgrade.parsedIncrease,
    });
    localStorage.setItem(upgrade.name, object);
  });
  localStorage.setItem("dpc", JSON.stringify(dpc));
  localStorage.setItem("dps", JSON.stringify(dps));
  localStorage.setItem("darkmatter", JSON.stringify(parseddarkmatter));
}

function load() {
  upgrades.forEach((upgrade) => {
    const savedValues = JSON.parse(localStorage.getItem(upgrade.name));
    if (savedValues) {
      upgrade.parsedCost = savedValues.parsedCost;
      upgrade.parsedIncrease = savedValues.parsedIncrease;
      // Update DOM elements based on upgrade.name
      const levelElement = document.querySelector(`.${upgrade.name}-level`);
      const costElement = document.querySelector(`.${upgrade.name}-cost`);
      const nextPElement = document.querySelector(`.${upgrade.name}-next-p`);

      if (levelElement) {
        levelElement.innerHTML = savedValues.parsedLevel;
      }
      if (costElement) {
        costElement.innerHTML = Math.round(upgrade.parsedCost);
      }
      if (nextPElement) nextPElement.innerHTML = upgrade.parsedIncrease;
      upgrade.level.innerHTML = savedValues.parsedLevel;
      upgrade.cost.innerHTML = Math.round(upgrade.parsedCost);
      upgrade.increase.innerHTML = upgrade.parsedIncrease;
    }
  });

  dpc = JSON.parse(localStorage.getItem("dpc"));
  dps = JSON.parse(localStorage.getItem("dps"));
  parseddarkmatter = JSON.parse(localStorage.getItem("darkmatter"));
  if (parseddarkmatter) {
    // check if parseddarkmatter exist
    darkmatter.innerHTML = Math.round(parseddarkmatter);
  }
}

setInterval(() => {
  parseddarkmatter += dps / 10;
  darkmatter.innerHTML = Math.round(parseddarkmatter);
  dpcText.innerHTML = Math.round(dpc);
  dpsText.innerHTML = Math.round(dps);
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
  let orbitContainer = document.createElement("div");
  orbitContainer.classList.add("orbit-container");

  document
    .querySelector(".darkmatter-img-container")
    .appendChild(orbitContainer);

  for (let i = 0; i < numObjects; i++) {
    let orbitObject = document.createElement("div");
    orbitObject.classList.add("orbit-object");

    let size = Math.random() * 12 + 3; // Size between 3px and 15px
    let speed = Math.random() * 5 + 3; // Speed between 3s and 8s
    let distance = Math.random() * 100 + 50; // Distance between 50px and 150px
    let startAngle = Math.random() * 360; // Random starting position

    orbitObject.style.width = `${size}px`;
    orbitObject.style.height = `${size}px`;
    orbitObject.style.animation = `orbit-${i} ${speed}s linear infinite`;
    orbitObject.style.animationDelay = `${Math.random() * 2}s`; // Random start delay

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
  let rocketContainer = document.createElement("div"); // Creating a container
  rocketContainer.classList.add("rocket-container");

  let rocket = document.createElement("img"); // Main image (the rocket)
  let flame = document.createElement("img"); // Second image (flame under the rocket)

  rocket.classList.add("rocket");
  flame.classList.add("rocket-flame");

  let isRocket1 =
    document.querySelectorAll(".moving-rocket1").length <=
    document.querySelectorAll(".moving-rocket2").length;

  if (isRocket1) {
    rocket.src = "assets/images/rocket1.png";

    rocketContainer.classList.add("moving-rocket1");
  } else {
    rocket.src = "assets/images/rocket2.png";

    rocketContainer.classList.add("moving-rocket2");
  }

  rocketContainer.appendChild(rocket);

  // Random Y position between 20% and 70%
  let yPos = Math.random() * 50 + 20;
  rocketContainer.style.top = `${yPos}%`;

  document.body.appendChild(rocketContainer);

  setTimeout(() => {
    rocketContainer.remove();
  }, 5000);
}

// Launches a rocket every 7 seconds
setInterval(() => {
  const allShips = document.querySelectorAll(".rocket");
  const rocketLevel = document.querySelector(".rocket-level");

  if (allShips.length < Number(rocketLevel.innerHTML)) {
    launchRocket();
  }
}, 2000);

function launchPlanet() {
  let planetContainer = document.createElement("div"); // Creating a container
  planetContainer.classList.add("planet-container");

  let planet = document.createElement("img"); // Main image (the planet)
  let globe = document.createElement("img"); // Second image (globe under the planet)

  planet.classList.add("planet");
  globe.classList.add("planet-globe");

  let isplanet1 =
    document.querySelectorAll(".moving-planet1").length <=
    document.querySelectorAll(".moving-planet2").length;

  if (isplanet1) {
    planet.src = "assets/images/planet22.webp";

    planetContainer.classList.add("moving-planet1");
  } else {
    planet.src = "assets/images/planet44.webp";

    planetContainer.classList.add("moving-planet2");
  }

  planetContainer.appendChild(planet);

  
  let spawnSide = Math.random() < 0.5 ? "left" : "right"; // 50% chance of spawning left or right 
  let spawnX = spawnSide === "left" ? -100 : window.innerWidth + 100; // Spawn out of the screen 
  let spawnY = Math.random() * window.innerHeight * 0.6 + 20; // Position Y random

  planetContainer.style.position = "absolute";
  planetContainer.style.left = `${spawnX}px`;
  planetContainer.style.top = `${spawnY}px`;
  planetContainer.style.transform = "scale(1)"; // 
  
  let targetX = 310; // position center of the blackhole  
  let targetY = 350;

setTimeout(() => {
  
  // animation planet go in the blackhole
  planetContainer.style.transition = "transform 4s linear"; 
  planetContainer.style.transform = `translate(${targetX - spawnX}px, ${targetY - spawnY}px) scale(0.1)`; // down sizing the planet
}, 100);



  document.body.appendChild(planetContainer);

  
  setTimeout(() => {
    planetContainer.remove();
  }, 4000);
}

// Launches a rocket every 7 seconds
setInterval(() => {
  const allPlanets = document.querySelectorAll(".planet");
  const planetLevel = document.querySelector(".planet-level");

  if (allPlanets.length < Number(planetLevel.innerHTML)) {
    launchPlanet();
  }
}, 3000);

function createAspiratingParticles(event) {
  const particle = document.createElement("div");
  particle.classList.add("particle");

  // Position of the particle at the time of the click
  const x = event.offsetX;
  const y = event.offsetY;

  // Set custom CSS properties for initial position
  particle.style.setProperty("--x", `${x}px`);
  particle.style.setProperty("--y", `${y}px`);

  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;

  document.body.appendChild(particle);

  // Create the particle animation sucked towards the black hole
  particle.style.animation = "moveToCenter 1s forwards";

  setTimeout(() => {
    particle.remove();
  }, 1000);
}

// Adding the event listener for the click on the black hole
blackhole.addEventListener("click", createAspiratingParticles);

window.incrementdarkmatter = incrementdarkmatter;
window.buyUpgrade = buyUpgrade;
window.save = save;
window.load = load;
window.activateSingularityBoost = activateSingularityBoost;
window.activateSolarFlare = activateSolarFlare;
