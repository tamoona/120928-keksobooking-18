'use strict';

(function () {
  var isPageActivated = false;

  // функция, которая переключает состояние страницы
  var togglePage = function (isPageActive) {
    // ранний возврат из функции, если текущее состояние страницы совпадает с новым состоянием
    if (isPageActivated === isPageActive) {
      return;
    }
    isPageActivated = isPageActive;
    window.form.toggleForm(isPageActive);
    window.form.toggleFieldset(isPageActive);
    window.map.toggleMap(isPageActive);
    window.filters.resetAllFilters();
  };

  window.page = {
    togglePage: togglePage
  };
})();
