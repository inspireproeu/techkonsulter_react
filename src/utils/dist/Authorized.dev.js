"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.reloadAuthorized = void 0;

var _Authorized = _interopRequireDefault(require("@/components/Authorized"));

var _authority = require("./authority");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable eslint-comments/disable-enable-pair */

/* eslint-disable import/no-mutable-exports */
var Authorized = (0, _Authorized["default"])((0, _authority.getAuthority)()); // Reload the rights component

var reloadAuthorized = function reloadAuthorized() {
  Authorized = (0, _Authorized["default"])((0, _authority.getAuthority)());
};
/**
 * hard code
 * block need it。
 */


exports.reloadAuthorized = reloadAuthorized;
window.reloadAuthorized = reloadAuthorized;
var _default = Authorized;
exports["default"] = _default;