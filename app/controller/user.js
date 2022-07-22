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

    const userInfo = await ctx.service.user.getUserByName(username);
    if (userInfo && userInfo.id) {
      ctx.body = {
        code: 500,
        msg: "账户名已被注册，请重新输入",
        data: null,
      };
      return;
    }

    const defaultAvatar =
      "http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png";
    const result = await ctx.service.user.register({
      username,
      password,
      ctime: "2022/07/22 10:53",
      signature: "阿米浴说的道理",
      avatar: defaultAvatar,
    });
    if (result) {
      ctx.body = {
        code: 200,
        msg: "注册成功",
        data: null,
      };
    } else {
      ctx.body = {
        code: 500,
        msg: "注册失败",
        data: null,
      };
    }
  }
}

module.exports = UserController;
