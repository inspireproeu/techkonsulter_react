"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _querystring = require("querystring");

var _umi = require("umi");

var _antd = require("antd");

var _login = require("@/services/login");

var _authority = require("@/utils/authority");

var _utils = require("@/utils/utils");

var _user = require("@/services/user");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Model = {
  namespace: 'login',
  state: {
    status: undefined,
    loginStatus: {}
  },
  effects: {
    login:
    /*#__PURE__*/
    regeneratorRuntime.mark(function login(_ref, _ref2) {
      var payload, errorHandler, call, put, response, userresponse, userType, urlPath;
      return regeneratorRuntime.wrap(function login$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              payload = _ref.payload, errorHandler = _ref.errorHandler;
              call = _ref2.call, put = _ref2.put;
              _context.prev = 2;
              _context.next = 5;
              return put({
                type: 'logoutResponse',
                payload: ''
              });

            case 5:
              _context.next = 7;
              return call(_login.fakeAccountLogin, payload, errorHandler);

            case 7:
              response = _context.sent;

              if (!(response.data && response.data.access_token)) {
                _context.next = 20;
                break;
              }

              _context.next = 11;
              return put({
                type: 'changeLoginStatus',
                payload: response.data
              });

            case 11:
              _context.next = 13;
              return call(_user.queryCurrent, response.data.access_token);

            case 13:
              userresponse = _context.sent;
              // Login successfully
              // console.log("userresponse", userresponse)
              // return
              userType = userresponse.data.userType; // setAuthority(userType);

              urlPath = '';

              if (userType !== 'ADMIN' && userType !== 'FINANCIAL') {
                urlPath = '/projects';
              } else if (userType === 'FINANCIAL') {
                urlPath = '/financials';
              } else {
                urlPath = '/';
              }

              _umi.history.replace(urlPath);

              _context.next = 22;
              break;

            case 20:
              _context.next = 22;
              return put({
                type: 'loginResponse',
                payload: response
              });

            case 22:
              _context.next = 26;
              break;

            case 24:
              _context.prev = 24;
              _context.t0 = _context["catch"](2);

            case 26:
            case "end":
              return _context.stop();
          }
        }
      }, login, null, [[2, 24]]);
    }),
    logout: function logout() {
      (0, _authority.removeAuthority)();
      (0, _authority.removeAccessToken)();

      _umi.history.replace({
        pathname: '/user/login'
      });
    }
  },
  reducers: {
    changeLoginStatus: function changeLoginStatus(state, _ref3) {
      var payload = _ref3.payload;
      // setAuthority(payload.currentAuthority);
      // setAuthority('admin');
      (0, _authority.setAccessToken)(payload.access_token);
      return _objectSpread({}, state, {
        status: "ok",
        type: payload
      });
    },
    loginResponse: function loginResponse(state, _ref4) {
      var payload = _ref4.payload;
      return _objectSpread({}, state, {
        loginStatus: payload
      });
    },
    logoutResponse: function logoutResponse(state, _ref5) {
      var payload = _ref5.payload;
      return _objectSpread({}, state, {
        logoutMessage: payload
      });
    }
  }
};
var _default = Model;
exports["default"] = _default;