'use strict';

(function () {
  var isPageActivated = false;

  // функция, которая переключает состояние страницы
  window.togglePage = function (isPageActive) {
    // ранний возврат из функции, если текущее состояние страницы совпадает с новым состоянием
    if (isPageActivated === isPageActive) {
      return;
    }

    isPageActivated = isPageActive;
    window.toggleForm(isPageActive);
    window.toggleFieldset(isPageActive);
    window.toggleMap(isPageActive);
    window.resetAllFilters();
  };
})();
