'use strict';

(function () {
  var DEFAULT_SELECT_VALUE = 'any';
  // текущие выбранные фильтры
  var activeFilters = {
    'housing-type': DEFAULT_SELECT_VALUE,
    'housing-price': DEFAULT_SELECT_VALUE,
    'housing-rooms': DEFAULT_SELECT_VALUE,
    'housing-guests': DEFAULT_SELECT_VALUE,
    'housing-features': [],
  };

  // функция, возвращающая объявления с полем 'offer'
  var filterValidOffers = function (array) {
    return array.filter(function (item) {
      return Boolean(item.offer);
    });
  };

  // функция, возвращающая первые несколько элементов массива на основе константы
  var getMaxPins = function (array) {
    return array.slice(0, window.consts.PINS_MAX);
  };

  document.querySelector('#housing-type').addEventListener('change', function (e) {
    var value = e.target.value;
    activeFilters[e.target.name] = value;
    var onSuccess = function (data) {
      var validPins = filterValidOffers(data);
      if (value !== DEFAULT_SELECT_VALUE) {
        validPins = validPins.filter(function (item) {
          return item.offer.type === value;
        });
      }
      window.renderMapPins(getMaxPins(validPins));
    };

    window.loadPinData(onSuccess, window.openErrorModal);
  });

  window.filters = {
    filterValidOffers: filterValidOffers,
    getMaxPins: getMaxPins
  };
})();
