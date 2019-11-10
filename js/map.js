'use strict';

(function () {
  var PIN_NUMBER = 8;

  // функция, переключающая состояние карты
  window.toggleMap = function (state) {
    document.querySelector('.map').classList.toggle('map--faded', !state);

    if (state) {
      var pinData = window.getMockOffers(PIN_NUMBER);

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

        if (e.keyCode === 13 && pin.classList.contains('map__pin') && !pin.classList.contains('map__pin--main')) {
          window.openNewCard(pinData[pin.dataset.id]);
        }
      };

      window.removeElements(document.querySelectorAll('.map__pin:not(.map__pin--main)'));
      window.renderMapPins(pinData);

      document.querySelector('.map__pins').addEventListener('click', onPinClick);
      document.querySelector('.map__pins').addEventListener('keydown', onPinKeydown);
    } else {
      window.removeElements(document.querySelectorAll('.map__pin:not(.map__pin--main)'));
      window.removeElements(document.querySelectorAll('.map__card'));
    }
  };
})();
