/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/index.js":
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scss_style_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scss/style.scss */ "./src/scss/style.scss");
/* harmony import */ var _scss_style_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_scss_style_scss__WEBPACK_IMPORTED_MODULE_0__);


class Search {
  constructor() {
    this.repositories = [];
    this.queryString = '';
    this.searchField = document.querySelector('.search__field');
    this.searchList = document.querySelector('.search__list');
    this.repoList = document.querySelector('.repo__list');
    this.getRepoDebounce = this.debounce(this.getRepo, 400);
  }

  debounce(fn, timeout) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, timeout);
    };
  }

  getQueryString() {
    return this.queryString = this.searchField.value;
  }

  getRepo(query) {
    if (this.queryString) {
      fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`).then(response => response.json()).then(repo => {
        this.repositories = [...repo.items];
        this.removeAutocomplete();
        this.renderAutocomplete(this.repositories);
        if (!this.queryString) this.removeAutocomplete();
      }).catch(err => alert('Превышено число запросов. Попробуйте позже' + err));
    }
  }

  renderAutocomplete(repos) {
    const fragment = document.createDocumentFragment();

    for (let repo of repos) {
      const searchItem = document.createElement('li');
      searchItem.className = 'search__item';
      searchItem.innerText = repo.name;
      searchItem.addEventListener('click', () => {
        this.renderRepo(repo);
      });
      fragment.appendChild(searchItem);
    }

    this.searchList.classList.add('search__list--show');
    this.searchList.appendChild(fragment);
  }

  removeAutocomplete() {
    this.searchList.querySelectorAll('li').forEach(el => el.remove());
    this.searchList.classList.remove('search__list--show');
  }

  renderRepo(repo) {
    let repoItem = document.createElement('li');
    repoItem.insertAdjacentHTML('afterbegin', `<li class='repo__item'>
      <div class='repo__info'>
        Name: ${repo.name} <br>
        Owner: ${repo.owner.login} <br>
        Stars: ${repo.stargazers_count}
      </div>
      <button class='repo__remove-btn'></button>
    </li>`);
    this.repoList.appendChild(repoItem);
    repoItem.addEventListener('click', e => {
      const repoRemove = repoItem.querySelector('.repo__remove-btn');

      if (e.target === repoRemove) {
        repoItem.remove();
      }
    });
    this.searchField.value = '';
    this.removeAutocomplete();
  }

  request() {
    this.getQueryString();
    this.getRepoDebounce(this.queryString);
  }

}

const search = new Search();
document.addEventListener('click', e => {
  if (e.target !== search.searchField) {
    search.searchList.style.display = 'none';
  }
});
search.searchField.addEventListener('click', () => {
  search.searchList.style.display = 'block';
});
search.searchField.addEventListener('input', search.request.bind(search));
search.searchField.addEventListener('keyup', () => {
  if (!search.queryString) search.removeAutocomplete();
});

/***/ }),

/***/ "./src/scss/style.scss":
/*!*****************************!*\
  !*** ./src/scss/style.scss ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 0:
/*!*******************************!*\
  !*** multi ./src/js/index.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./src/js/index.js */"./src/js/index.js");


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map