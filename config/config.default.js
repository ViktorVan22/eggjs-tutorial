/* eslint valid-jsdoc: "off" */

"use strict";

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  exports.mysql = {
    client: {
      host: "localhost",
      port: "3306",
      user: "root",
      password: "950827",
      database: "juejue-cost",
    },
    app: true,
    agent: false,
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1658395652287_7442";

  // add your middleware config here
  config.middleware = [];

  // add whiteList
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: ["*"],
  };

  // add ejs
  config.view = {
    mapping: { ".html": "ejs" }, // view文件夹下的html后缀文件，识别为.ejs
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
