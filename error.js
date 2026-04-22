const errorWrap = document.getElementById('error-wrap');

window.onerror = function(message, source, lineno, colno, error) {
  console.error("Помилка:", message, "в файлі:", source);
  errorText(`
    <h3>Помилка:</h3>
    <p>${message}</p>
    <h3>В файлі:</h3>
    <p>${source}</p>
  `);
  return false;
};

window.onunhandledrejection = function(event) {
  console.error("Помилка в Промісі:", event.reason);
  errorText(`
    <h3>Помилка в Промісі:</h3>
    <p>${event.reason}</p>
  `);
};

function errorText(text) {
  errorWrap.classList.add('active');
  errorWrap.innerHTML = `
    <h1>Критична Помилка!!!</h1>
    <p>Спробуйте перезавантажити сайт.</p>
    <p>Якщо не допомогло, зв'яжіттся зі мною по <a href="https://t.me/Viktor_2352" target="_blank" rel="noopener noreferrer">Telegram</a> та опишіть проблему.</p>
    <br>
    <br>
    <h2>Для розробників:</h2>
    ${text}
  `;
}