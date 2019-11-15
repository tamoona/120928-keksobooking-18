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

  // генерирует фрагмент документа, содержащий фотографии
  var generateOfferPhotos = function (photoTemplate, photos) {
    var fragment = document.createDocumentFragment();
    photos.forEach(function (photo) {
      var photoElementCopy = photoTemplate.cloneNode(true);
      photoElementCopy.src = photo;
      fragment.appendChild(photoElementCopy);
    });
    return fragment;
  };

  // генерирует фрагмент документа, содержащий иконки преимуществ
  var generateOfferFeatures = function (features) {
    var fragment = document.createDocumentFragment();
    features.forEach(function (feature) {
      var featureElement = document.createElement('li');
      featureElement.classList.add('popup__feature', 'popup__feature--' + feature);
      fragment.appendChild(featureElement);
    });
    return fragment;
  };

  // заполнить окно с информацией об объявлении
  var updateCard = function (card, data) {
    var cardElement = card.querySelector('.map__card');
    var photoTemplate = cardElement.querySelector('.popup__photo');
    var photoSectionElement = cardElement.querySelector('.popup__photos');
    var featureSectionElement = cardElement.querySelector('.popup__features');
    var photoUrls = data.offer.photos;
    var features = data.offer.features;

    window.utils.setDataOrRemoveElement(cardElement.querySelector('.popup__title'), data.offer.title, 'textContent');
    window.utils.setDataOrRemoveElement(cardElement.querySelector('.popup__text--address'), data.offer.address, 'textContent');
    window.utils.setDataOrRemoveElement(cardElement.querySelector('.popup__text--price'), data.offer.price + '₽/ночь', 'textContent');
    window.utils.setDataOrRemoveElement(cardElement.querySelector('.popup__type'), getReadableOfferType(data.offer.type), 'textContent');
    window.utils.setDataOrRemoveElement(cardElement.querySelector('.popup__text--capacity'), data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей', 'textContent');
    window.utils.setDataOrRemoveElement(cardElement.querySelector('.popup__text--time'), 'Заезд после ' + data.offer.checkin + ',' + ' выезд до' + data.offer.checkout, 'textContent');
    window.utils.setDataOrRemoveElement(cardElement.querySelector('.popup__description'), data.offer.description, 'textContent');
    window.utils.setDataOrRemoveElement(cardElement.querySelector('.popup__avatar'), data.author.avatar, 'src');

    window.utils.setChildrenOrRemoveElement(photoSectionElement, photoUrls, generateOfferPhotos(photoTemplate, photoUrls));
    window.utils.setChildrenOrRemoveElement(featureSectionElement, features, generateOfferFeatures(features));

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
