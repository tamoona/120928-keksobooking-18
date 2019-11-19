'use strict';

(function () {
  var mainElement = document.querySelector('main');
  var successModal = document.querySelector('#success');
  var errorModal = document.querySelector('#error');

  // закрытие окна ошибки
  var closeError = function () {
    window.removeEventListener('keydown', onErrorModalKeydown);
    window.utils.removeElement(mainElement.querySelector('.error'));
  };

  // обработчик события при нажатии клавиши для окна с ошибкой
  var onErrorModalKeydown = function (e) {
    if (e.keyCode === window.consts.ESC_KEY_NUMBER) {
      closeError();
    }
  };

  // открытие окна ошибки
  var openError = function (onResetButtonClick) {
    var errorModalTemplate = errorModal.content.cloneNode(true);
    var errorModalContent = errorModalTemplate.querySelector('.error');

    var onErrorModalClick = function (e) {
      if (e.target === errorModalContent) {
        closeError();
      }
    };

    if (onResetButtonClick) {
      errorModalContent.querySelector('.error__button').addEventListener('click', onResetButtonClick);
    }

    errorModalContent.addEventListener('click', onErrorModalClick);
    window.addEventListener('keydown', onErrorModalKeydown);
    mainElement.append(errorModalContent);
  };

  // закрытие окна успешного создания объявления
  var closeSuccess = function () {
    window.removeEventListener('keydown', onSuccessModalKeydown);
    window.utils.removeElement(mainElement.querySelector('.success'));
  };

  // обработчик события при нажатии клавиши для окна успеха
  var onSuccessModalKeydown = function (e) {
    if (e.keyCode === window.consts.ESC_KEY_NUMBER) {
      closeSuccess();
    }
  };

  var onSuccessModalClose = function () {
    closeSuccess();
  };

  // открытие окна успешного создания объявления
  var openSuccess = function () {
    var successModalTemplate = successModal.content.cloneNode(true);
    successModalTemplate.querySelector('.success').addEventListener('click', onSuccessModalClose);
    window.addEventListener('keydown', onSuccessModalKeydown);
    mainElement.append(successModalTemplate);
  };

  window.modal = {
    closeError: closeError,
    openError: openError,
    closeSuccess: closeSuccess,
    openSuccess: openSuccess
  };
})();
