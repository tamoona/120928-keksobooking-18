'use strict';

(function () {
  var SERVER_URL = 'https://thawing-earth-81600.herokuapp.com/keksobooking/data';
  var SERVER_NEW_AD_URL = 'https://thawing-earth-81600.herokuapp.com/keksobooking';
  var TIMEOUT = 10000;
  var RESPONSE_OK = 200;

  // выполнение http-запроса
  var request = function (method, url, options) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === RESPONSE_OK) {
        options.onSuccess(xhr.response);
      } else {
        options.onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      options.onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      options.onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;
    xhr.open(method, url);
    xhr.send(options.data);
  };

  var loadPinData = function (onSuccess, onError) {
    request('GET', SERVER_URL, {onSuccess: onSuccess, onError: onError});
  };

  var sendFormData = function (formData, onSuccess, onError) {
    request('POST', SERVER_NEW_AD_URL, {onSuccess: onSuccess, onError: onError, data: formData});
  };

  window.backend = {
    loadPinData: loadPinData,
    sendFormData: sendFormData
  };
})();
