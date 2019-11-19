'use strict';

(function () {
  var isPageActivated = false;

  // функция, которая переключает состояние страницы
  var toggle = function (isPageActive) {
    // ранний возврат из функции, если текущее состояние страницы совпадает с новым состоянием
    if (isPageActivated === isPageActive) {
      return;
    }
    isPageActivated = isPageActive;
    window.form.toggle(isPageActive);
    window.form.toggleFieldset(isPageActive);
    window.map.toggle(isPageActive);
    window.filters.resetAll();
  };

  window.page = {
    toggle: toggle
  };
})();
