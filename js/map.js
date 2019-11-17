'use strict';

(function () {
  var mapElement = document.querySelector('.map');

  // функция, переключающая состояние карты
  var toggleMap = function (isMapActive) {
    mapElement.classList.toggle('map--faded', !isMapActive);

    // ранний возврат из функции для уменьшения количества уровней вложенности при отображении карты и пинов
    if (!isMapActive) {
      window.pin.removeMapPins();
      window.card.removeCard();
      window.pin.resetMainPinPosition();
      return;
    }

    var onSuccess = function (pinData) {
      window.pin.pinData = pinData;
      window.pin.renderMapPins(window.filters.getMaxPins(window.filters.filterValidOffers(pinData)));
      window.filters.toggleFilters(true);
    };

    var onError = function () {
      window.modal.openErrorModal(window.modal.closeErrorModal);
    };

    window.filters.toggleFilters(false);
    window.backend.loadPinData(onSuccess, onError);
  };

  var getMapWidth = function () {
    return mapElement.getBoundingClientRect().width;
  };

  window.map = {
    toggleMap: toggleMap,
    getMapWidth: getMapWidth,
    mapElement: mapElement
  };
})();
