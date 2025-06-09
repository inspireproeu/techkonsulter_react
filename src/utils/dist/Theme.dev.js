"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppTheme = void 0;

var _styles = require("@material-ui/core/styles");

var AppTheme = (0, _styles.createMuiTheme)({
  palette: {
    primary: {
      main: '#004750'
    },
    typography: {
      fontFamily: ['Poppins']
    }
  }
});
exports.AppTheme = AppTheme;