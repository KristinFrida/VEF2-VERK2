/**
 * Dæmi um lausn þar sem svarmöguleika er smellt og maður fær "Rétt svar" eða "Rangt svar"
 */

// Þetta keyrir þegar DOM er tilbúinn
document.addEventListener('DOMContentLoaded', () => {
  // Sækjum alla takka sem hafa klasa "svar-takki"
  const svarTakkar = document.querySelectorAll('.svar-takki');

  svarTakkar.forEach((takki) => {
    takki.addEventListener('click', () => {
      // Athugum hvort þetta svar er rétt
      const erRett = takki.dataset.correct === 'true';

      // Finnum "spurning" blokkin sem takki tilheyrir
      const spurningElement = takki.closest('.spurning');

      // Finnum (eða búum til) <p class="feedback"> til að birta skilaboð
      let skilaboð = spurningElement.querySelector('.feedback');
      if (!skilaboð) {
        skilaboð = document.createElement('p');
        skilaboð.classList.add('feedback');
        spurningElement.appendChild(skilaboð);
      }

      skilaboð.textContent = erRett
        ? 'Rétt svar!'
        : 'Rangt svar, reyndu aftur!';

      // Ef þú vilt gera það skýrt (litir, stílar) geturðu bætt við klösum
      skilaboð.classList.remove('correct', 'incorrect');
      skilaboð.classList.add(erRett ? 'correct' : 'incorrect');
    });
  });
});
