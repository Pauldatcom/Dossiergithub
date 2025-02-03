// let darkmatter = document.querySelector(".darkmatter-cost");
// let parseddarkmatter = parseFloat(darkmatter.innerHTML);
import { powerUpIntervals, upgrades } from "./constants/upgrades.js";


// let clickercost = document.querySelector(".clicker-cost");
// let parsedclickercost = parseFloat(clickercost.innerHTML);
// let clickerlevel = document.querySelector(".clicker-level");
// let clickerincrease = document.querySelector(".clicker-increase");
// let parsedclickerincrease = parseFloat(clickerincrease.innerHTML);


// let rocketcost = document.querySelector(".rocket-cost");
// let parsedrocketcost = parseFloat(rocketcost.innerHTML);
// let rocketlevel = document.querySelector(".rocket-level");
// let rocketincrease = document.querySelector(".rocket-increase");
// let parsedrocketincrease = parseFloat(rocketincrease.innerHTML);


// let satellitecost = document.querySelector(".satellite-cost");
// let parsedsatellitecost = parseFloat(satellitecost.innerHTML);
// let satellitelevel = document.querySelector(".satellite-level");
// let satelliteincrease = document.querySelector(".satellite-increase");
// let parsedsatelliteincrease = parseFloat(satelliteincrease.innerHTML); 

// let gpcText = document.getElementById("gpc-text");
// let gpsText = document.getElementById("gps-text");

// let darkmatterImgContainer = document.querySelector('.darkmatter-img-container');


// let dpc = 1;

// let dps = 0;





// function incrementdarkmatter(event) {
//     darkmatter.innerHTML = Math.round(parseddarkmatter += dpc);

//     const x = event.offsetX;
//     const y = event.offsetY;

//     const div = document.createElement("div");
//     div.innerHTML = `+${Math.round(dpc)}`;
//     div.style.cssText = `color: white; position: absolute; left: ${x}px; top: ${y}px; font-size: 15px; pointer-events: none;`;
//     darkmatterImgContainer.appendChild(div);

//     div.classList.add('fade-up');
    
//     timeout(div)

// }

// const timeout = (div) => {
//     setTimeout(() => {
//         div.remove()
//     }, 800)
// }
 

// function buyclicker() {
//    if (parseddarkmatter >= parsedclickercost) {
//       darkmatter.innerHTML = Math.round(parseddarkmatter -= parsedclickercost); 

//       clickerlevel.innerHTML ++

//       parsedclickerincrease = parseFloat((parsedclickerincrease * 1.05).toFixed(2));
//       clickerincrease.innerHTML = parsedclickerincrease;
//       dpc += parsedclickerincrease;

//       parsedclickercost *= 1.3;
//       clickercost.innerHTML = Math.round(parsedclickercost);
 
//     }
// }


// function buyrocket() {
//     if (parseddarkmatter >= parsedrocketcost) {
//        darkmatter.innerHTML = Math.round(parseddarkmatter -= parsedrocketcost); 
 
//        rocketlevel.innerHTML ++
 
//        parsedrocketincrease = parseFloat((parsedrocketincrease * 1.2).toFixed(2));
//        rocketincrease.innerHTML = parsedrocketincrease;
//        dps += parsedrocketincrease;
 
//        parsedrocketcost *= 1.5;
//        rocketcost.innerHTML = Math.round(parsedrocketcost);
  
//      }
//  }

//  function buysatellite() {
//     if (parseddarkmatter >= parsedsatellitecost) {
//        darkmatter.innerHTML = Math.round(parseddarkmatter -= parsedsatellitecost); 
 
//        satellitelevel.innerHTML ++
 
//        parsedsatelliteincrease = parseFloat((parsedsatelliteincrease * 1.4).toFixed(2));
//        satelliteincrease.innerHTML = parsedsatelliteincrease;
//        dps += parsedsatelliteincrease;
 
//        parsedsatellitecost *= 1.7;
//        satellitecost.innerHTML = Math.round(parsedsatellitecost);
  
//       }  //PLUS BESOIN FUNCTION BUYUPGRADE CENTRALISE TOUT 
//   }

