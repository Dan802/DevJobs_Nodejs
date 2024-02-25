/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./public/js/app.js":
/*!**************************!*\
  !*** ./public/js/app.js ***!
  \**************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nfunction _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\nfunction _iterableToArray(iter) { if (typeof Symbol !== \"undefined\" && iter[Symbol.iterator] != null || iter[\"@@iterator\"] != null) return Array.from(iter); }\nfunction _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }\n// import Trix from \"trix\"\n\n// document.addEventListener(\"trix-before-initialize\", () => {\n//   // Change Trix.config if you need\n// })\n\nvar skillsSet = new Set();\ndocument.addEventListener('DOMContentLoaded', iniciar);\nfunction iniciar() {\n  var skills = document.querySelector('.lista-conocimientos');\n  if (skills) {\n    skills.addEventListener('click', agregarSkills);\n\n    // Una vez que estamos en editar, llamar la función (para que se añadan los skills automaticamente al value hidden)\n    skillsSeleccionados();\n  }\n}\nfunction agregarSkills(e) {\n  if (e.target.tagName === 'LI') {\n    if (e.target.classList.contains('activo')) {\n      skillsSet[\"delete\"](e.target.textContent);\n      e.target.classList.remove('activo');\n    } else {\n      skillsSet.add(e.target.textContent);\n      e.target.classList.add('activo');\n    }\n  }\n\n  // Set to Array\n  var skillsArray = _toConsumableArray(skillsSet);\n  document.querySelector('#skills').value = skillsArray;\n}\nfunction skillsSeleccionados() {\n  var seleccionadas = document.querySelectorAll('.lista-conocimientos .activo');\n  var seleccionadasArray = Array.from(seleccionadas);\n\n  // extraer el valor del <LI>\n  seleccionadasArray.forEach(function (seleccionada) {\n    skillsSet.add(seleccionada.textContent);\n  });\n\n  // Set to Array\n  var skillsArray = _toConsumableArray(skillsSet);\n\n  // inyectarlo al input:hidden\n  document.querySelector('#skills').value = skillsArray;\n}\n\n//# sourceURL=webpack://devjobs_nodejs/./public/js/app.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./public/js/app.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;