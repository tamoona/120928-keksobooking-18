'use strict';

(function () {
  var MAIN_PIN_HEIGHT = 65;
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_START_POSITION = {
    x: 570,
    y: 375
  };
  var similarPinsSelector = '.map__pin:not(.map__pin--main)';
  var mainPinSelector = '.map__pin--main';
  var activePinSelector = '.map__pin--active';

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

  // функция, которая задаёт активное состояние пину
  var activatePin = function (pinElement) {
    pinElement.classList.add(activePinSelector.slice(1));
  };

  // функция, которая задаёт неактивное состояние пину
  var deactivatePin = function (pinElement) {
    pinElement.classList.remove(activePinSelector.slice(1));
  };

  // функция, которая деактивирует состояние пина
  window.deactivateAllPins = function () {
    document.querySelectorAll(similarPinsSelector).forEach(deactivatePin);
  };

  // функция, формирующая адрес
  var getAddress = function (x, y, isInitial) {
    var xPosition = x + MAIN_PIN_WIDTH / 2;
    var yPosition = y + (isInitial ? MAIN_PIN_HEIGHT / 2 : MAIN_PIN_HEIGHT);
    return Math.round(xPosition) + ', ' + Math.round(yPosition);
  };

  // функция, утсанавливающая значение поля "адрес"
  var setAddressFieldValue = function (x, y, isInitial) {
    window.utils.setFieldValue(document.querySelector('#address'), getAddress(x, y, isInitial));
  };

  // функция, возвращающая пин в исходное положение
  window.resetMainPinPosition = function () {
    moveElement(document.querySelector(mainPinSelector), MAIN_PIN_START_POSITION.x, MAIN_PIN_START_POSITION.y);
    setAddressFieldValue(MAIN_PIN_START_POSITION.x, MAIN_PIN_START_POSITION.y, true);
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
      window.openNewCard(data);
      window.deactivateAllPins();
      activatePin(pinElement);
    };

    // обработчик открытия карточки объявления с клавиатуры, карточка объявления для выбранного пина открывается при нажатии на клавишу Enter
    var onPinKeydown = function (e) {
      if (e.keyCode === window.consts.ENTER_KEY_NUMBER) {
        window.openNewCard(data);
        window.deactivateAllPins();
        activatePin(pinElement);
      }
    };

    pinElement.addEventListener('click', onPinClick);
    pinElement.addEventListener('keydown', onPinKeydown);
    return pinElement;
  };

  // функция, удаляющая пины, за исключением главного пина
  window.removeMapPins = function () {
    window.utils.removeElements(document.querySelectorAll(similarPinsSelector));
  };

  // сгенерировать dom-елементы пинов и отобразить на карте
  window.renderMapPins = function (offers) {
    window.removeMapPins();
    var listElement = document.querySelector('.map__pins');
    var fragment = document.createDocumentFragment();
    var pinTemplate = document.querySelector('#pin')
      .content;

    offers.forEach(function (offer, index) {
      var pinElement = updateMapPin(pinTemplate.cloneNode(true), offer, index);
      fragment.appendChild(pinElement);
    });

    listElement.appendChild(fragment);
  };

  // обработчик события для пина на карте, при нажатии мышкой
  var onPinMousedown = function (e) {
    e.preventDefault();
    var staticStartCoords = getElementXY(pinElement);
    var startCoords = {
      x: e.clientX,
      y: e.clientY
    };
    var xBoundaries = document.querySelector('.map').getBoundingClientRect().width - MAIN_PIN_WIDTH;
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

      var positionY = pinElement.offsetTop - shift.y;
      var positionX = pinElement.offsetLeft - shift.x;
      var boundariesYMin = window.consts.COORDINATES_Y_MIN - MAIN_PIN_HEIGHT;
      var boundariesYMax = window.consts.COORDINATES_Y_MAX - MAIN_PIN_HEIGHT;

      if (positionY >= boundariesYMin && positionY <= boundariesYMax && positionX <= xBoundaries && positionX >= 0) {

        moveElement(pinElement, positionX, positionY);
        setAddressFieldValue(positionX, positionY);
      }
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (isDragged) {
        var onClickPreventDefault = function (evt) {
          evt.preventDefault();
          pinElement.removeEventListener('click', onClickPreventDefault);
        };
        pinElement.addEventListener('click', onClickPreventDefault);
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    window.togglePage(true);
    setAddressFieldValue(staticStartCoords.x, staticStartCoords.y);
  };

  // обработчик события для пина на карте, при нажатии клавиши ENTER
  var onMainPinKeydown = function (e) {
    if (e.keyCode === window.consts.ENTER_KEY_NUMBER) {
      window.togglePage(true);
      var staticStartCoords = getElementXY(pinElement);
      setAddressFieldValue(staticStartCoords.x, staticStartCoords.y);
    }
  };

  var pinElement = document.querySelector(mainPinSelector);

  pinElement.addEventListener('mousedown', onPinMousedown);
  pinElement.addEventListener('keydown', onMainPinKeydown);

  setAddressFieldValue(MAIN_PIN_START_POSITION.x, MAIN_PIN_START_POSITION.y, true);
})();