//  setInterval(() => {
//     parseddarkmatter += dps / 10;
//     darkmatter.innerHTML = Math.round(parseddarkmatter);
//     gpcText.innerHTML = Math.round(dpc);
//     gpsText.innerHTML = Math.round(dps);
//  }, 100);



// Version avant d'avoir trouver la solution pour le faire 1 fois, 


let darkmatter = document.querySelector(".darkmatter-cost");    // 
let parseddarkmatter = parseFloat(darkmatter.innerHTML) ;

let dpcText = document.getElementById("dpc-text");          // va cherche un élément par son ID 
let dpsText = document.getElementById("dps-text");

let darkmatterImgContainer = document.querySelector('.darkmatter-img-container');

let upgradesNavButton = document.getElementById("upgrades-nav-button")
let skillsNavButton = document.getElementById("skills-nav-button")

let dpc = 1;  // darkmatterperclic

let dps = 0;  // darkmatterpersecond 

const bgm = new Audio("assets/audio/bgm.mp3")   // bgm = backgroundmusic
bgm.volume = 0.1 





 function incrementdarkmatter(event) {     // fonction pour effet +1 le fade
    const clickingSound = new Audio("assets/audio/pop-sound-effect-197846.mp3")
    clickingSound.volume = 0.1
    clickingSound.play()
    
    darkmatter.innerHTML = Math.round(parseddarkmatter += dpc);

    const x = event.offsetX;            
    const y = event.offsetY;

    const div = document.createElement("div");
    div.innerHTML = `+${Math.round(dpc)}`;
    div.style.cssText = `color: white; position: absolute; left: ${x}px; top: ${y}px; font-size: 15px; pointer-events: none;`;   // pour le style, directement implementer dans le css 
    darkmatterImgContainer.appendChild(div);

    div.classList.add('fade-up');

    timeout(div)
}

    const timeout = (div) => { 
    setTimeout(() => {
        div.remove();
    }, 800);
}

