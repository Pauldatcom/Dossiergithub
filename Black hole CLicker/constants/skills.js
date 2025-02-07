import { defaultSkillValues } from "./defaultValues.js";

// Function to initialize skills
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

  // Check if enough dark matter
  if (parseddarkmatter >= skill.cost) {
    // Réduire le dark matter
    parseddarkmatter -= skill.cost;
    darkmatter.innerHTML = Math.round(parseddarkmatter);

    // Double the clicking power
    const originalDpc = dpc;
    dpc *= 2;

    // Sound or visual effect
    const skillSound = new Audio(
      "assets/audio/deep-cinematic-ballad_37sec-178305.mp3"
    );
    skillSound.volume = 0.1;
    skillSound.play();

    // Disable boost after 30 seconds
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

// Check if enough dark matter
  if (parseddarkmatter >= skill.cost) {
    // Réduire le dark matter
    parseddarkmatter -= skill.cost;
    darkmatter.innerHTML = Math.round(parseddarkmatter);
    

    // Gain de dark matter (600 x dps)
    const darkMatterGain = 60 * dps;
    parseddarkmatter += darkMatterGain;
    darkmatter.innerHTML = Math.round(parseddarkmatter);

    

  
    const skillSound = new Audio(
      "assets/audio/galactic-space-journey-279437.mp3"
    );
    skillSound.volume = 0.1;
    skillSound.play();
    
    

    // Cooldown management (to be implemented later if necessary)
  } else {
    alert("Pas assez de dark matter pour activer ce skill !");
  }

  
  return parseddarkmatter;
}


// Initialize skills on loading
window.addEventListener("DOMContentLoaded", initSkills);

// Export functions if necessary
export { activateSingularityBoost, activateSolarFlare };

function createUpgrades() {
  const upgradesContainer = document.getElementById("upgrades-container");
  const template = document.getElementById("upgrade-template").textContent;

  defaultSkillValues.forEach((obj) => {
    
    let html = template; 

    Object.keys(obj).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      html = html.replace(regex, obj[key]);
    });

    upgradesContainer.innerHTML += html;
  });
}

createUpgrades();
