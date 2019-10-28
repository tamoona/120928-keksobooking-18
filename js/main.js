'use strict';

var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var COORDINATES_Y_MIN = 130;
var COORDINATES_Y_MAX = 630;
var PHOTOS_OBJECT = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var CHECKIN_CHECKOUT_TIME = ['12:00', '13:00', '14:00'];
var PIN_NUMBER = 8;
var PIN_WIDTH = 40;

// cлучайное число диапазона
var getRandomInteger = function (min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

// генерация массива случайной длины на основе массива
var getRandomArrayFromArray = function (array) {
  var lastElementIndex = array.length - 1;
  var randomArrayStartIndex = getRandomInteger(0, lastElementIndex);
  var randomArrayEndIndex = getRandomInteger(randomArrayStartIndex, lastElementIndex);

  if (randomArrayStartIndex === randomArrayEndIndex) {
    return array.slice(randomArrayStartIndex);
  }

  return array.slice(randomArrayStartIndex, randomArrayEndIndex);
};

// генерация случайного элемента из массива
var getRandomValueFromArray = function (array) {
  var index = getRandomInteger(0, array.length - 1);
  return array[index];
};

// генерация адреса изображения пользователя
var getAvatarUrl = function (number) {
  return 'img/avatars/user0' + number + '.png';
};

// генерация локации предложения
var getOfferLocation = function () {
  return {
    x: getRandomInteger(PIN_WIDTH, 1000),
    y: getRandomInteger(COORDINATES_Y_MIN, COORDINATES_Y_MAX)
  };
};

var updateMapPin = function (mapPin, data) {
  var pinElement = mapPin.querySelector('.map__pin');
  pinElement.style.left = data.location.x + 'px';
  pinElement.style.top = data.location.y + 'px';
  var imgElement = pinElement.querySelector('img');
  imgElement.src = data.author.avatar;
  imgElement.alt = data.offer.title;
  return pinElement;
};

var renderMapPins = function (offers) {
  var listElement = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();
  var pinTemplate = document.querySelector('#pin')
    .content;

  for (var i = 0; i < offers.length; i++) {
    var offer = offers[i];
    var pinElement = updateMapPin(pinTemplate.cloneNode(true), offer);
    fragment.appendChild(pinElement);
  }

  listElement.appendChild(fragment);
};

// генерация моков предложения
var getMockOffers = function (size) {
  var offers = [];

  for (var i = 0; i < size; i++) {
    var location = getOfferLocation();

    offers.push({
      author: {
        avatar: getAvatarUrl(i + 1)
      },
      offer: {
        title: 'Уютное гнездышко для молодоженов',
        address: location.x + ', ' + location.y,
        price: getRandomInteger(1000, 10000),
        type: getRandomValueFromArray(TYPES),
        rooms: getRandomInteger(1, 5),
        guests: getRandomInteger(1, 5),
        checkin: getRandomValueFromArray(CHECKIN_CHECKOUT_TIME),
        checkout: getRandomValueFromArray(CHECKIN_CHECKOUT_TIME),
        features: getRandomArrayFromArray(FEATURES),
        description: 'Великолепная квартира-студия в центре Токио. Подходит как туристам, так и бизнесменам. Квартира полностью укомплектована и недавно отремонтирована.',
        photos: getRandomArrayFromArray(PHOTOS_OBJECT)
      },
      location: location
    });
  }

  return offers;
};

var offers = getMockOffers(PIN_NUMBER);
renderMapPins(offers);
