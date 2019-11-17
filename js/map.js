'use strict';

(function () {
  // функция, переключающая состояние карты
  var toggleMap = function (isMapActive) {
    document.querySelector('.map').classList.toggle('map--faded', !isMapActive);

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

  window.map = {
    toggleMap: toggleMap
  };
})();
