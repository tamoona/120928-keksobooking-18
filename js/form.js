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
  var defaultAvatarUrl = 'img/muffin-grey.svg';
  var form = document.querySelector('.ad-form');
  var titleInput = form.querySelector('#title');
  var addressField = form.querySelector('#address');
  var priceInput = form.querySelector('#price');
  var houseType = form.querySelector('#type');
  var timeFieldset = form.querySelector('.ad-form__element--time');
  var checkInTime = timeFieldset.querySelector('#timein');
  var checkOutTime = timeFieldset.querySelector('#timeout');
  var roomField = form.querySelector('#room_number');
  var guestField = form.querySelector('#capacity');
  var avatarField = form.querySelector('#avatar');
  var photoField = form.querySelector('#images');
  var previewImg = form.querySelector('.ad-form-header__preview img');
  var photoContainer = form.querySelector('.ad-form__photo-container');
  var resetButton = form.querySelector('.ad-form__reset');

  // отключение поля «Адреса»
  var disableAddress = function () {
    addressField.readOnly = true;
  };

  // добавить границу элементу, который сгенерировал событие
  var onFieldInvalid = function (e) {
    setCustomBorder(e.target);
  };

  // удалить границу у элемента, который сгенерировал событие, если он проходит проверку на валидность
  var onFieldInput = function (e) {
    if (e.target.validity.valid) {
      resetCustomBorder(e.target);
    }
  };

  // добавить границу элементу
  var setCustomBorder = function (element) {
    element.style.border = '1px solid red';
  };

  // удалить границу у элемента
  var resetCustomBorder = function (element) {
    element.style.border = '1px solid #d9d9d3';
  };

  // валидация для поля «Цена за ночь»
  var validateTitleInput = function () {
    titleInput.minLength = MIN_TITLE_CHAR;
    titleInput.maxLength = MAX_TITLE_CHAR;
    titleInput.required = true;
  };

  // валидация для полей «Тип жилья» и «Цена за ночь»
  var onHouseTypeChange = function () {
    priceInput.required = true;
    priceInput.max = PRICE_MAX;

    if (priceInput.validity.valid) {
      resetCustomBorder(titleInput);
    }

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

  // функция, утсанавливающая значение поля "адрес"
  var setAddressFieldValue = function (value) {
    window.utils.setFieldValue(addressField, value);
  };

  // валидация для полей «Время заезда» и «Время выезда» (синхронизированы)
  var onTimeInTimeOutChange = function (e) {
    if (e.target === checkInTime) {
      checkOutTime.value = checkInTime.value;
    } else {
      checkInTime.value = checkOutTime.value;
    }
  };

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
    var selectedRoomTotal = parseInt(window.utils.getSelectedValue(roomField), 10);
    var selectedGuestTotal = parseInt(window.utils.getSelectedValue(guestField), 10);
    var guestTotal = getValidGuestNumber(selectedRoomTotal, selectedGuestTotal);
    window.utils.setSelectValue(guestField, guestTotal);
  };

  // функция, деактивирующая невалидное количество гостей
  var onDisableInvalidGuestValues = function () {
    var roomNumber = parseInt(window.utils.getSelectedValue(roomField), 10);
    var guestSelectOptions = guestField.querySelectorAll('option');

    guestSelectOptions.forEach(function (guestSelectOption) {
      var guestSelectValue = parseInt(guestSelectOption.value, 10);
      guestSelectOption.disabled = !isGuestNumberValid(roomNumber, guestSelectValue);
    });

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
    var photoPreviewElements = form.querySelectorAll('.ad-form__photo');
    photoPreviewElements.forEach(function (photoPreviewElement, index) {
      // ранний возврат, если передан последний элемент массива
      if (index === photoPreviewElements.length - 1) {
        return;
      }
      photoPreviewElement.remove();
    });
  };

  // функция, удаляющая превью аватарки
  var removeAvatarPreview = function () {
    document.querySelector('.ad-form-header__preview img').src = defaultAvatarUrl;
  };

  // функция, переключающая состояние формы
  var reset = function () {
    form.reset();
    onDisableInvalidGuestValues();
    removePhotoPreviews();
    removeAvatarPreview();
  };

  // функция, переключающая состояние формы
  var toggle = function (isFormActive) {
    form.classList.toggle('ad-form--disabled', !isFormActive);
    reset();
  };

  // обработчик события, отменяюший действия формы по умолчанию
  var onFormSubmit = function (e) {
    e.preventDefault();
    var formData = new FormData(e.target);
    var onSuccess = function () {
      window.modal.openSuccess();
      window.page.toggle(false);
    };
    var onError = function () {
      window.modal.openError(window.modal.closeError);
    };
    window.backend.sendFormData(formData, onSuccess, onError);
  };

  // функция, переключающая состояния полей
  var toggleFieldset = function (isFieldsetActive) {
    var fieldsetElements = document.querySelectorAll('.ad-form fieldset');
    fieldsetElements.forEach(function (fieldsetElement) {
      fieldsetElement.disabled = !isFieldsetActive;
    });
  };

  // обработчик клика на нажатие кнопки 'очистить'
  var onResetButtonClick = function (e) {
    e.preventDefault();
    window.page.toggle(false);
  };

  // функция, обрабатывающая превью аватарки
  var onAvatarPreview = function (e) {
    var file = e.target.files[0];
    var reader = new FileReader();

    reader.addEventListener('load', function (readerEvt) {
      previewImg.src = readerEvt.target.result;
    });

    if (file && file.type.match('image')) {
      reader.readAsDataURL(file);
    } else {
      previewImg.src = defaultAvatarUrl;
    }
  };

  // функция, обрабатывающая превью аватарки
  var onPhotosPreview = function (e) {
    var files = e.target.files;
    removePhotoPreviews();

    Array.prototype.forEach.call(files, function (file) {
      // ранний возврат, если переданный файл не является изображением
      if (!file.type.match('image')) {
        return;
      }
      var reader = new FileReader();

      reader.addEventListener('load', function (readerEvt) {
        var photoPlaceholder = document.querySelector('.ad-form__photo');
        photoContainer.insertBefore(createPhotoPreview(readerEvt.target.result), photoPlaceholder);
      });

      reader.readAsDataURL(file);
    });
  };

  setValidGuestValue();
  validateTitleInput();
  onHouseTypeChange();
  disableAddress();

  resetButton.addEventListener('click', onResetButtonClick);

  titleInput.addEventListener('input', onFieldInput);
  priceInput.addEventListener('input', onFieldInput);

  houseType.addEventListener('change', onHouseTypeChange);
  roomField.addEventListener('change', onDisableInvalidGuestValues);
  guestField.addEventListener('change', onDisableInvalidGuestValues);
  timeFieldset.addEventListener('change', onTimeInTimeOutChange);
  avatarField.addEventListener('change', onAvatarPreview);
  photoField.addEventListener('change', onPhotosPreview);

  titleInput.addEventListener('invalid', onFieldInvalid);
  priceInput.addEventListener('invalid', onFieldInvalid);

  form.addEventListener('submit', onFormSubmit);

  window.form = {
    reset: reset,
    toggle: toggle,
    toggleFieldset: toggleFieldset,
    setAddressFieldValue: setAddressFieldValue
  };
})();
