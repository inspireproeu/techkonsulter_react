"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  route: {
    path: '/financials',
    routes: [{
      path: '/financials',
      name: 'FINANCIALS',
      component: './projects/list'
    }, {
      path: '/project-cost',
      name: 'FINANCE',
      component: './finance/list'
    }, {
      component: '404'
    }]
  }
};
exports["default"] = _default;