'use strict';

(function () {
  var ENTER_KEY_NUMBER = 13;

  // функция, переключающая состояние карты
  window.toggleMap = function (state) {
    document.querySelector('.map').classList.toggle('map--faded', !state);

    // ранний возврат из функции для уменьшения количества уровней вложенности при отображении карты и пинов
    if (!state) {
      window.utils.removeElements(document.querySelectorAll('.map__pin:not(.map__pin--main)'));
      window.utils.removeElements(document.querySelectorAll('.map__card'));
      return;
    }

    var onSuccess = function (pinData) {
      // обработчик, благодаря которому пользователь может открыть карточку любого доступного объявления
      var onPinClick = function (e) {
        e.preventDefault();
        var pin = e.target.parentNode;

        if (pin.classList.contains('map__pin') && !pin.classList.contains('map__pin--main')) {
          window.openNewCard(pinData[pin.dataset.id]);
        }
      };

      // обработчик открытия карточки объявления с клавиатуры, карточка объявления для выбранного пина открывается при нажатии на клавишу Enter
      var onPinKeydown = function (e) {
        var pin = e.target;

        if (e.keyCode === ENTER_KEY_NUMBER && pin.classList.contains('map__pin') && !pin.classList.contains('map__pin--main')) {
          window.openNewCard(pinData[pin.dataset.id]);
        }
      };

      window.utils.removeElements(document.querySelectorAll('.map__pin:not(.map__pin--main)'));
      window.renderMapPins(pinData);

      document.querySelector('.map__pins').addEventListener('click', onPinClick);
      document.querySelector('.map__pins').addEventListener('keydown', onPinKeydown);
    };

    var onError = function () {
      window.openErrorModal(window.closeErrorModal);
    };

    window.loadPinData(onSuccess, onError);
  };
})();
