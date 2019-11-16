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

  // функция, которая переключает состояние страницы
  var togglePage = function (state) {
    window.toggleMap(state);
    window.toggleFieldset(state);
    window.toggleFilters(state);
    window.toggleForm(state);
    window.resetAllFilters();
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

  window.utils = {
    setFieldValue: setFieldValue,
    removeElement: removeElement,
    removeElements: removeElements,
    getSelectedValue: getSelectedValue,
    setSelectValue: setSelectValue,
    togglePage: togglePage,
    moveElement: moveElement,
    getElementXY: getElementXY,
    setDataOrRemoveElement: setDataOrRemoveElement,
    setChildrenOrRemoveElement: setChildrenOrRemoveElement
  };
})();
