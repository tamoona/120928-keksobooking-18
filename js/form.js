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
  var defaultAvatarUrl = 'img/muffin-grey.svg';

  // отключение поля «Адреса»
  var disableAddress = function () {
    document.querySelector('input[name="address"]').readOnly = true;
  };

  // добавить границу элементу, который сгенерировал событие
  var setTargetBorder = function (e) {
    setCustomBorder(e.target);
  };

  // удалить границу у элемента, который сгенерировал событие, если он проходит проверку на валидность
  var resetBorderIfTargetValid = function (e) {
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

  // валидация для поля «Заголовок объявления»
  var titleInput = document.querySelector('input[name="title"]');

  // валидация для поля «Цена за ночь»
  var validateTitleInput = function () {
    titleInput.minLength = MIN_TITLE_CHAR;
    titleInput.maxLength = MAX_TITLE_CHAR;
    titleInput.required = true;
  };

  titleInput.addEventListener('input', resetBorderIfTargetValid);
  titleInput.addEventListener('invalid', setTargetBorder);

  var priceInput = document.querySelector('input[name="price"]');
  var houseType = document.querySelector('select[name="type"]');

  // валидация для полей «Тип жилья» и «Цена за ночь»
  var validateHouseTypeVsPrice = function () {
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

  houseType.addEventListener('change', validateHouseTypeVsPrice);
  priceInput.addEventListener('input', resetBorderIfTargetValid);
  priceInput.addEventListener('invalid', setTargetBorder);

  // валидация для полей «Время заезда» и «Время выезда» (синхронизированы)
  var toggleTime = function (e) {
    var checkInTime = document.querySelector('select[name="timein"]');
    var checkOutTime = document.querySelector('select[name="timeout"]');

    if (e.target === checkInTime) {
      checkOutTime.value = checkInTime.value;
    } else {
      checkInTime.value = checkOutTime.value;
    }
  };

  var timeFieldset = document.querySelector('.ad-form__element--time');
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
    var photoPreviewElements = document.querySelectorAll('.ad-form__photo');
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
  window.resetForm = function () {
    form.reset();
    disableInvalidGuestValues();
    removePhotoPreviews();
    removeAvatarPreview();
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
    fieldsetElements.forEach(function (fieldsetElement) {
      fieldsetElement.disabled = !isFieldsetActive;
    });
  };

  // обработчик клика на нажатие кнопки 'очистить'
  var onResetButtonClick = function (e) {
    e.preventDefault();
    window.togglePage(false);
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

    Array.prototype.forEach.call(files, function (file) {
      // ранний возврат, если переданный файл не является изображением
      if (!file.type.match('image')) {
        return;
      }
      var reader = new FileReader();

      reader.addEventListener('load', function (readerEvt) {
        var photoContainer = document.querySelector('.ad-form__photo-container');
        var photoPlaceholder = document.querySelector('.ad-form__photo');
        photoContainer.insertBefore(createPhotoPreview(readerEvt.target.result), photoPlaceholder);
      });

      reader.readAsDataURL(file);
    });
  };

  setValidGuestValue();
  validateTitleInput();
  validateHouseTypeVsPrice();
  disableAddress();

  document.querySelector('#room_number').addEventListener('change', disableInvalidGuestValues);
  document.querySelector('#capacity').addEventListener('change', disableInvalidGuestValues);
  form.addEventListener('submit', onFormSubmit);
  document.querySelector('.ad-form__reset').addEventListener('click', onResetButtonClick);
  document.querySelector('.ad-form-header__input').addEventListener('change', onAvatarPreview);
  document.querySelector('.ad-form__input').addEventListener('change', onPhotosPreview);
})();
