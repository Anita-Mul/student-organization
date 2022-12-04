"use strict";
import formidable from "formidable";

import ActivityModel from "../models/activity";
import ClubModel from "../models/club";

class Activity {
  constructor(props) {}

  async getActivityWithActivityId(req, res, next) {
    const activity_id = req.params.activity_id;

    if (!activity_id) {
      console.log("activity_id 参数错误", activity_id);
      res.send({
        status: 0,
        type: "ERROR_ACTIVITY_ID",
        message: "activity_id 参数错误",
      });
      return;
    }

    try {
      const activity = await ActivityModel.find(
        { _id: activity_id },
        "-_id -__v"
      );
      res.send({
        status: 1,
        data: activity,
      });
    } catch (err) {
      console.log("获取活动数据失败");
      res.send({
        status: 0,
        type: "ERROR_DATA",
        message: "获取活动数据失败",
      });
    }
  }

  async getActivityWithClubId(req, res, next) {
    const club_id = req.params.club_id;

    if (!club_id) {
      console.log("club_id 参数错误", club_id);
      res.send({
        status: 0,
        type: "ERROR_CLUB_ID",
        message: "club_id 参数错误",
      });
      return;
    }

    try {
      const activity = await ActivityModel.find({ club: club_id }, "-_id -__v");
      res.send({
        status: 1,
        data: activity,
      });
    } catch (err) {
      console.log("获取活动数据失败");
      res.send({
        status: 0,
        type: "ERROR_DATA",
        message: "获取活动数据失败",
      });
    }
  }

  async getAllActivity(req, res, next) {
    try {
      const activities = await ActivityModel.find({}, "-_id -__v");
      res.send({
        status: 1,
        data: activities,
      });
    } catch (err) {
      console.log("获取活动数据失败");
      res.send({
        status: 0,
        type: "ERROR_DATA",
        message: "获取活动数据失败",
      });
    }
  }

  async addActivity(req, res, next) {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      const { name, site, time, number, leader, state, club } = fields;

      try {
        if (!name) {
          throw new Error("必填活动名称");
        } else if (!site) {
          throw new Error("必填活动地点");
        } else if (!time) {
          throw new Error("必填活动时间");
        } else if (!number) {
          throw new Error("必填活动人数");
        } else if (!leader) {
          throw new Error("必填活动负责人");
        } else if (!state) {
          throw new Error("必填活动状态（已批准[true] or 不批准[false]）");
        } else if (!club) {
          throw new Error("必填活动所属社团");
        }
      } catch (err) {
        console.log(err.message, err);
        res.send({
          status: 0,
          type: "ERROR_PARAMS",
          message: err.message,
        });
        return;
      }

      const activityObj = {
        name,
        site,
        time,
        number,
        leader,
        state,
        club,
      };

      const activity = new ActivityModel(activityObj);
      try {
        await activity.save(async function (err, result) {
          if (err) {
            res.send({
              status: 0,
              type: "ERROR_IN_SAVE_DATA",
              message: "保存数据失败",
            });
          } else {
            let belongClub = await ClubModel.findOne({ _id: club }).lean();
            belongClub.news.push(result._id);
            await ClubModel.findOneAndUpdate(
              { _id: club },
              { $set: belongClub }
            );
          }
        });

        res.send({
          status: 1,
          success: "添加活动成功",
        });
      } catch (err) {
        console.log("保存活动失败");
        res.send({
          status: 0,
          type: "ERROR_IN_SAVE_DATA",
          message: "保存活动失败",
        });
      }
    });
  }

  async deleteActivity(req, res, next) {
    const activity_id = req.params.activity_id;

    if (!activity_id) {
      console.log("activity_id参数错误");
      res.send({
        status: 0,
        type: "ERROR_PARAMS",
        message: "activity_id参数错误",
      });
      return;
    }

    try {
      const activity = await ActivityModel.findOne({ _id: activity_id });
      const club = await ClubModel.findOne({
        _id: activity._doc.club,
      }).lean();

      club.activities.splice(
        club.activities.findIndex((id) => id === activity_id),
        1
      );

      await ClubModel.findOneAndUpdate({ _id: club._id }, { $set: club });
      await activity.remove();

      res.send({
        status: 1,
        success: "删除活动成功",
      });
    } catch (err) {
      console.log("删除活动失败", err);
      res.send({
        status: 0,
        type: "DELETE_FOOD_FAILED",
        message: "删除活动失败",
      });
    }
  }

  async updateActivity(req, res, next) {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      const { name, site, time, number, leader, state, club, id } = fields;

      try {
        if (!name) {
          throw new Error("必填活动名称");
        } else if (!site) {
          throw new Error("必填活动地点");
        } else if (!time) {
          throw new Error("必填活动时间");
        } else if (!number) {
          throw new Error("必填活动人数");
        } else if (!leader) {
          throw new Error("必填活动负责人");
        } else if (!state) {
          throw new Error("必填活动状态（已批准[true] or 不批准[false]）");
        } else if (!club) {
          throw new Error("必填活动所属社团");
        } else if (!id) {
          throw new Error("必填活动 id");
        }
      } catch (err) {
        console.log(err.message, err);
        res.send({
          status: 0,
          type: "ERROR_PARAMS",
          message: err.message,
        });
        return;
      }

      const activityObj = {
        name,
        site,
        time,
        number,
        leader,
        state,
        club,
      };

      try {
        await ActivityModel.findOneAndUpdate(
          { _id: id },
          { $set: activityObj }
        );

        res.send({
          status: 1,
          success: "更新活动成功",
        });
      } catch (err) {
        console.log("保存数据失败");
        res.send({
          status: 0,
          type: "ERROR_IN_SAVE_DATA",
          message: "保存数据失败",
        });
      }
    });
  }

  async updateActivityState(req, res, next) {
    const activity_id = req.params.activity_id;
    const state = req.query.state;

    try {
      if (!activity_id) {
        throw new Error("必填活动 id");
      } else if (!state) {
        throw new Error("必填活动状态");
      }
    } catch (err) {
      console.log(err.message, err);
      res.send({
        status: 0,
        type: "ERROR_PARAMS",
        message: err.message,
      });
      return;
    }

    try {
      await ActivityModel.findOneAndUpdate(
        { _id: activity_id },
        { $set: { state } }
      );

      res.send({
        status: 1,
        success: "更新活动状态成功",
      });

      return;
    } catch (err) {
      console.log("更新活动状态失败", err);
      res.send({
        status: 0,
        type: "ERROR_UPLOAD_IMG",
        message: "更新活动状态失败",
      });
      return;
    }
  }
}

export default new Activity();
