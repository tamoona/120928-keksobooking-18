'use strict';

(function () {
  // функция, добавляющая значение в поле
  var setFieldValue = function (fieldElement, value) {
    fieldElement.value = value;
  };

  // функция, удаляюшая элемент
  var removeElement = function (element) {
    if (element) {
      element.remove();
    }
  };

  // функция, удаляюшая элементы
  var removeElements = function (nodeList) {
    for (var i = 0; i < nodeList.length; i++) {
      removeElement(nodeList[i]);
    }
  };

  // функция, возвращающая значение выбранной опции у списка
  var getSelectedValue = function (element) {
    return element.options[element.selectedIndex].value;
  };

  // функция, которая задаёт значение select
  var setSelectValue = function (element, value) {
    element.value = value;
  };

  // функция, изменяющая позиционирование элемента
  var moveElement = function (element, x, y) {
    element.style.top = y + 'px';
    element.style.left = x + 'px';
  };

  // функция, получающая x и y координаты элемента
  var getElementXY = function (element) {
    return {
      x: parseInt(element.style.left, 10),
      y: parseInt(element.style.top, 10)
    };
  };

  // функция, заполняющая данными элемент или удаляющая его если данных не существует
  var setDataOrRemoveElement = function (element, data, attr) {
    if (data) {
      element[attr] = data;
    } else {
      element.remove();
    }
  };

  // функция, заполняющая данными элемент или удаляющая его если данных не существует
  var setChildrenOrRemoveElement = function (element, data, children) {
    if (Array.isArray(data) && data.length > 0) {
      element.innerHTML = '';
      element.appendChild(children);
    } else {
      element.remove();
    }
  };

  // Возвращает функцию, которая не будет срабатывать, пока продолжает вызываться.
  // Она сработает только один раз через N миллисекунд после последнего вызова.
  // Если ей передан аргумент `isImmediate`, то она будет вызвана один раз сразу после
  // первого запуска.
  var debounce = function (cb, wait, isImmediate) {
    var timeout;
    return function () {
      var args = arguments;
      var later = function () {
        timeout = null;
        if (!isImmediate) {
          cb.apply(cb, args);
        }
      };
      var callNow = isImmediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        cb.apply(cb, args);
      }
    };
  };

  window.utils = {
    setFieldValue: setFieldValue,
    removeElement: removeElement,
    removeElements: removeElements,
    getSelectedValue: getSelectedValue,
    setSelectValue: setSelectValue,
    moveElement: moveElement,
    getElementXY: getElementXY,
    setDataOrRemoveElement: setDataOrRemoveElement,
    setChildrenOrRemoveElement: setChildrenOrRemoveElement,
    debounce: debounce
  };
})();
