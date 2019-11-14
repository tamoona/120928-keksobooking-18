'use strict';

(function () {
  // открытие окна ошибки
  window.closeErrorModal = function () {
    window.utils.removeElement(document.querySelector('main .error'));
  };

  // закрытие окна ошибки
  window.openErrorModal = function (onResetButtonClick) {
    var errorModalTemplate = document.querySelector('#error').content.cloneNode(true);
    errorModalTemplate.querySelector('.error__button').addEventListener('click', onResetButtonClick);
    document.querySelector('main').append(errorModalTemplate);
  };
})();
