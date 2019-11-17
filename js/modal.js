'use strict';

(function () {
  // закрытие окна ошибки
  var closeErrorModal = function () {
    window.utils.removeElement(document.querySelector('main .error'));
  };

  // открытие окна ошибки
  var openErrorModal = function (onResetButtonClick) {
    var errorModalTemplate = document.querySelector('#error').content.cloneNode(true);
    var errorModal = errorModalTemplate.querySelector('.error');
    var onErrorModalClick = function (e) {
      if (e.target === errorModal) {
        closeErrorModal();
      }
    };
    var onErrorModalKeydown = function (e) {
      if (e.keyCode === window.consts.ESC_KEY_NUMBER) {
        closeErrorModal();
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
  var closeSuccessModal = function () {
    window.utils.removeElement(document.querySelector('main .success'));
  };

  // открытие окна успешного создания объявления
  var openSuccessModal = function () {
    var successModalTemplate = document.querySelector('#success').content.cloneNode(true);
    successModalTemplate.querySelector('.success').addEventListener('click', closeSuccessModal);
    var onSuccessModalKeydown = function (e) {
      if (e.keyCode === window.consts.ESC_KEY_NUMBER) {
        closeSuccessModal();
      }
    };

    window.addEventListener('keydown', onSuccessModalKeydown);
    document.querySelector('main').append(successModalTemplate);
  };

  window.modal = {
    closeErrorModal: closeErrorModal,
    openErrorModal: openErrorModal,
    closeSuccessModal: closeSuccessModal,
    openSuccessModal: openSuccessModal
  };
})();
