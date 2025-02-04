import { defaultUpgradeValues } from "./defaultValues.js";
 
 function createUpgrades() {
    const upgradesContainer = document.getElementById("upgrades-container")
    const template = document.getElementById("upgrade-template").textContent

    defaultUpgradeValues.forEach((obj) => {
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

  export const upgrades = [
    {
        name: "clicker",
        cost: document.querySelector(".clicker-cost"),                   // style d'une Upgrade 
        parsedCost: parseFloat(document.querySelector(".clicker-cost").innerHTML),
        increase: document.querySelector(".clicker-increase"),
        parsedIncrease: parseFloat(document.querySelector(".clicker-increase").innerHTML),
        level: document.querySelector(".clicker-level"),
        powerUps: [
            {
                name: "2x clicker",
                description: "double your clicking power",
                multiplier: 2,
            },
            {
                name: "3x clicker",
                description: "triple your clicking power",
                multiplier: 3,
            },
            {
                name: "2x clicker",
                description: "double your clicking power",
                multiplier: 2,
            },

        ],
        power: 0, 
        darkmatterMultiplier: 1.05,
        costMultiplier: 1.3,
    },
    {
        name: "rocket",
        cost: document.querySelector(".rocket-cost"),
        parsedCost: parseFloat(document.querySelector(".rocket-cost").innerHTML),
        increase: document.querySelector(".rocket-increase"), 
        parsedIncrease: parseFloat(document.querySelector(".rocket-increase").innerHTML),
        level: document.querySelector(".rocket-level"),
        powerUps: [
            {
                name: "2x rocket",
                description: "double your rocket eficiency",
                multiplier: 2,
            },
            {
                name: "3x rocket",
                description: "triple your rocket efficiency",
                multiplier: 3,
            },
            {
                name: "2x rocket",
                description: "double your rocket efficiency",
                multiplier: 2,
            },

        ],
        power: 0, 
        darkmatterMultiplier: 1.03,
        costMultiplier: 1.115,
    },
    {
        name: "satellite",
        cost: document.querySelector(".satellite-cost"),
        parsedCost: parseFloat(document.querySelector(".satellite-cost").innerHTML),
        increase: document.querySelector(".satellite-increase"), 
        parsedIncrease: parseFloat(document.querySelector(".satellite-increase").innerHTML),
        level: document.querySelector(".satellite-level"),
        power: 0, 
        darkmatterMultiplier: 1.06,
        costMultiplier: 1.2,
    },
    {
        name: "planet",
        cost: document.querySelector(".planet-cost"),
        parsedCost: parseFloat(document.querySelector(".planet-cost").innerHTML),
        increase: document.querySelector(".planet-increase"), 
        parsedIncrease: parseFloat(document.querySelector(".planet-increase").innerHTML),
        level: document.querySelector(".planet-level"),
        power: 0, 
        darkmatterMultiplier: 1.08,
        costMultiplier: 1.3,
    },
    {
        name: "astronaut",
        cost: document.querySelector(".astronaut-cost"),
        parsedCost: parseFloat(document.querySelector(".astronaut-cost").innerHTML),
        increase: document.querySelector(".astronaut-increase"), 
        parsedIncrease: parseFloat(document.querySelector(".astronaut-increase").innerHTML),
        level: document.querySelector(".astronaut-level"),
        power: 0, 
        darkmatterMultiplier: 1.1,
        costMultiplier: 1.4,
    },
]


export const powerUpIntervals = [10, 20, 30, 40, 50, 60, 70, 80]