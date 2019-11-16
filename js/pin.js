'use strict';

(function () {
  var MAIN_PIN_HEIGHT = 70;
  var MAIN_PIN_WIDTH = 70;
  var MAIN_PIN_START_POSITION = {
    x: 570,
    y: 375
  };
  var similarPinsSelector = '.map__pin:not(.map__pin--main)';
  var mainPinSelector = '.map__pin--main';
  var activePinClass = 'map__pin--active';

  // функция, которая задаёт активное состояние пину
  var activatePin = function (pinElement) {
    pinElement.classList.add(activePinClass);
  };

  // функция, которая деактивирует состояние пина
  window.deactivateAllPins = function () {
    document.querySelectorAll(similarPinsSelector).forEach(function (pinElement) {
      pinElement.classList.remove(activePinClass);
    });
  };

  // функция, формирующая адрес
  var getAddress = function (x, y) {
    return Math.round(x + MAIN_PIN_WIDTH / 2) + ', ' + Math.round(y + MAIN_PIN_HEIGHT);
  };

  // функция, утсанавливающая значение поля "адрес"
  var setAddressFieldValue = function (x, y) {
    window.utils.setFieldValue(document.querySelector('#address'), getAddress(x, y));
  };

  // функция, возвращающая пин в исходное положение
  window.resetMainPinPosition = function () {
    window.utils.moveElement(document.querySelector(mainPinSelector), MAIN_PIN_START_POSITION.x, MAIN_PIN_START_POSITION.y);
    setAddressFieldValue(MAIN_PIN_START_POSITION.x, MAIN_PIN_START_POSITION.y);
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
    var staticStartCoords = window.utils.getElementXY(pinElement);
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

        window.utils.moveElement(pinElement, positionX, positionY);
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
      var staticStartCoords = window.utils.getElementXY(pinElement);
      setAddressFieldValue(staticStartCoords.x, staticStartCoords.y);
    }
  };

  var pinElement = document.querySelector(mainPinSelector);
  pinElement.addEventListener('mousedown', onPinMousedown);
  pinElement.addEventListener('keydown', onMainPinKeydown);

})();
