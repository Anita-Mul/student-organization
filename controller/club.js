"use strict";
import formidable from "formidable";

import ClubModel from "../models/club";
import getPath from "../utils/getPath";

class Club {
  constructor(props) {}
  async getClub(req, res, next) {
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
      const club = await ClubModel.find({ _id: club_id }, "-_id -__v");

      res.send({
        status: 1,
        data: club,
      });
    } catch (err) {
      console.log("获取社团数据失败");
      res.send({
        status: 0,
        type: "ERROR_DATA",
        message: "获取社团数据失败",
      });
    }
  }

  async getAllClub(req, res, next) {
    try {
      const clubs = await ClubModel.find({}, "-_id -__v");
      res.send({
        status: 1,
        data: clubs,
      });
    } catch (err) {
      console.log("获取社团数据失败");
      res.send({
        status: 0,
        type: "ERROR_DATA",
        message: "获取社团数据失败",
      });
    }
  }

  async addClub(req, res, next) {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      const { name, description, type } = fields;

      try {
        if (!name) {
          throw new Error("必填社团名字");
        } else if (!type) {
          throw new Error("必填社团类型");
        } else if (!description) {
          throw new Error("必填社团描述");
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

      const image_path = await getPath(files, res, "club");

      const clubObj = {
        name,
        description,
        type,
        picture: image_path,
      };

      const club = new ClubModel(clubObj);
      try {
        await club.save();

        res.send({
          status: 1,
          success: "添加社团成功",
        });
      } catch (err) {
        console.log("保存社团失败");
        res.send({
          status: 0,
          type: "ERROR_IN_SAVE_DATA",
          message: "保存社团失败",
        });
      }
    });
  }

  async deleteClub(req, res, next) {
    const club_id = req.params.club_id;
    if (!club_id) {
      console.log("club_id 参数错误");
      res.send({
        status: 0,
        type: "ERROR_PARAMS",
        message: "club_id 参数错误",
      });
      return;
    }

    try {
      const club = await ClubModel.findOne({ _id: club_id });
      await club.remove();

      res.send({
        status: 1,
        success: "删除社团成功",
      });
    } catch (err) {
      console.log("删除社团失败", err);
      res.send({
        status: 0,
        type: "DELETE_FOOD_FAILED",
        message: "删除社团失败",
      });
    }
  }

  async updateClub(req, res, next) {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      const { name, description, type, id } = fields;

      try {
        if (!name) {
          throw new Error("必填社团名字");
        } else if (!type) {
          throw new Error("必填社团类型");
        } else if (!description) {
          throw new Error("必填社团描述");
        } else if (!id) {
          throw new Error("必填社团 id");
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

      const image_path = await getPath(files, res, "club");

      const clubObj = {
        name,
        description,
        type,
        picture: image_path,
      };

      try {
        await ClubModel.findOneAndUpdate({ _id: id }, { $set: clubObj });

        res.send({
          status: 1,
          success: "更新社团成功",
        });
      } catch (err) {
        console.log("更新社团失败");
        res.send({
          status: 0,
          type: "ERROR_IN_SAVE_DATA",
          message: "更新社团失败",
        });
      }
    });
  }
}

export default new Club();
