document.addEventListener('DOMContentLoaded', () => {
  const svarTakkar = document.querySelectorAll('.svar-takki');
  /**
   * Loop through the svar-takki elements and add a click event listener to each one.
   * When a svar-takki is clicked, check if it's the correct answer and display a feedback message.
   */
  svarTakkar.forEach((takki) => {
    takki.addEventListener('click', () => {
      const erRett = takki.dataset.correct === 'true';
      const spurningElement = takki.closest('.spurning');

      let skilaboð = spurningElement.querySelector('.feedback');
      if (!skilaboð) {
        skilaboð = document.createElement('p');
        skilaboð.classList.add('feedback');
        spurningElement.appendChild(skilaboð);
      }
      skilaboð.textContent = erRett ? 'Rétt svar' : 'Rangt svar, reyndu aftur';
      skilaboð.style.color = erRett ? 'green' : 'red';

      skilaboð.classList.remove('correct', 'incorrect');
      skilaboð.classList.add(erRett ? 'correct' : 'incorrect');
    });
  });
});
