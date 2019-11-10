'use strict';

(function () {
  // отключение поля «Адреса»
  var disableAddress = function () {
    document.querySelector('input[name="address"]').disabled = true;
  };

  // валидация для поля «Заголовок объявления»
  var titleInput = document.querySelector('input[name="title"]');
  var validateTitleInput = function (inputLength) {
    if (!inputLength || inputLength === 0) {
      titleInput.setCustomValidity('Обязательное поле');
    } else if (inputLength < 30) {
      titleInput.setCustomValidity('Минимальная длина заголовка — 30 символов');
    } else if (inputLength >= 100) {
      titleInput.setCustomValidity('Максимальная длина заголовка — 100 символов');
    } else {
      titleInput.setCustomValidity('');
    }
  };
  var onTitleInput = function (e) {
    validateTitleInput(e.target.value.length);
  };
  titleInput.addEventListener('input', onTitleInput);

  // валидация для полей «Тип жилья» и «Цена за ночь»
  var houseType = document.querySelector('select[name="type"]');
  var validatePrice = function () {
    var priceInput = document.querySelector('input[name="price"]');
    priceInput.required = true;

    if (houseType.value === 'bungalo') {
      priceInput.min = 0;
      priceInput.placeholder = 0;
    } else if (houseType.value === 'flat') {
      priceInput.min = 1000;
      priceInput.placeholder = 1000;
    } else if (houseType.value === 'house') {
      priceInput.min = 5000;
      priceInput.placeholder = 5000;
    } else if (houseType.value === 'palace') {
      priceInput.min = 10000;
      priceInput.placeholder = 10000;
    }
  };
  houseType.addEventListener('change', validatePrice);

  // валидация для полей «Время заезда» и «Время выезда» (синхронизированы)
  var checkInTime = document.querySelector('select[name="timein"]');
  var checkOutTime = document.querySelector('select[name="timeout"]');
  checkInTime.addEventListener('change', function () {
    checkOutTime.value = checkInTime.value;
  });
  checkOutTime.addEventListener('change', function () {
    checkInTime.value = checkOutTime.value;
  });

  // функция, которая проверяет валидность количества гостей по отношению к количеству комнат
  var isGuestNumberValid = function (roomNumber, guestNumber) {
    if (roomNumber >= guestNumber) {
      if (roomNumber === 100 && guestNumber !== 0 || roomNumber !== 100 && guestNumber === 0) {
        return false;
      }
      return true;
    } else {
      return false;
    }
  };

  // функция, которая возвращает корректное количество гостей в соотношении с количеством комнат
  var getValidGuestNumber = function (roomNumber, guestNumber) {
    if (roomNumber === 100) {
      return 0;
    } else if (roomNumber > 0 && guestNumber === 0 || guestNumber > roomNumber) {
      return roomNumber;
    } else {
      return guestNumber;
    }
  };

  // функция, устанавливающая значение по умолчанию
  var setValidGuestValue = function () {
    var roomField = document.querySelector('#room_number');
    var guestField = document.querySelector('#capacity');
    var selectedRoomTotal = parseInt(window.getSelectedValue(roomField), 10);
    var selectedGuestTotal = parseInt(window.getSelectedValue(guestField), 10);
    var guestTotal = getValidGuestNumber(selectedRoomTotal, selectedGuestTotal);
    window.setSelectValue(document.querySelector('#capacity'), guestTotal);
  };

  // функция, деактивирующая невалидное количество гостей
  var disableInvalidGuestValues = function () {
    var roomField = document.querySelector('#room_number');
    var roomNumber = parseInt(window.getSelectedValue(roomField), 10);
    var guestSelectOptions = document.querySelectorAll('#capacity option');

    for (var i = 0; i < guestSelectOptions.length; i++) {
      var guestSelectOption = guestSelectOptions[i];
      var guestSelectValue = parseInt(guestSelectOption.value, 10);
      guestSelectOption.disabled = !isGuestNumberValid(roomNumber, guestSelectValue);
    }

    setValidGuestValue();
  };

  // функция, переключающая активное состояние формы с фильтрами
  window.toggleFilters = function (state) {
    var filtersElements = document.querySelectorAll('.map__filters select, .map__filters fieldset');
    for (var i = 0; i < filtersElements.length; i++) {
      filtersElements[i].disabled = !state;
    }
  };

  // функция, переключающая состояние формы
  window.toggleForm = function (state) {
    document.querySelector('.ad-form').classList.toggle('ad-form--disabled', !state);
    disableInvalidGuestValues();
  };


  // функция, переключающая состояния полей
  window.toggleFieldset = function (state) {
    var fieldsetElements = document.querySelectorAll('.ad-form fieldset');
    for (var i = 0; i < fieldsetElements.length; i++) {
      fieldsetElements[i].disabled = !state;
    }
  };

  setValidGuestValue();
  validateTitleInput(titleInput.value.length);
  validatePrice();
  disableAddress();

  document.querySelector('#room_number').addEventListener('change', disableInvalidGuestValues);
  document.querySelector('#capacity').addEventListener('change', disableInvalidGuestValues);
})();
