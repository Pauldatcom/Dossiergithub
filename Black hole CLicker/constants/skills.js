import { defaultSkillValues } from "./defaultValues.js";

// Fonction pour initialiser les skills
function initSkills() {
  defaultSkillValues.forEach((skill) => {
    const skillElement = document.querySelector(
      `[data-skill-name="${skill.name}"]`
    );
    if (skillElement) {
      skillElement.addEventListener("click", () => {
        switch (skill.name) {
          case "Singularity Boost":
            activateSingularityBoost();
            break;
          case "Solar Flare":
            activateSolarFlare();
            break;
        }
      });
    }
  });
}

// Skill 1 : Singularity Boost
function activateSingularityBoost(parseddarkmatter, darkmatter, dpc) {
  const skill = defaultSkillValues.find((s) => s.name === "Singularity Boost");

  // Vérifier si assez de dark matter
  if (parseddarkmatter >= skill.cost) {
    // Réduire le dark matter
    parseddarkmatter -= skill.cost;
    darkmatter.innerHTML = Math.round(parseddarkmatter);

    // Double le clicking power
    const originalDpc = dpc;
    dpc *= 2;

    // Son ou effet visuel
    const skillSound = new Audio(
      "assets/audio/deep-cinematic-ballad_37sec-178305.mp3"
    );
    skillSound.volume = 0.1;
    skillSound.play();

    // Désactiver le boost après 30 secondes
    setTimeout(() => {
      dpc = originalDpc;
      console.log("Singularity Boost terminé");
    }, 30000);
  }
  return parseddarkmatter;
}

// Skill 2 : Solar Flare
function activateSolarFlare(parseddarkmatter, darkmatter, dps) {
  const skill = defaultSkillValues.find((s) => s.name === "Solar Flare");

  // Vérifier si assez de dark matter
  if (parseddarkmatter >= skill.cost) {
    // Réduire le dark matter
    parseddarkmatter -= skill.cost;
    darkmatter.innerHTML = Math.round(parseddarkmatter);
    

    // Gain de dark matter (600 x dps)
    const darkMatterGain = 60 * dps;
    parseddarkmatter += darkMatterGain;
    darkmatter.innerHTML = Math.round(parseddarkmatter);

    

    // Son ou effet visuel
    const skillSound = new Audio(
      "assets/audio/galactic-space-journey-279437.mp3"
    );
    skillSound.volume = 0.1;
    skillSound.play();
    
    

    // Gestion du cooldown (à implémenter plus tard si nécessaire)
  } else {
    alert("Pas assez de dark matter pour activer ce skill !");
  }

  
  return parseddarkmatter;
}

// Initialiser les skills au chargement
window.addEventListener("DOMContentLoaded", initSkills);

// Exporter les fonctions si nécessaire
export { activateSingularityBoost, activateSolarFlare };

function createUpgrades() {
  const upgradesContainer = document.getElementById("upgrades-container");
  const template = document.getElementById("upgrade-template").textContent;

  defaultSkillValues.forEach((obj) => {
    // console.log (object)
    let html = template; // va contenir toute les info pour chaque upgrade avec des valeurs dynamiques

    Object.keys(obj).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      html = html.replace(regex, obj[key]);
    });

    upgradesContainer.innerHTML += html;
  });
}

createUpgrades();
