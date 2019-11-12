'use strict';

(function () {
  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  window.COORDINATES_Y_MIN = 130;
  window.COORDINATES_Y_MAX = 630;
  var PHOTOS_OBJECT = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];
  var CHECKIN_CHECKOUT_TIME = ['12:00', '13:00', '14:00'];
  var PIN_WIDTH = 40;

  // генерация адреса изображения пользователя
  var getAvatarUrl = function (number) {
    return 'img/avatars/user0' + number + '.png';
  };

  // генерация локации предложения
  var getOfferLocation = function () {
    return {
      x: window.utils.getRandomInteger(PIN_WIDTH, 1000),
      y: window.utils.getRandomInteger(window.COORDINATES_Y_MIN, window.COORDINATES_Y_MAX)
    };
  };

  // генерация моков предложения
  window.getMockOffers = function (count) {
    var offers = [];

    for (var i = 0; i < count; i++) {
      var location = getOfferLocation();

      offers.push({
        author: {
          avatar: getAvatarUrl(i + 1)
        },
        offer: {
          title: 'Уютное гнездышко для молодоженов',
          address: location.x + ', ' + location.y,
          price: window.utils.getRandomInteger(1000, 10000),
          type: window.utils.getRandomValueFromArray(TYPES),
          rooms: window.utils.getRandomInteger(1, 5),
          guests: window.utils.getRandomInteger(1, 5),
          checkin: window.utils.getRandomValueFromArray(CHECKIN_CHECKOUT_TIME),
          checkout: window.utils.getRandomValueFromArray(CHECKIN_CHECKOUT_TIME),
          features: window.utils.getRandomArrayFromArray(FEATURES),
          description: 'Великолепная квартира-студия в центре Токио. Подходит как туристам, так и бизнесменам. Квартира полностью укомплектована и недавно отремонтирована.',
          photos: window.utils.getRandomArrayFromArray(PHOTOS_OBJECT)
        },
        location: location
      });
    }

    return offers;
  };
})();
