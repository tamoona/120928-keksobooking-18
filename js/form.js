'use strict';

(function () {
  var NO_GUESTS_ROOM_NUMBER = 100;
  var NO_GUESTS_NUMBER = 0;
  var MIN_TITLE_CHAR = 30;
  var MAX_TITLE_CHAR = 100;
  var BUNGALO_PRICE = 0;
  var FLAT_PRICE = 1000;
  var HOUSE_PRICE = 5000;
  var PALACE_PRICE = 10000;
  var PRICE_MAX = 1000000;
  var form = document.querySelector('.ad-form');

  // отключение поля «Адреса»
  var disableAddress = function () {
    document.querySelector('input[name="address"]').readOnly = true;
  };

  // валидация для поля «Заголовок объявления»
  var titleInput = document.querySelector('input[name="title"]');
  var validateTitleInput = function (inputLength) {
    if (!inputLength || inputLength === 0) {
      titleInput.setCustomValidity('Обязательное поле');
    } else if (inputLength < MIN_TITLE_CHAR) {
      titleInput.setCustomValidity('Минимальная длина заголовка — 30 символов');
    } else if (inputLength >= MAX_TITLE_CHAR) {
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
    priceInput.max = PRICE_MAX;

    switch (houseType.value) {
      case 'bungalo':
        priceInput.min = BUNGALO_PRICE;
        priceInput.placeholder = BUNGALO_PRICE;
        break;
      case 'flat':
        priceInput.min = FLAT_PRICE;
        priceInput.placeholder = FLAT_PRICE;
        break;
      case 'house':
        priceInput.min = HOUSE_PRICE;
        priceInput.placeholder = HOUSE_PRICE;
        break;
      case 'palace':
        priceInput.min = PALACE_PRICE;
        priceInput.placeholder = PALACE_PRICE;
        break;
    }
  };
  houseType.addEventListener('change', validatePrice);

  // валидация для полей «Время заезда» и «Время выезда» (синхронизированы)
  var timeFieldset = document.querySelector('.ad-form__element--time');
  var toggleTime = function (e) {
    var checkInTime = document.querySelector('select[name="timein"]');
    var checkOutTime = document.querySelector('select[name="timeout"]');

    if (e.target === checkInTime) {
      checkOutTime.value = checkInTime.value;
    } else {
      checkInTime.value = checkOutTime.value;
    }
  };
  timeFieldset.addEventListener('change', toggleTime);

  // функция, которая проверяет валидность количества гостей по отношению к количеству комнат
  var isGuestNumberValid = function (roomNumber, guestNumber) {
    return roomNumber >= guestNumber && !(roomNumber === NO_GUESTS_ROOM_NUMBER && guestNumber !== NO_GUESTS_NUMBER || roomNumber !== NO_GUESTS_ROOM_NUMBER && guestNumber === NO_GUESTS_NUMBER);
  };

  // функция, которая возвращает корректное количество гостей в соотношении с количеством комнат
  var getValidGuestNumber = function (roomNumber, guestNumber) {
    if (roomNumber === NO_GUESTS_ROOM_NUMBER) {
      return NO_GUESTS_NUMBER;
    } else if (roomNumber > NO_GUESTS_NUMBER && guestNumber === NO_GUESTS_NUMBER || guestNumber > roomNumber) {
      return roomNumber;
    } else {
      return guestNumber;
    }
  };

  // функция, устанавливающая значение по умолчанию
  var setValidGuestValue = function () {
    var roomField = document.querySelector('#room_number');
    var guestField = document.querySelector('#capacity');
    var selectedRoomTotal = parseInt(window.utils.getSelectedValue(roomField), 10);
    var selectedGuestTotal = parseInt(window.utils.getSelectedValue(guestField), 10);
    var guestTotal = getValidGuestNumber(selectedRoomTotal, selectedGuestTotal);
    window.utils.setSelectValue(document.querySelector('#capacity'), guestTotal);
  };

  // функция, деактивирующая невалидное количество гостей
  var disableInvalidGuestValues = function () {
    var roomField = document.querySelector('#room_number');
    var roomNumber = parseInt(window.utils.getSelectedValue(roomField), 10);
    var guestSelectOptions = document.querySelectorAll('#capacity option');

    for (var i = 0; i < guestSelectOptions.length; i++) {
      var guestSelectOption = guestSelectOptions[i];
      var guestSelectValue = parseInt(guestSelectOption.value, 10);
      guestSelectOption.disabled = !isGuestNumberValid(roomNumber, guestSelectValue);
    }

    setValidGuestValue();
  };

  // функция, переключающая состояние формы
  window.resetForm = function () {
    form.reset();
    disableInvalidGuestValues();
  };

  // функция, переключающая состояние формы
  window.toggleForm = function (isFormActive) {
    form.classList.toggle('ad-form--disabled', !isFormActive);
    window.resetForm();
  };

  // обработчик события, отменяюший действия формы по умолчанию
  var onFormSubmit = function (e) {
    e.preventDefault();
    var formData = new FormData(e.target);
    var onSuccess = function () {
      window.openSuccessModal();
      window.togglePage(false);
    };
    var onError = function () {
      window.openErrorModal(window.closeErrorModal);
    };
    window.sendFormData(formData, onSuccess, onError);
  };

  // функция, переключающая состояния полей
  window.toggleFieldset = function (isFieldsetActive) {
    var fieldsetElements = document.querySelectorAll('.ad-form fieldset');
    for (var i = 0; i < fieldsetElements.length; i++) {
      fieldsetElements[i].disabled = !isFieldsetActive;
    }
  };

  // обработчик клика на нажатие кнопки 'очистить'
  var onResetButtonClick = function (e) {
    e.preventDefault();
    window.togglePage(false);
  };

  setValidGuestValue();
  validateTitleInput(titleInput.value.length);
  validatePrice();
  disableAddress();

  document.querySelector('#room_number').addEventListener('change', disableInvalidGuestValues);
  document.querySelector('#capacity').addEventListener('change', disableInvalidGuestValues);
  form.addEventListener('submit', onFormSubmit);
  document.querySelector('.ad-form__reset').addEventListener('click', onResetButtonClick);
})();
