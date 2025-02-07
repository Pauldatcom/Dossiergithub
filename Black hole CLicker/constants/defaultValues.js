export const defaultUpgradeValues = [
  {
    name: "clicker",
    image: "assets/blackhole.png",
    cost: 10,
    increase: 1,
    type: "upgrade",
  },
  {
    name: "rocket",
    image: "./assets/rocket.png",
    cost: 50,
    increase: 3,
    type: "upgrade",
  },
  {
    name: "satellite",
    image: "./assets/satellite.png",
    cost: 400,
    increase: 32,
    type: "upgrade",
  },
  {
    name: "planet",
    image: "./assets/planet.png",
    cost: 4000,
    increase: 400,
    type: "upgrade",
  },
  {
    name: "astronaut",
    image: "./assets/astronaut.png",
    cost: 10000,
    increase: 5000,
    type: "upgrade",
  },
];

export const defaultSkillValues = [
  {
    name: "Singularity Boost",
    description: "Double your clicking power for 30 seconds",
    image: "assets/skills/black-hole.png",
    cd: 600,
    cost: 1200,
    increase: 1,
    type: "skill",
  },
  {
    name: "Solar Flare",
    description: "gain 60 x dps worth  of darkmatter instantly",
    image: "assets/skills/solar-flare.png",
    cd: 900,
    cost: 480000,
    increase: 1,
    type: "skill",
  },
];

export const defaultArtifactValues = [
  {
    name: "Artifact 1",
    description: "Permanently increase all darkmatter gained by x amount",
    image: "assets/planet2.jpg",
    cost: 18000,
    increase: 1,
    type: "artifact",
  },
];