function buyUpgrade(upgrade) {    // function qui généralise la création d'Upgrade. Réduit le nmbre de ligne 
    const matchedUpgrade = upgrades.find(u => u.name === upgrade);

    if (!matchedUpgrade) {
        console.error("Upgrade non trouvée :", upgrade);             // Pour trouver l'erreur si pb a la création d'une nouvelle Upgrade
        return;
    }

    const upgradeDiv = document.getElementById(`${matchedUpgrade.name}-upgrade`)
    const nextLevelDiv = document.getElementById(`${matchedUpgrade.name}-next-level`)
    const nextLevelP = document.getElementById(`${matchedUpgrade.name}-next-p`)

    if (parseddarkmatter >= matchedUpgrade.parsedCost) {
        const upgradeSound = new Audio("assets/audio/creepy-space-signal-213834.mp3")
        upgradeSound.volume = 0.1
        upgradeSound.play()
        
        darkmatter.innerHTML = Math.round(parseddarkmatter -= matchedUpgrade.parsedCost);

        let index = powerUpIntervals.indexOf(parseFloat(matchedUpgrade.level.innerHTML))

        if ( index !== -1) {
            upgradeDiv.style.cssText = `border-color: white`;
            nextLevelDiv.style.cssText = `background-color: #5A5959; font-weight: normal`;
            matchedUpgrade.cost.innerHTML = Math.round(matchedUpgrade.parsedCost *= matchedUpgrade.costMultiplier)

            if (matchedUpgrade.name === "clicker" ) {
                dpc *= matchedUpgrade.powerUps[index].mutiplier
                nextLevelP.innerHTML = `+${matchedUpgrade.parsedIncrease} darkmatter per click`
            } else {
                dps -= matchedUpgrade.powerUps[index].mutiplier
                dps += matchedUpgrade.power
                nextLevelP.innerHTML = `+${matchedUpgrade.parsedIncrease} darkmatter per second`
            }

        }

        matchedUpgrade.level.innerHTML ++  

        index = powerUpIntervals.indexOf(parseFloat(matchedUpgrade.level.innerHTML))   // parsefloat car dans le string donc va  cherche dans upgrades.js pour verifier 

        if (index !== -1 ) {
            upgradeDiv.style.cssText = `border-color: red`;
            nextLevelDiv.style.cssText = `background-color: #CC4500; font-weight: bold`;
            nextLevelP.innerText = matchedUpgrade.powerUps[index].description

            matchedUpgrade.cost.innerHTML = Math.round(matchedUpgrade.parsedCost * 2.5 * 1.004 ** parseFloat(matchedUpgrade.level.innerHTML))
        } else {
            matchedUpgrade.cost.innerHTML = Math.round(matchedUpgrade.parsedCost *= matchedUpgrade.costMultiplier);
            matchedUpgrade.parsedIncrease = parseFloat((matchedUpgrade.parsedIncrease * matchedUpgrade.darkmatterMultiplier).toFixed(2));           // tofixed pour avoir 2 chiffre après la virgule
     
         if (matchedUpgrade.name === "clicker" ) nextLevelP.innerHTML = `+${matchedUpgrade.parsedIncrease} darkmatter per click`
         else nextLevelP.innerHTML = `+${matchedUpgrade.parsedIncrease} darkmatter per second`
        }

        
        
        if (matchedUpgrade.name === "clicker" ) dpc += matchedUpgrade.parsedIncrease
        else {
            dps += matchedUpgrade.power
            matchedUpgrade.power += matchedUpgrade.parsedIncrease
            dps += matchedUpgrade.power
        }                                     
    }
}

    function save () {  //  fonctionne avec le local storage de la page qui est dans la partie application lorsque j'inspecte la page 
        localStorage.clear()

        upgrades.map((upgrade) => {

            const object = JSON.stringify({    // permet de convertir un objet JavaScript en une chaîne de texte au format JSON. Pour stocker dans le local storage 
                parsedLevel: parseFloat(upgrade.level.innerHTML),
                parsedCost: upgrade.parsedCost,
                parsedIncrease: upgrade.parsedIncrease,

            })

            // console.log(object)

            localStorage.setItem(upgrade.name, object)
            
        })

            localStorage.setItem("dpc", JSON.stringify(dpc))
            localStorage.setItem("dps", JSON.stringify(dps))
            localStorage.setItem("darkmatter", JSON.stringify(parseddarkmatter))

}

    function load () {
        upgrades.map((upgrade) => {
            const savedValues = JSON.parse(localStorage.getItem(upgrade.name))

           // console.log(upgrade.name, savedValues)
           upgrade.parsedCost = savedValues.parsedCost
           upgrade.parsedIncrease = savedValues.parsedCost

           upgrade.level.innerHTML = savedValues.parsedLevel
           upgrade.cost.innerHTML = Math.round(upgrade.parsedCost)
           upgrade.increase.innerHTML = upgrade.parsedIncrease
        })

        dpc = JSON.parse(localStorage.getItem("dpc"))
        dps = JSON.parse(localStorage.getItem("dps"))
        parseddarkmatter = JSON.parse(localStorage.getItem("darkmatter"))

        darkmatter.innerHTML = Math.round(parseddarkmatter)
}

setInterval(() => {
    parseddarkmatter += dps / 10;
    darkmatter.innerHTML = Math.round(parseddarkmatter);
    dpcText.innerHTML = Math.round(dpc);
    dpsText.innerHTML = Math.round(dps);
    //bgm.play()
}, 100);

skillsNavButton.addEventListener("click", function() {
    const upgradesContainer = document.querySelectorAll(".upgrade")

    upgradesContainer.forEach((container) => {
        if ( container.classList.contains("type-upgrade"))container.style.display = "none"
        else if ( container.classList.contains("type-skill"))container.style.display = "flex"  
    })
})

upgradesNavButton.addEventListener("click", function() {
    const upgradesContainer = document.querySelectorAll(".upgrade")

    upgradesContainer.forEach((container) => {
        if ( container.classList.contains("type-upgrade"))container.style.display = "flex"
        else if ( container.classList.contains("type-skill"))container.style.display = "none"  
    })
})




window.incrementdarkmatter = incrementdarkmatter
window.buyUpgrade = buyUpgrade
window.save = save 
window.load = load 

