"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useMobile = useMobile;
exports.useMobileSmall = useMobileSmall;
exports.ExportExcel = ExportExcel;
exports.ExcelDateToJSDate = ExcelDateToJSDate;
exports.fetchDelete = exports.fetchGetWithoutLogin = exports.fetchGet = exports.fetchPut = exports.fetchPost = exports.getRouteAuthority = exports.getAuthorityFromRouter = exports.getPageQuery = exports.isAntDesignProOrDev = exports.isAntDesignPro = exports.isUrl = void 0;

var _querystring = require("querystring");

var _pathToRegexp = _interopRequireDefault(require("path-to-regexp"));

var _umi = require("umi");

var _useMediaAntdQuery = _interopRequireWildcard(require("use-media-antd-query"));

var _axios = _interopRequireDefault(require("axios"));

var FileSaver = _interopRequireWildcard(require("file-saver"));

var XLSX = _interopRequireWildcard(require("xlsx"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// const fetch = require('node-fetch');

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
var reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

var isUrl = function isUrl(path) {
  return reg.test(path);
}; // const accesstoken = localStorage.getItem('antd-pro-accesstoken'); // auto reload


exports.isUrl = isUrl;
var access_token = localStorage.getItem('antd-pro-accesstoken'); // auto reload
// console.log("getAccessToken utilsss", getAccessToken())

var isAntDesignPro = function isAntDesignPro() {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性


exports.isAntDesignPro = isAntDesignPro;

var isAntDesignProOrDev = function isAntDesignProOrDev() {
  var NODE_ENV = process.env.NODE_ENV;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};

exports.isAntDesignProOrDev = isAntDesignProOrDev;

var getPageQuery = function getPageQuery() {
  return (0, _querystring.parse)(window.location.href.split('?')[1]);
};
/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */


exports.getPageQuery = getPageQuery;

var getAuthorityFromRouter = function getAuthorityFromRouter() {
  var router = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var pathname = arguments.length > 1 ? arguments[1] : undefined;
  var authority = router.find(function (_ref) {
    var routes = _ref.routes,
        _ref$path = _ref.path,
        path = _ref$path === void 0 ? '/' : _ref$path,
        _ref$target = _ref.target,
        target = _ref$target === void 0 ? '_self' : _ref$target;
    return path && target !== '_blank' && (0, _pathToRegexp["default"])(path).exec(pathname) || routes && getAuthorityFromRouter(routes, pathname);
  });
  if (authority) return authority;
  return undefined;
};

exports.getAuthorityFromRouter = getAuthorityFromRouter;

var getRouteAuthority = function getRouteAuthority(path, routeData) {
  var authorities;
  routeData.forEach(function (route) {
    // match prefix
    if ((0, _pathToRegexp["default"])("".concat(route.path, "/(.*)")).test("".concat(path, "/"))) {
      if (route.authority) {
        authorities = route.authority;
      } // exact match


      if (route.path === path) {
        authorities = route.authority || authorities;
      } // get children authority recursively


      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

exports.getRouteAuthority = getRouteAuthority;

function useMobile() {
  var colSize = (0, _useMediaAntdQuery["default"])();
  return colSize === 'xs' || colSize === 'sm' || colSize === 'md';
}

function useMobileSmall() {
  var colSize = (0, _useMediaAntdQuery["default"])();
  return colSize === 'xs';
}

function ExportExcel(csvData, fileName) {
  // const classes = useStyles();
  var fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  var fileExtension = '.xlsx';
  var ws = XLSX.utils.json_to_sheet(csvData);
  var wb = {
    Sheets: {
      'stock': ws
    },
    SheetNames: ['stock']
  };
  var excelBuffer = XLSX.write(wb, {
    bookType: 'xlsx',
    type: 'array'
  });
  var data = new Blob([excelBuffer], {
    type: fileType
  });
  return FileSaver.saveAs(data, fileName + fileExtension);
}

function ExcelDateToJSDate(serialDate) {
  var days = Math.floor(serialDate);
  var hours = Math.floor(serialDate % 1 * 24);
  var minutes = Math.floor((serialDate % 1 * 24 - hours) * 60);
  return new Date(Date.UTC(0, 0, serialDate, hours - 17, minutes));
}

var fetchPost = function fetchPost(endPoint, params) {
  var accesstoken1 = localStorage.getItem('antd-pro-accesstoken'); // auto reload

  var promise = new Promise(function (resolve, reject) {
    _axios["default"].post(endPoint, params, {
      headers: {
        "Authorization": "Bearer ".concat(accesstoken1)
      }
    }).then(function _callee(response) {
      return regeneratorRuntime.async(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // let response = await res.json();
              // response.ok = res.ok;
              //   console.log("***", response)
              resolve(response.data);

            case 1:
            case "end":
              return _context.stop();
          }
        }
      });
    })["catch"](function (err) {
      if (err.code === 403) {
        _umi.history.push({
          pathname: '/user/login'
        });
      }

      if (err.code === 400) {
        err = "Field must to be unique";
      }

      console.log(err, "Error in adding ".concat(err));
      reject(err);
    });
  });
  return promise;
};

exports.fetchPost = fetchPost;

var fetchPut = function fetchPut(endPoint, params, accesstoken) {
  var promise = new Promise(function (resolve, reject) {
    _axios["default"].patch(endPoint, params, {
      headers: {
        "Authorization": "Bearer ".concat(accesstoken)
      }
    }).then(function _callee2(response) {
      return regeneratorRuntime.async(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              // let response = await res.json();
              response.ok = response.statusText === 'OK' ? true : false;
              resolve(response.data);

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      });
    })["catch"](function (err) {
      if (err.code === 403) {
        window.location.reload();
      }

      console.log("Error in updating ".concat(params, " at ").concat(endPoint));
      reject(err);
    });
  });
  return promise;
};

exports.fetchPut = fetchPut;

var fetchGet = function fetchGet(endPoint) {
  var accesstoken = localStorage.getItem('antd-pro-accesstoken'); // auto reload

  var promise = new Promise(function (resolve, reject) {
    _axios["default"].get(endPoint, {
      headers: {
        "Authorization": "Bearer ".concat(accesstoken)
      } // timeout: 1000 * 50, // Wait for 5 seconds

    }).then(function _callee3(response) {
      return regeneratorRuntime.async(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              // let response = await res.json();
              response.ok = response.statusText === 'OK' ? true : false;
              resolve(response.data);

            case 2:
            case "end":
              return _context3.stop();
          }
        }
      });
    })["catch"](function (err) {
      if (err.code === 403) {
        _umi.history.push({
          pathname: '/user/login'
        });
      }

      console.log(err, "Error fetching data from ".concat(endPoint));
      reject(err);
    });
  });
  return promise;
};

