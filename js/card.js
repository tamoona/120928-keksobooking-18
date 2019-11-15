'use strict';

(function () {
  // функция, которая убирает карточку объявления
  window.removeCard = function () {
    window.utils.removeElements(document.querySelectorAll('.map .map__card'));
  };

  // обработчик закрытия карточки с подробной информацией по нажатию клавиши Esc
  var closePopupButtonEsc = function (e) {
    if (e.keyCode === window.consts.ESC_KEY_NUMBER) {
      window.removeCard();
    }
  };

  window.addEventListener('keydown', closePopupButtonEsc);

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

  // генерирует франмент документа, содержащий фотографии
  var generateOfferPhotos = function (photoTemplate, photos) {
    var fragment = document.createDocumentFragment();
    photos.forEach(function (photo) {
      var photoElementCopy = photoTemplate.cloneNode(true);
      photoElementCopy.src = photo;
      fragment.appendChild(photoElementCopy);
    });
    return fragment;
  };

  // заполнить окно с информацией об объявлении
  var updateCard = function (card, data) {
    var cardElement = card.querySelector('.map__card');
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

  // вспомогательная функция для перерисовки карты на основе переданных данных
  window.openNewCard = function (data) {
    window.removeCard();
    renderCard(data);
    var popup = document.querySelector('.map__card');
    var closePopupButton = popup.querySelector('.popup__close');

    closePopupButton.addEventListener('click', window.removeCard);
  };

})();
