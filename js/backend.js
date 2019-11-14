'use strict';

(function () {
  var SERVER_URL = 'https://js.dump.academy/keksobooking/data';
  var TIMEOUT = 10000;
  var RESPONSE_OK = 200;

  // выполнение http-запроса
  window.request = function (method, url, onSuccess, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === RESPONSE_OK) {
        onSuccess(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;
    xhr.open(method, url);
    xhr.send();
  };

  window.loadPinData = function (onSuccess, onError) {
    window.request('GET', SERVER_URL, onSuccess, onError);
  };
})();