exports.fetchGet = fetchGet;

var fetchGetWithoutLogin = function fetchGetWithoutLogin(endPoint) {
  var promise = new Promise(function (resolve, reject) {
    _axios["default"].get(endPoint).then(function _callee4(response) {
      return regeneratorRuntime.async(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              // let response = await res.json();
              //console.log("response", response)
              response.ok = response.statusText === 'OK' ? true : false;
              resolve(response.data);

            case 2:
            case "end":
              return _context4.stop();
          }
        }
      });
    })["catch"](function (err) {
      if (err.code === 403) {
        _umi.history.push({
          pathname: '/user/login'
        });
      }

      console.log("Error fetching data from ".concat(endPoint));
      reject(err);
    });
  });
  return promise;
};

exports.fetchGetWithoutLogin = fetchGetWithoutLogin;

var fetchDelete = function fetchDelete(endPoint, params, accesstoken) {
  var promise = new Promise(function (resolve, reject) {
    _axios["default"]["delete"](endPoint, {
      headers: {
        "Authorization": "Bearer ".concat(accesstoken)
      },
      data: params
    }).then(function _callee5(res) {
      return regeneratorRuntime.async(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              // let response = await res.json();
              res.ok = 'ok';
              resolve(res);

            case 2:
            case "end":
              return _context5.stop();
          }
        }
      });
    })["catch"](function (err) {
      if (err.code === 403) {
        window.location.reload();
      }

      console.log("Error in updating ".concat(params, " at ").concat(endPoint));
      reject(err);
    });
  });
  return promise;
};

exports.fetchDelete = fetchDelete;