'use strict';

(function () {
  var MAIN_PIN_HEIGHT = 65;
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_TIP_HEIGHT = 22;
  var mainPinStartPosition = {
    x: 570,
    y: 375
  };
  var mainPinElement = document.querySelector('.map__pin--main');
  var pinContainer = document.querySelector('.map__pins');

  // функция, изменяющая позиционирование элемента
  var moveElement = function (element, x, y) {
    element.style.top = y + 'px';
    element.style.left = x + 'px';
  };

  // функция, получающая x и y координаты элемента
  var getElementXY = function (element) {
    return {
      x: parseInt(element.style.left, 10),
      y: parseInt(element.style.top, 10)
    };
  };

  // функция, которая переключает состояние пина
  var togglePin = function (element, isActive) {
    var activePinClass = 'map__pin--active';
    if (isActive) {
      element.classList.add(activePinClass);
    } else {
      element.classList.remove(activePinClass);
    }
  };

  // функция, которая задаёт активное состояние пину
  var activatePin = function (element) {
    togglePin(element, true);
  };

  // функция, которая задаёт неактивное состояние пину
  var deactivatePin = function (element) {
    togglePin(element, false);
  };

  // функция, которая деактивирует состояние пина
  var deactivateAllPins = function () {
    document.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(deactivatePin);
  };

  // функция, формирующая адрес
  var getAddress = function (x, y, isPinActive) {
    var xPosition = x + MAIN_PIN_WIDTH / 2;
    var yPosition = y + (isPinActive ? MAIN_PIN_HEIGHT / 2 : MAIN_PIN_HEIGHT + MAIN_PIN_TIP_HEIGHT);
    return Math.round(xPosition) + ', ' + Math.round(yPosition);
  };

  // функция, возвращающая пин в исходное положение
  var resetMainPinPosition = function () {
    moveElement(mainPinElement, mainPinStartPosition.x, mainPinStartPosition.y);
    window.form.setAddressFieldValue(getAddress(mainPinStartPosition.x, mainPinStartPosition.y, true));
  };

  // заполнить пин данными
  var updateMapPin = function (mapPin, data, index) {
    var pinElement = mapPin.querySelector('.map__pin');
    pinElement.style.left = data.location.x + 'px';
    pinElement.style.top = data.location.y + 'px';
    pinElement.dataset.id = index;
    var imgElement = pinElement.querySelector('img');
    imgElement.src = data.author.avatar;
    imgElement.alt = data.offer.title;

    // обработчик, благодаря которому пользователь может открыть карточку любого доступного объявления
    var onPinClick = function () {
      window.card.openNewCard(data);
      deactivateAllPins();
      activatePin(pinElement);
    };

    // обработчик открытия карточки объявления с клавиатуры, карточка объявления для выбранного пина открывается при нажатии на клавишу Enter
    var onPinKeydown = function (e) {
      if (e.keyCode === window.consts.ENTER_KEY_NUMBER) {
        window.card.openNewCard(data);
        deactivateAllPins();
        activatePin(pinElement);
      }
    };

    pinElement.addEventListener('click', onPinClick);
    pinElement.addEventListener('keydown', onPinKeydown);
    return pinElement;
  };

  // функция, удаляющая пины, за исключением главного пина
  var removeMapPins = function () {
    window.utils.removeElements(document.querySelectorAll('.map__pin:not(.map__pin--main)'));
  };

  // сгенерировать dom-елементы пинов и отобразить на карте
  var renderMapPins = function (offers) {
    removeMapPins();
    var fragment = document.createDocumentFragment();
    var pinTemplate = document.querySelector('#pin')
      .content;

    offers.forEach(function (offer, index) {
      var pinElement = updateMapPin(pinTemplate.cloneNode(true), offer, index);
      fragment.appendChild(pinElement);
    });

    pinContainer.appendChild(fragment);
  };

  // обработчик события для пина на карте, при нажатии мышкой
  var onPinMousedown = function (e) {
    e.preventDefault();
    var staticStartCoords = getElementXY(mainPinElement);
    var startCoords = {
      x: e.clientX,
      y: e.clientY
    };
    var xBoundaries = window.map.getMapWidth() - MAIN_PIN_WIDTH;
    var isDragged = false;

    // обработчик события для перестаскивания главного пина
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      isDragged = true;
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var positionY = mainPinElement.offsetTop - shift.y;
      var positionX = mainPinElement.offsetLeft - shift.x;
      var boundariesYMin = window.consts.COORDINATES_Y_MIN - MAIN_PIN_HEIGHT - MAIN_PIN_TIP_HEIGHT;
      var boundariesYMax = window.consts.COORDINATES_Y_MAX - MAIN_PIN_HEIGHT - MAIN_PIN_TIP_HEIGHT;

      if (positionY >= boundariesYMin && positionY <= boundariesYMax && positionX <= xBoundaries && positionX >= 0) {

        moveElement(mainPinElement, positionX, positionY);
        window.form.setAddressFieldValue(getAddress(positionX, positionY));
      }
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (isDragged) {
        var onMouseClick = function (evt) {
          evt.preventDefault();
          mainPinElement.removeEventListener('click', onMouseClick);
        };
        mainPinElement.addEventListener('click', onMouseClick);
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    window.page.togglePage(true);
    window.form.setAddressFieldValue(getAddress(staticStartCoords.x, staticStartCoords.y));
  };

  // обработчик события для пина на карте, при нажатии клавиши ENTER
  var onMainPinKeydown = function (e) {
    if (e.keyCode === window.consts.ENTER_KEY_NUMBER) {
      window.page.togglePage(true);
      var staticStartCoords = getElementXY(mainPinElement);
      window.form.setAddressFieldValue(getAddress(staticStartCoords.x, staticStartCoords.y));
    }
  };

  mainPinElement.addEventListener('mousedown', onPinMousedown);
  mainPinElement.addEventListener('keydown', onMainPinKeydown);

  window.form.setAddressFieldValue(getAddress(mainPinStartPosition.x, mainPinStartPosition.y, true));

  window.pin = {
    deactivateAllPins: deactivateAllPins,
    removeMapPins: removeMapPins,
    renderMapPins: renderMapPins,
    resetMainPinPosition: resetMainPinPosition,
    pinData: []
  };
})();
