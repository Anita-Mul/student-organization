"use strict";
class Check {
  constructor() {}

  async checkAdmin(req, res, next) {
    const people_id = req.session.people_id;
    const type = req.session.type;

    if (!people_id) {
      res.send({
        status: 0,
        type: "ERROR_SESSION",
        message: "亲，您还没有登录",
      });
      return;
    } else {
      if (type !== "Admin") {
        res.send({
          status: 0,
          type: "HAS_NO_ACCESS",
          message: "亲，您的权限不足",
        });
        return;
      }
    }

    next();
  }

  async checkUser(req, res, next) {
    const people_id = req.session.people_id;
    const type = req.session.type;

    if (!people_id) {
      res.send({
        status: 0,
        type: "ERROR_SESSION",
        message: "亲，您还没有登录",
      });
      return;
    } else {
      if (type !== "User") {
        res.send({
          status: 0,
          type: "HAS_NO_ACCESS",
          message: "亲，您的权限不足",
        });
        return;
      }
    }

    next();
  }

  async checkLeader(req, res, next) {
    const people_id = req.session.people_id;
    const type = req.session.type;

    if (!people_id) {
      res.send({
        status: 0,
        type: "ERROR_SESSION",
        message: "亲，您还没有登录",
      });
      return;
    } else {
      if (type !== "Leader") {
        res.send({
          status: 0,
          type: "HAS_NO_ACCESS",
          message: "亲，您的权限不足",
        });
        return;
      }
    }

    next();
  }
}

export default new Check();
