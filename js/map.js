'use strict';

(function () {
  var element = document.querySelector('.map');

  // функция, переключающая состояние карты
  var toggle = function (isMapActive) {
    element.classList.toggle('map--faded', !isMapActive);

    // ранний возврат из функции для уменьшения количества уровней вложенности при отображении карты и пинов
    if (!isMapActive) {
      window.pin.removeAll();
      window.card.remove();
      window.pin.resetMainPosition();
      return;
    }

    var onSuccess = function (data) {
      window.pin.data = data;
      window.pin.renderAll(window.filters.getMaxPins(window.filters.filterValidOffers(data)));
      window.filters.toggle(true);
    };

    var onError = function () {
      window.modal.openError(window.modal.closeError);
    };

    window.filters.toggle(false);
    window.backend.loadPinData(onSuccess, onError);
  };

  var getWidth = function () {
    return element.getBoundingClientRect().width;
  };

  window.map = {
    toggle: toggle,
    getWidth: getWidth,
    element: element
  };
})();
