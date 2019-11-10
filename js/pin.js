'use strict';

(function () {
  // функция, формирующая адрес
  var getAddress = function (coordinates) {
    return Math.round(coordinates.left + coordinates.width) + ', ' + Math.round(coordinates.top + coordinates.height);
  };

  // функция, которая возвращает координаты X и Y
  var getCoordinates = function (element) {
    return element.getBoundingClientRect();
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
    return pinElement;
  };

  // сгенерировать dom-елементы пинов и отобразить на карте
  window.renderMapPins = function (offers) {
    var listElement = document.querySelector('.map__pins');
    var fragment = document.createDocumentFragment();
    var pinTemplate = document.querySelector('#pin')
      .content;

    for (var i = 0; i < offers.length; i++) {
      var pinElement = updateMapPin(pinTemplate.cloneNode(true), offers[i], i);
      fragment.appendChild(pinElement);
    }

    listElement.appendChild(fragment);
  };

  // функция, которая переключает состояние страницы
  var togglePage = function (state) {
    window.toggleMap(state);
    window.toggleFieldset(state);
    window.toggleFilters(state);
    window.toggleForm(state);
  };

  // обработчик события для пина на карте, при нажатии мышкой
  var onPinMousedown = function (e) {
    e.preventDefault();
    togglePage(true);
    var coordinates = getCoordinates(document.querySelector('.map__pin--main'));
    window.setFieldValue(document.querySelector('#address'), getAddress(coordinates));
  };

  // обработчик события для пина на карте, при нажатии клавиши ENTER
  var onMainPinKeydown = function (e) {
    if (e.keyCode === 13) {
      togglePage(true);
      var coordinates = getCoordinates(document.querySelector('.map__pin--main'));
      window.setFieldValue(document.querySelector('#address'), getAddress(coordinates));
    }
  };

  var pinElement = document.querySelector('.map__pin--main');
  pinElement.addEventListener('mousedown', onPinMousedown);
  pinElement.addEventListener('keydown', onMainPinKeydown);

})();
