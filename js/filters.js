'use strict';

(function () {
  var HIGH_PRICE = 50000;
  var LOW_PRICE = 10000;
  var DEBOUNCE_DELAY = 500;
  var defaultSelectValue = 'any';
  var filterFeatures = 'features';
  var filterHousingType = 'housing-type';
  var filterHousingPrice = 'housing-price';
  var filterHousingRooms = 'housing-rooms';
  var filterHousingGuests = 'housing-guests';
  var filterElements = document.querySelectorAll('.map__filters select, .map__filters fieldset');
  var housingTypeFilter = document.querySelector('#housing-type');
  var priceFilter = document.querySelector('#housing-price');
  var roomFilter = document.querySelector('#housing-rooms');
  var guestFilter = document.querySelector('#housing-guests');
  var featureFilter = document.querySelector('#housing-features');
  var optimizedRender = window.utils.debounce(function (data) {
    window.pin.renderAll(getMaxPins(filterData(filterValidOffers(data))));
  }, DEBOUNCE_DELAY);

  // функция, возвращающая первоначальное состояние фильтров
  var getDefaultFilters = function () {
    return {
      'housing-type': defaultSelectValue,
      'housing-price': defaultSelectValue,
      'housing-rooms': defaultSelectValue,
      'housing-guests': defaultSelectValue,
      'features': [],
    };
  };

  // текущие выбранные фильтры
  var activeFilters = getDefaultFilters();

  // функция, сбрасывающая состояние фильтра-селектбокса
  var resetSelectFilter = function (element) {
    window.utils.setFieldValue(element, defaultSelectValue);
  };

  // функция, сбрасывающая состояние фильтра, состоящего из чекбоксов
  var resetCheckboxFilter = function (nodeList) {
    nodeList.forEach(function (element) {
      element.checked = false;
    });
  };

  // функция, сбрасывающая состояние всех фильтров
  var resetAll = function () {
    activeFilters = getDefaultFilters();
    for (var key in activeFilters) {
      if (!Object.prototype.hasOwnProperty.call(activeFilters, key)) {
        continue;
      }
      if (key === filterFeatures) {
        resetCheckboxFilter(featureFilter.querySelectorAll('.map__checkbox:checked'));
      } else {
        var selector = '[name="' + key + '"]';
        resetSelectFilter(document.querySelector(selector));
      }
    }
  };

  // функция, переключающая активное состояние формы с фильтрами
  var toggle = function (areFiltersActive) {
    filterElements.forEach(function (filterElement) {
      filterElement.disabled = !areFiltersActive;
    });
  };

  // функция, фильтрующая массив по выбранному пользователем типу жилья
  var filterByHousingType = function (array) {
    var selectedValue = activeFilters[filterHousingType];
    if (selectedValue === defaultSelectValue) {
      return array;
    }
    return array.filter(function (item) {
      var type = item.offer.type;
      return type === selectedValue;
    });
  };

  // функция, фильтрующая массив по выбранной пользователем стоимости типа жилья
  var filterByHousingPrice = function (array) {
    var selectedValue = activeFilters[filterHousingPrice];
    if (selectedValue === defaultSelectValue) {
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
  };

  // функция, фильтрующая массив по выбранному пользователем количетсву комнат
  var filterByHousingRooms = function (array) {
    var selectedValue = activeFilters[filterHousingRooms];
    if (selectedValue === defaultSelectValue) {
      return array;
    }
    return array.filter(function (item) {
      var rooms = item.offer.rooms;
      return rooms === parseInt(selectedValue, 10);
    });
  };

  // функция, фильтрующая массив по выбранному пользователем количеству гостей
  var filterByHousingGuests = function (array) {
    var selectedValue = activeFilters[filterHousingGuests];
    if (selectedValue === defaultSelectValue) {
      return array;
    }
    return array.filter(function (item) {
      var guests = item.offer.guests;
      return guests === parseInt(selectedValue, 10);
    });
  };

  // функция, фильтрующая массив по преимуществам, выбранных пользователем
  var filterByFeatures = function (array) {
    var selectedValue = activeFilters[filterFeatures];
    if (!selectedValue.length) {
      return array;
    }
    return array.filter(function (item) {
      return selectedValue.every(function (feature) {
        return item.offer.features.indexOf(feature) >= 0;
      });
    });
  };

  // функции фильтрации для фильтров
  var filterHandlers = {
    'housing-type': filterByHousingType,
    'housing-price': filterByHousingPrice,
    'housing-rooms': filterByHousingRooms,
    'housing-guests': filterByHousingGuests,
    'features': filterByFeatures
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

    if (selectedFilterType === filterFeatures) {
      var checkboxesSelector = '.map__features [name="' + filterFeatures + '"]:checked';
      activeFilters[selectedFilterType] = getCheckedBoxesValues(document.querySelectorAll(checkboxesSelector));
    }

    optimizedRender(window.pin.data);
    window.card.remove();
    window.pin.deactivateAll();
  };

  housingTypeFilter.addEventListener('change', onFilterChange);
  priceFilter.addEventListener('change', onFilterChange);
  roomFilter.addEventListener('change', onFilterChange);
  guestFilter.addEventListener('change', onFilterChange);
  featureFilter.addEventListener('change', onFilterChange);

  window.filters = {
    filterValidOffers: filterValidOffers,
    getMaxPins: getMaxPins,
    resetAll: resetAll,
    toggle: toggle
  };
})();
