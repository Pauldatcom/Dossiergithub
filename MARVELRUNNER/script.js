document.addEventListener("DOMContentLoaded", () => {
  const themeSound = document.getElementById("theme-song");
  const slots = document.querySelectorAll(".character-slot");
  const featuredCharacter = document.querySelector(".featured-character");
  const featuredImage = featuredCharacter.querySelector("img");
  let isCharacterShown = false;

  slots.forEach((slot) => {
    slot.addEventListener("click", () => {
      const characterImage = slot.getAttribute("data-image");

      // Changer l'image du personnage sélectionné
      featuredImage.src = characterImage;

      // // Gérer la musique
      // if (themeSound.paused) {
      //   themeSound.play();
      // } else {
      //   themeSound.pause();
      //   themeSound.currentTime = 0;
      // }

      // Afficher/masquer le personnage à droite
      if (!isCharacterShown) {
        featuredCharacter.classList.add("active");
        isCharacterShown = true;
      } else {
        featuredCharacter.classList.remove("active");
        isCharacterShown = false;
      }
    });
  });
});

// setTimeout(() => {
//   window.location.href = "jeu.html"; // Redirection vers la page du jeu
// }, 1000)