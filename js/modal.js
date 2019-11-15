'use strict';

(function () {
  // закрытие окна ошибки
  window.closeErrorModal = function () {
    window.utils.removeElement(document.querySelector('main .error'));
  };

  // открытие окна ошибки
  window.openErrorModal = function (onResetButtonClick) {
    var errorModalTemplate = document.querySelector('#error').content.cloneNode(true);
    var errorModal = errorModalTemplate.querySelector('.error');
    var onErrorModalClick = function (e) {
      if (e.target === errorModal) {
        window.closeErrorModal();
      }
    };
    var onErrorModalKeydown = function (e) {
      if (e.keyCode === window.consts.ESC_KEY_NUMBER) {
        window.closeErrorModal();
      }
    };

    if (onResetButtonClick) {
      errorModalTemplate.querySelector('.error__button').addEventListener('click', onResetButtonClick);
    }

    errorModal.addEventListener('click', onErrorModalClick);
    window.addEventListener('keydown', onErrorModalKeydown);
    document.querySelector('main').append(errorModalTemplate);
  };

  // закрытие окна успешного создания объявления
  window.closeSuccessModal = function () {
    window.utils.removeElement(document.querySelector('main .success'));
  };

  // открытие окна успешного создания объявления
  window.openSuccessModal = function () {
    var successModalTemplate = document.querySelector('#success').content.cloneNode(true);
    successModalTemplate.querySelector('.success').addEventListener('click', window.closeSuccessModal);
    var onSuccessModalKeydown = function (e) {
      if (e.keyCode === window.consts.ESC_KEY_NUMBER) {
        window.closeSuccessModal();
      }
    };

    window.addEventListener('keydown', onSuccessModalKeydown);
    document.querySelector('main').append(successModalTemplate);
  };
})();
