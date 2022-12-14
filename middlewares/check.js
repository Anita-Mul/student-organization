"use strict";

import PeopleModel from "../models/people";
import ClubModel from "../models/club";

class Check {
  constructor() {}

  async checkClubLeader(req, res, next) {
    // const people_id = req.session.people_id;
    const people_id = "638cae811cf09f55a4253049";
    const club = req.query.club;

    try {
      if (!people_id) {
        throw new Error("您未登录哦！");
      } else if (!club) {
        throw new Error("club 必填");
      }
    } catch (err) {
      console.log(err.message, err);
      res.send({
        status: 0,
        type: "GET_ERROR_PARAM",
        message: err.message,
      });
      return;
    }

    try {
      const info = await PeopleModel.findOne({ _id: people_id }).lean();
      if (!info.type || info.type != "Admin") {
        let oneClub = await ClubModel.findOne({ _id: club }).lean();

        if (oneClub.leader.indexOf(people_id) == -1) {
          throw new Error("亲，您不是此社团 Leader 或 Admin，无法查看哦！");
        }
      }
    } catch (err) {
      res.send({
        status: 0,
        type: "GET_People_INFO_FAILED",
        message: err.message,
      });
    }

    next();
  }

  async checkAdmin(req, res, next) {
    // const people_id = req.session.people_id;
    const people_id = "638cab9c2e55e96b382c616c";

    if (!people_id) {
      res.send({
        status: 0,
        type: "ERROR_SESSION",
        message: "亲，您还没有登录",
      });
      return;
    }

    try {
      const info = await PeopleModel.findOne({ _id: people_id });
      if (!info) {
        throw new Error("未找到人员");
      } else if (info.type != "Admin") {
        throw new Error("亲，您不是 Admin，无法查看哦！");
      }
    } catch (err) {
      res.send({
        status: 0,
        type: "GET_People_INFO_FAILED",
        message: err.message,
      });
    }

    next();
  }
}

export default new Check();
