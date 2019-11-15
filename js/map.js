'use strict';

(function () {
  // функция, переключающая состояние карты
  window.toggleMap = function (state) {
    document.querySelector('.map').classList.toggle('map--faded', !state);

    // ранний возврат из функции для уменьшения количества уровней вложенности при отображении карты и пинов
    if (!state) {
      window.removeMapPins();
      window.removeCard();
      window.resetMainPinPosition();
      return;
    }

    var onSuccess = function (pinData) {
      window.renderMapPins(window.filters.getMaxPins(window.filters.filterValidOffers(pinData)));
    };

    var onError = function () {
      window.openErrorModal(window.closeErrorModal);
    };

    window.loadPinData(onSuccess, onError);
  };
})();
