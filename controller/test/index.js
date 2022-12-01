"use strict";

class Test {
  constructor() {}

  getTestMessage(req, res, next) {
    res.send({
      status: 0,
      type: "ERROR_PARAMS",
      message: "购物车ID参数错误",
    });
  }
}

export default new Test();
