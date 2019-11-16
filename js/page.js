'use strict';

(function () {
  var pageActivated = false;

  // функция, которая переключает состояние страницы
  window.togglePage = function (isPageActive) {
    // ранний возврат из функции, если текущее состояние страницы совпадает с новым состоянием
    if (pageActivated === isPageActive) {
      return;
    }

    pageActivated = isPageActive;

    window.toggleMap(isPageActive);
    window.toggleFieldset(isPageActive);
    window.toggleForm(isPageActive);
    window.resetAllFilters();
  };
})();
