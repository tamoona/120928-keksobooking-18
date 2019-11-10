'use strict';

(function () {
// cлучайное число диапазона
  window.getRandomInteger = function (min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  };

  // генерация массива случайной длины на основе массива
  window.getRandomArrayFromArray = function (array) {
    var lastElementIndex = array.length - 1;
    var randomArrayStartIndex = window.getRandomInteger(0, lastElementIndex);
    var randomArrayEndIndex = window.getRandomInteger(randomArrayStartIndex, lastElementIndex);

    if (randomArrayStartIndex === randomArrayEndIndex) {
      return array.slice(randomArrayStartIndex);
    }

    return array.slice(randomArrayStartIndex, randomArrayEndIndex);
  };

  // генерация случайного элемента из массива
  window.getRandomValueFromArray = function (array) {
    var index = window.getRandomInteger(0, array.length - 1);
    return array[index];
  };

  // функция, добавляющая значение в поле
  window.setFieldValue = function (fieldElement, value) {
    fieldElement.value = value;
  };

  // функция, удаляюшая елементы
  window.removeElements = function (nodeList) {
    for (var i = 0; i < nodeList.length; i++) {
      nodeList[i].parentNode.removeChild(nodeList[i]);
    }
  };

  // функция, возвращающая значение выбранной опции у списка
  window.getSelectedValue = function (element) {
    return element.options[element.selectedIndex].value;
  };

  // функция, которая задаёт значение select
  window.setSelectValue = function (element, value) {
    element.value = value;
  };
})();
