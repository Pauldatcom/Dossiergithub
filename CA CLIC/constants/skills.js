import { defaultSkillValues } from "./defaultValues.js";
 
 function createUpgrades() {
    const upgradesContainer = document.getElementById("upgrades-container")
    const template = document.getElementById("upgrade-template").textContent

    defaultSkillValues.forEach((obj) => {
        // console.log (object) 
        let html = template; // va contenir toute les info pour chaque upgrade avec des valeurs dynamiques
        

        Object.keys(obj).forEach((key) => {
            const regex = new RegExp(`{{${key}}}`, "g");
            html = html.replace(regex, obj[key])
      });

      upgradesContainer.innerHTML += html

    })
 }

 createUpgrades()