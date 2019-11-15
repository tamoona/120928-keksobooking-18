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
  var form = document.querySelector('.ad-form');
  var defaultAvatarUrl = 'img/muffin-grey.svg';

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
    if (roomNumber >= guestNumber) {
      if (roomNumber === NO_GUESTS_ROOM_NUMBER && guestNumber !== NO_GUESTS_NUMBER || roomNumber !== NO_GUESTS_ROOM_NUMBER && guestNumber === NO_GUESTS_NUMBER) {
        return false;
      }
      return true;
    } else {
      return false;
    }
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

  // функция, создающая элемент превью аватара
  var createPhotoPreview = function (src) {
    var imageContainer = document.createElement('div');
    var image = document.createElement('img');
    imageContainer.classList.add('ad-form__photo');
    image.src = src;
    image.style.width = '70px';
    image.style.height = '70px';
    image.style.objectFit = 'cover';
    imageContainer.append(image);
    return imageContainer;
  };

  // функция, удаляющая все фотографии, за исключением дефолтной фотографии
  var removePhotoPreviews = function () {
    var photoPreviewElements = document.querySelectorAll('.ad-form__photo');
    for (var i = 0; i < photoPreviewElements.length - 1; i++) {
      photoPreviewElements[i].remove();
    }
  };

  // функция, удаляющая превью аватарки
  var removeAvatarPreview = function () {
    document.querySelector('.ad-form-header__preview img').src = defaultAvatarUrl;
  };

  // функция, переключающая состояние формы
  window.resetForm = function () {
    form.reset();
    disableInvalidGuestValues();
    removePhotoPreviews();
    removeAvatarPreview();
  };

  // функция, переключающая состояние формы
  window.toggleForm = function (state) {
    form.classList.toggle('ad-form--disabled', !state);
    window.resetForm();
  };

  // обработчик события, отменяюший действия формы по умолчанию
  var onFormSubmit = function (e) {
    e.preventDefault();
    var formData = new FormData(e.target);
    var onSuccess = function () {
      window.resetForm();
      window.toggleMap(false);
      window.openSuccessModal();
    };
    var onError = function () {
      window.openErrorModal(window.closeErrorModal);
    };
    window.sendFormData(formData, onSuccess, onError);
  };

  // функция, переключающая активное состояние формы с фильтрами
  window.toggleFilters = function (state) {
    var filtersElements = document.querySelectorAll('.map__filters select, .map__filters fieldset');
    for (var i = 0; i < filtersElements.length; i++) {
      filtersElements[i].disabled = !state;
    }
  };

  // функция, переключающая состояния полей
  window.toggleFieldset = function (state) {
    var fieldsetElements = document.querySelectorAll('.ad-form fieldset');
    for (var i = 0; i < fieldsetElements.length; i++) {
      fieldsetElements[i].disabled = !state;
    }
  };

  // обработчик клика на нажатие кнопки 'очистить'
  var onResetButtonClick = function (e) {
    e.preventDefault();
    window.resetForm();
  };

  // функция, обрабатывающая превью аватарки
  var onAvatarPreview = function (e) {
    var preview = document.querySelector('.ad-form-header__preview img');
    var file = e.target.files[0];
    var reader = new FileReader();

    reader.addEventListener('load', function (readerEvt) {
      preview.src = readerEvt.target.result;
    });

    if (file && file.type.match('image')) {
      reader.readAsDataURL(file);
    } else {
      preview.src = defaultAvatarUrl;
    }
  };

  // функция, обрабатывающая превью аватарки
  var onPhotosPreview = function (e) {
    var files = e.target.files;
    removePhotoPreviews();

    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      if (!file.type.match('image')) {
        continue;
      }

      var reader = new FileReader();

      reader.addEventListener('load', function (readerEvt) {
        var photoContainer = document.querySelector('.ad-form__photo-container');
        var photoPlaceholder = document.querySelector('.ad-form__photo');
        photoContainer.insertBefore(createPhotoPreview(readerEvt.target.result), photoPlaceholder);
      });

      reader.readAsDataURL(file);
    }
  };

  setValidGuestValue();
  validateTitleInput(titleInput.value.length);
  validatePrice();
  disableAddress();

  document.querySelector('#room_number').addEventListener('change', disableInvalidGuestValues);
  document.querySelector('#capacity').addEventListener('change', disableInvalidGuestValues);
  form.addEventListener('submit', onFormSubmit);
  document.querySelector('.ad-form__reset').addEventListener('click', onResetButtonClick);
  document.querySelector('.ad-form-header__input').addEventListener('change', onAvatarPreview);
  document.querySelector('.ad-form__input').addEventListener('change', onPhotosPreview);
})();
