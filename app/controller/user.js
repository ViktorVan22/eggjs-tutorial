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
      ctime: Date.now().toString(),
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

  async login() {
    // app 为全局属性，相当于所有的插件方法都植入到了 app 对象。
    // 通过app.xxx 使用名为xxx的插件
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;
    const userInfo = await ctx.service.user.getUserByName(username);
    if (!userInfo || !userInfo.id) {
      ctx.body = {
        code: 500,
        msg: "账号不存在",
        data: null,
      };
      return;
    }

    if (userInfo && userInfo.id && password !== userInfo.password) {
      ctx.body = {
        code: 500,
        msg: "账号密码错误",
        data: null,
      };
      return;
    }

    const token = app.jwt.sign(
      {
        id: userInfo.id,
        username: userInfo.username,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // token 有效期为24小时
      },
      app.config.jwt.secret
    );
    ctx.body = {
      code: 200,
      msg: "登陆成功",
      data: {
        token,
      },
    };
  }

  async test() {
    const { ctx, app } = this;
    // 请求头获取 authorization 属性，值为 token
    const token = ctx.request.header.authorization;
    const decode = app.jwt.verify(token, app.config.jwt.secret);
    ctx.body = {
      code: 200,
      msg: "获取成功",
      data: {
        ...decode,
      },
    };
  }

  async getUserInfo() {
    const { ctx, app } = this;
    const token = ctx.request.header.authorization;
    const decode = app.jwt.verify(token, app.config.jwt.secret);
    const userInfo = await ctx.service.user.getUserByName(decode.username);
    ctx.body = {
      code: 200,
      msg: "请求成功",
      data: {
        id: userInfo.id,
        username: userInfo.username,
        signature: userInfo.signature || "",
        avatar: userInfo.avatar || defaultAvatar,
        createdAt: userInfo.ctime,
      },
    };
  }

  async editUserInfo() {
    const { ctx, app } = this;
    const { signature = "" } = ctx.request.body;
    let user_id;
    const token = ctx.request.header.authorization;
    const decode = app.jwt.verify(token, app.config.jwt.secret);

    if (!decode) return;

    user_id = decode.id;
    const userInfo = await ctx.service.user.getUserByName(decode.username);
    const result = await ctx.service.user.editUserInfo({
      ...userInfo,
      signature,
    });

    ctx.body = {
      code: 200,
      msg: "请求成功",
      data: {
        id: user_id,
        signature,
        username: userInfo.username,
      },
    };
  }
}

module.exports = UserController;
