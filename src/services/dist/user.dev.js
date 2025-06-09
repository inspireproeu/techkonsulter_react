"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.query = query;
exports.queryCurrent = queryCurrent;
exports.fakeUpdateUser = fakeUpdateUser;
exports.queryNotices = queryNotices;
exports.queryFetchLangs = queryFetchLangs;

var _request = _interopRequireDefault(require("@/utils/request"));

var _authority = require("@/utils/authority");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function query() {
  return regeneratorRuntime.async(function query$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", (0, _request["default"])('/users'));

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
}

function queryCurrent(token) {
  return regeneratorRuntime.async(function queryCurrent$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return", (0, _request["default"])('/users/me?fields=role_name,first_name,last_name,role.description,email,id,role.id,phone_number,userType,partner.id,client.id,access,role.name,isDefault,warehouse,client.toShowEstimateValues,partner.toShowEstimateValues,partner.country,client.country', {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Authorization': "Bearer ".concat(token ? token : (0, _authority.getAccessToken)())
            }
          }));

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function fakeUpdateUser(params, id, errorHandler) {
  return regeneratorRuntime.async(function fakeUpdateUser$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          return _context3.abrupt("return", (0, _request["default"])("/salescrm/users/".concat(id), {
            errorHandler: errorHandler,
            method: 'PATCH',
            data: params,
            // requestType: 'form',
            headers: {
              'Authorization': "Bearer ".concat((0, _authority.getAccessToken)())
            }
          }));

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function queryNotices() {
  return regeneratorRuntime.async(function queryNotices$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          return _context4.abrupt("return", (0, _request["default"])('/notices'));

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
}

function queryFetchLangs(params) {
  return regeneratorRuntime.async(function queryFetchLangs$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          return _context5.abrupt("return", (0, _request["default"])("/salescrm/items/languages", {
            method: 'GET' // params	

          }));

        case 1:
        case "end":
          return _context5.stop();
      }
    }
  });
}