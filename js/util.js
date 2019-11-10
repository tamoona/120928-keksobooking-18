'use strict';

(function () {
// cлучайное число диапазона
  var getRandomInteger = function (min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  };

  // генерация массива случайной длины на основе массива
  var getRandomArrayFromArray = function (array) {
    var lastElementIndex = array.length - 1;
    var randomArrayStartIndex = getRandomInteger(0, lastElementIndex);
    var randomArrayEndIndex = getRandomInteger(randomArrayStartIndex, lastElementIndex);

    if (randomArrayStartIndex === randomArrayEndIndex) {
      return array.slice(randomArrayStartIndex);
    }

    return array.slice(randomArrayStartIndex, randomArrayEndIndex);
  };

  // генерация случайного элемента из массива
  var getRandomValueFromArray = function (array) {
    var index = getRandomInteger(0, array.length - 1);
    return array[index];
  };

  // функция, добавляющая значение в поле
  var setFieldValue = function (fieldElement, value) {
    fieldElement.value = value;
  };

  // функция, удаляюшая елементы
  var removeElements = function (nodeList) {
    for (var i = 0; i < nodeList.length; i++) {
      nodeList[i].parentNode.removeChild(nodeList[i]);
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

  window.utils = {
    getRandomInteger: getRandomInteger,
    getRandomArrayFromArray: getRandomArrayFromArray,
    getRandomValueFromArray: getRandomValueFromArray,
    setFieldValue: setFieldValue,
    removeElements: removeElements,
    getSelectedValue: getSelectedValue,
    setSelectValue: setSelectValue
  };
})();