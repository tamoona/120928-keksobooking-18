'use strict';

(function () {
  var mainElement = document.querySelector('main');
  var successModal = document.querySelector('#success');
  var errorModal = document.querySelector('#error');

  // закрытие окна ошибки
  var closeErrorModal = function () {
    window.removeEventListener('keydown', onErrorModalKeydown);
    window.utils.removeElement(mainElement.querySelector('.error'));
  };

  // обработчик события при нажатии клавиши для окна с ошибкой
  var onErrorModalKeydown = function (e) {
    if (e.keyCode === window.consts.ESC_KEY_NUMBER) {
      closeErrorModal();
    }
  };

  // открытие окна ошибки
  var openErrorModal = function (onResetButtonClick) {
    var errorModalTemplate = errorModal.content.cloneNode(true);
    var errorModalContent = errorModalTemplate.querySelector('.error');

    var onErrorModalClick = function (e) {
      if (e.target === errorModalContent) {
        closeErrorModal();
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
  var closeSuccessModal = function () {
    window.removeEventListener('keydown', onSuccessModalKeydown);
    window.utils.removeElement(mainElement.querySelector('.success'));
  };

  // обработчик события при нажатии клавиши для окна успеха
  var onSuccessModalKeydown = function (e) {
    if (e.keyCode === window.consts.ESC_KEY_NUMBER) {
      closeSuccessModal();
    }
  };

  // открытие окна успешного создания объявления
  var openSuccessModal = function () {
    var successModalTemplate = successModal.content.cloneNode(true);
    successModalTemplate.querySelector('.success').addEventListener('click', closeSuccessModal);
    window.addEventListener('keydown', onSuccessModalKeydown);
    mainElement.append(successModalTemplate);
  };

  window.modal = {
    closeErrorModal: closeErrorModal,
    openErrorModal: openErrorModal,
    closeSuccessModal: closeSuccessModal,
    openSuccessModal: openSuccessModal
  };
})();
