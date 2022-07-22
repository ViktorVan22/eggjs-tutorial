"use strict";

const Controller = require("egg").Controller;

class UserController extends Controller {
  async register() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;
    if (!username || !password) {
      ctx.body = {
        code: 500,
        msg: "账号密码不能为空！",
        data: null,
      };
      return;
    }
  }
}

module.exports = UserController;
