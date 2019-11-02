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

// функция, переключающая состояние карты
var toggleMap = function (state) {
  document.querySelector('.map').classList.toggle('map--faded', !state);
};

// функция, переключающая состояния полей
var toggleFieldset = function (state) {
  var fieldsetElements = document.querySelectorAll('.ad-form fieldset');
  for (var i = 0; i < fieldsetElements.length; i++) {
    fieldsetElements[i].disabled = !state;
  }
};

// функция, переключающая активное состояние формы с фильтрами
var toggleFilters = function (state) {
  var filtersElements = document.querySelectorAll('.map__filters select, .map__filters fieldset');
  for (var i = 0; i < filtersElements.length; i++) {
    filtersElements[i].disabled = !state;
  }
};

// функция, переключающая состояние формы
var toggleForm = function (state) {
  document.querySelector('.ad-form').classList.toggle('ad-form--disabled', !state);
};

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

// заполнить пин данными
var updateMapPin = function (mapPin, data) {
  var pinElement = mapPin.querySelector('.map__pin');
  pinElement.style.left = data.location.x + 'px';
  pinElement.style.top = data.location.y + 'px';
  var imgElement = pinElement.querySelector('img');
  imgElement.src = data.author.avatar;
  imgElement.alt = data.offer.title;
  return pinElement;
};

// сгенерировать dom-елементы пинов и отобразить на карте
var renderMapPins = function (offers) {
  var listElement = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();
  var pinTemplate = document.querySelector('#pin')
    .content;

  for (var i = 0; i < offers.length; i++) {
    var pinElement = updateMapPin(pinTemplate.cloneNode(true), offers[i]);
    fragment.appendChild(pinElement);
  }

  listElement.appendChild(fragment);
};

// функция, возвращающая читаемый тип жилья
var getReadableOfferType = function (type) {
  switch (type) {
    case 'flat':
      return 'Квартира';
    case 'bungalo':
      return 'Бунгало';
    case 'house':
      return 'Дом';
    case 'palace':
      return 'Дворец';
    default:
      return '';
  }
};

// генерирует франмент документа, содкржащий фотографии
var generateOfferPhotos = function (photoTemplate, photos) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < photos.length; i++) {
    var photoElementCopy = photoTemplate.cloneNode(true);
    photoElementCopy.src = photos[i];
    fragment.appendChild(photoElementCopy);
  }
  return fragment;
};

// заполнить окно с информацией об объявлении
var updateCard = function (mapCard, data) {
  var cardElement = mapCard.querySelector('.map__card');
  var photoTemplate = cardElement.querySelector('.popup__photo');
  var photoSectionElement = cardElement.querySelector('.popup__photos');

  cardElement.querySelector('.popup__title').textContent = data.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = data.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = data.offer.price + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = getReadableOfferType(data.offer.type);
  cardElement.querySelector('.popup__text--capacity').textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + data.offer.checkin + ',' + ' выезд до' + data.offer.checkout;
  cardElement.querySelector('.popup__features').textContent = data.offer.features.join(', ');
  cardElement.querySelector('.popup__description').textContent = data.offer.description;
  photoSectionElement.innerHTML = '';
  photoSectionElement.appendChild(generateOfferPhotos(photoTemplate, data.offer.photos));
  cardElement.querySelector('.popup__avatar').src = data.author.avatar;

  return cardElement;
};

// сгенерировать dom-элемент попапа и отобразить на карте
var renderCard = function (offer) {
  var cardTemplate = document.querySelector('#card')
    .content;
  var cardElement = updateCard(cardTemplate.cloneNode(true), offer);
  document.querySelector('.map').insertBefore(cardElement, document.querySelector('.map__filters-container'));
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

// функция, которая переключает состояние страницы
var togglePage = function (state) {
  toggleMap(state);
  toggleFieldset(state);
  toggleFilters(state);
  toggleForm(state);
};

// обработчик события для пина на карте, при нажатии мышкой
var onPinMousedown = function (e) {
  e.preventDefault();
  togglePage(true);
};

// обработчик события для пина на карте, при нажатии клавиши ENTER
var onPinKeydown = function (e) {
  e.preventDefault();

  if (e.keyCode === 13) {
    togglePage(true);
  }
};

var pinElement = document.querySelector('.map__pin--main');

pinElement.addEventListener('mousedown', onPinMousedown);
pinElement.addEventListener('keydown', onPinKeydown);

var offers = getMockOffers(PIN_NUMBER);
renderMapPins(offers);
renderCard(offers[0]);
