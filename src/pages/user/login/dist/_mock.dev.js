"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

// eslint-disable-next-line import/no-extraneous-dependencies
function getFakeCaptcha(req, res) {
  return res.json('captcha-xxx');
}

var _default = {
  'POST  /login/account': function POSTLoginAccount(req, res) {
    var _req$body = req.body,
        password = _req$body.password,
        userName = _req$body.userName,
        type = _req$body.type;

    if (password === 'ant.design' && userName === 'admin') {
      res.send({
        status: 'ok',
        type: type,
        currentAuthority: 'admin 123'
      });
      return;
    }

    if (password === 'ant.design' && userName === 'user') {
      res.send({
        status: 'ok',
        type: type,
        currentAuthority: 'user'
      });
      return;
    }

    if (type === 'mobile') {
      res.send({
        status: 'ok',
        type: type,
        currentAuthority: 'admin'
      });
      return;
    }

    res.send({
      status: 'error',
      type: type,
      currentAuthority: 'guest'
    });
  },
  'GET  /login/captcha': getFakeCaptcha
};
exports["default"] = _default;