// Ajout d'un launcher pour le jeu
window.onload = function() {
    const launcher = document.createElement('div');
    launcher.style.position = 'fixed';
    launcher.style.top = '0';
    launcher.style.left = '0';
    launcher.style.width = '100%';
    launcher.style.height = '100%';
    launcher.style.background = 'linear-gradient(135deg, #000000, #1f1f1f)';
    launcher.style.display = 'flex';
    launcher.style.flexDirection = 'column';
    launcher.style.alignItems = 'center';
    launcher.style.justifyContent = 'center';
    launcher.style.color = '#ffffff';
    launcher.innerHTML = `
      <h1>Fantastic Four Runner</h1>
      <p>Un jeu inspiré de l'univers Marvel Phase 6</p>
      <button id="startButton" style="padding: 10px 20px; font-size: 20px; margin-top: 20px; cursor: pointer;">Jouer</button>
    `;
    document.body.appendChild(launcher);
  
    document.getElementById('startButton').addEventListener('click', () => {
      launcher.remove();
      startGame();
    });
  };