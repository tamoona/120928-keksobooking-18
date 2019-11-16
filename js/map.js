'use strict';

(function () {
  // функция, переключающая состояние карты
  window.toggleMap = function (isMapActive) {
    document.querySelector('.map').classList.toggle('map--faded', !isMapActive);

    // ранний возврат из функции для уменьшения количества уровней вложенности при отображении карты и пинов
    if (!isMapActive) {
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
