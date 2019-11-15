'use strict';

(function () {
  var DEFAULT_SELECT_VALUE = 'any';
  var FILTER_FEATURES = 'features';
  var FILTER_HOUSING_TYPE = 'housing-type';
  var FILTER_HOUSING_PRICE = 'housing-price';
  var FILTER_HOUSING_ROOMS = 'housing-rooms';
  var FILTER_HOUSING_GUESTS = 'housing-guests';
  var HIGH_PRICE = 50000;
  var LOW_PRICE = 10000;

  // текущие выбранные фильтры
  var activeFilters = {
    'housing-type': DEFAULT_SELECT_VALUE,
    'housing-price': DEFAULT_SELECT_VALUE,
    'housing-rooms': DEFAULT_SELECT_VALUE,
    'housing-guests': DEFAULT_SELECT_VALUE,
    'features': [],
  };

  // функции фильтрации для фильтров
  var filterHandlers = {
    'housing-type': function (array) {
      var selectedValue = activeFilters[FILTER_HOUSING_TYPE];
      if (selectedValue === DEFAULT_SELECT_VALUE) {
        return array;
      }
      return array.filter(function (item) {
        var type = item.offer.type;
        return type === selectedValue;
      });
    },
    'housing-price': function (array) {
      var selectedValue = activeFilters[FILTER_HOUSING_PRICE];
      if (selectedValue === DEFAULT_SELECT_VALUE) {
        return array;
      }
      return array.filter(function (item) {
        var price = item.offer.price;
        if (selectedValue === 'middle') {
          return price >= LOW_PRICE && price <= HIGH_PRICE;
        } else if (selectedValue === 'low') {
          return price < LOW_PRICE;
        } else if (selectedValue === 'high') {
          return price > HIGH_PRICE;
        }
        return false;
      });
    },
    'housing-rooms': function (array) {
      var selectedValue = activeFilters[FILTER_HOUSING_ROOMS];
      if (selectedValue === DEFAULT_SELECT_VALUE) {
        return array;
      }
      return array.filter(function (item) {
        var rooms = item.offer.rooms;
        return rooms === parseInt(selectedValue, 10);
      });
    },
    'housing-guests': function (array) {
      var selectedValue = activeFilters[FILTER_HOUSING_GUESTS];
      if (selectedValue === DEFAULT_SELECT_VALUE) {
        return array;
      }
      return array.filter(function (item) {
        var guests = item.offer.guests;
        return guests === parseInt(selectedValue, 10);
      });
    },
    'features': function (array) {
      var selectedValue = activeFilters[FILTER_FEATURES];
      if (!selectedValue.length) {
        return array;
      }
      return array.filter(function (item) {
        return selectedValue.every(function (feature) {
          return item.offer.features.indexOf(feature) >= 0;
        });
      });
    }
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

  // функция, возвращающая массив значений выбранных чекбоксов
  var getCheckedBoxesValues = function (nodeList) {
    var selectedValues = [];

    nodeList.forEach(function (checkedFeature) {
      selectedValues.push(checkedFeature.value);
    });

    return selectedValues;
  };

  // функция, фильтрующая массив на основе выбранных пользователем фильтров
  var filterData = function (array) {
    var filteredData = array;

    for (var key in activeFilters) {
      if (!Object.prototype.hasOwnProperty.call(activeFilters, key)) {
        continue;
      }
      var handler = filterHandlers[key];
      filteredData = handler(filteredData);
    }

    return filteredData;
  };

  var onFilterChange = function (e) {
    var value = e.target.value;
    var selectedFilterType = e.target.name;
    activeFilters[selectedFilterType] = value;

    if (selectedFilterType === FILTER_FEATURES) {
      var checkboxesSelector = '.map__features [name="' + FILTER_FEATURES + '"]:checked';
      activeFilters[selectedFilterType] = getCheckedBoxesValues(document.querySelectorAll(checkboxesSelector));
    }

    var onSuccess = function (data) {
      var validPins = filterData(filterValidOffers(data));
      window.renderMapPins(getMaxPins(validPins));
    };

    window.removeCard();
    window.deactivateAllPins();
    window.loadPinData(onSuccess, window.openErrorModal);
  };

  document.querySelector('#housing-type').addEventListener('change', onFilterChange);
  document.querySelector('#housing-price').addEventListener('change', onFilterChange);
  document.querySelector('#housing-rooms').addEventListener('change', onFilterChange);
  document.querySelector('#housing-guests').addEventListener('change', onFilterChange);
  document.querySelector('#housing-features').addEventListener('change', onFilterChange);

  window.filters = {
    filterValidOffers: filterValidOffers,
    getMaxPins: getMaxPins
  };
})();
