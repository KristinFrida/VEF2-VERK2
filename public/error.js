// Breytan til að greina hvort notandinn hafi reynt að senda formið
let submitted = false;

// Fall sem athugar gildin í reitunum og skilar lista af villum
const validateForm = () => {
  const errors = [];
  const errorList = document.getElementById('error-list');
  errorList.innerHTML = '';

  // Athuga spurningareitinn
  const questionField = document.getElementById('text');
  const questionValue = questionField.value.trim();
  const questionError = document.getElementById('text-error');
  if (questionValue.length < 10 || questionValue.length > 300) {
    questionError.classList.remove('hidden');
    questionField.classList.add('input-error');
    errors.push('Spurningin verður að vera á milli 10 og 300 stafa.');
  } else {
    questionError.classList.add('hidden');
    questionField.classList.remove('input-error');
  }
  

  // Athuga svarmöguleika
  for (let i = 1; i <= 4; i++) {
    const answerField = document.getElementById('option' + i);
    const answerValue = answerField.value.trim();
    const answerError = document.getElementById('option' + i + '-error');
    if (answerValue.length < 10 || answerValue.length > 300) {
      errors.push(`Svarmöguleiki ${i} verður að vera á milli 10 og 300 stafa.`);
      answerError.classList.remove('hidden');
      answerField.classList.add('input-error');
    } else {
      answerError.classList.add('hidden');
      answerField.classList.remove('input-error');
    }
  }

  // Athuga hvort rétt svar hafi verið valið
  const correctAnswerChecked = document.querySelector('input[name="rett_svar"]:checked');
  if (!correctAnswerChecked) {
    errors.push("Þú verður að velja rétt svar.");
  }

  return errors;
};

// Viðburðarhandler fyrir submit á forminu
document.getElementById('question-form').addEventListener('submit', function(event) {
  submitted = true;
  const errors = validateForm();
  if (errors.length > 0) {
    event.preventDefault();
    const errorBox = document.getElementById('error-box');
    const errorList = document.getElementById('error-list');
    errorBox.style.display = 'block';
    errors.forEach((error) => {
      const li = document.createElement('li');
      li.textContent = error;
      errorList.appendChild(li);
    });
  }
});

// Fall til að bæta við rauntímaviltun fyrir hvern reit
const addLiveValidation = (fieldId, errorId, min, max) => {
  const field = document.getElementById(fieldId);
  const errorMsg = document.getElementById(errorId);
  field.addEventListener('input', function() {
    if (!submitted) return;
    const value = field.value.trim();
    if (value.length >= min && value.length <= max) {
      errorMsg.classList.add('hidden');
      field.classList.remove('input-error');
    } else {
      errorMsg.classList.remove('hidden');
      field.classList.add('input-error');
    }
  });
};

addLiveValidation('text', 'text-error', 10, 300);
for (let i = 1; i <= 4; i++) {
  addLiveValidation('option' + i, 'option' + i + '-error', 10, 300);
}

document.getElementById('question-form').addEventListener('input', function() {
  if (!submitted) return;
  const errors = validateForm();
  const errorBox = document.getElementById('error-box');
  const errorList = document.getElementById('error-list');
  if (errors.length === 0) {
    errorBox.style.display = 'none';
    errorList.innerHTML = '';
  } else {
    errorBox.style.display = 'block';
    errorList.innerHTML = '';
    errors.forEach((error) => {
      const li = document.createElement('li');
      li.textContent = error;
      errorList.appendChild(li);
    });
  }
});
