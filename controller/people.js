"use strict";

import crypto from "crypto";
import formidable from "formidable";
import dtime from "time-formater";

import PeopleModel from "../models/people";
import getPath from "../utils/getPath";

const ADMIN = "Admin";
const USER = "User";
const LEADER = "Leader";

class People {
  constructor() {
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.logout = this.logout.bind(this);
    this.getAllPeopleWithType = this.getAllPeopleWithType.bind(this);
    this.getPeopleInfo = this.getPeopleInfo.bind(this);
    this.updateAvatar = this.updateAvatar.bind(this);
    this.encryption = this.encryption.bind(this);
    this.Md5 = this.Md5.bind(this);
  }

  async login(req, res, next) {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.send({
          status: 0,
          type: "FORM_DATA_ERROR",
          message: "表单信息错误",
        });

        return;
      }

      const { user_name, password } = fields;

      try {
        if (!user_name) {
          throw new Error("用户名参数错误");
        } else if (!password) {
          throw new Error("密码参数错误");
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

      const newPassword = this.encryption(password);

      try {
        const people = await PeopleModel.findOne({ user_name });

        if (newPassword.toString() != people.password.toString()) {
          console.log("管理员登录密码错误");
          res.send({
            status: 0,
            type: "ERROR_PASSWORD",
            message: "该用户存在，密码输入错误",
          });
        } else {
          console.log(people._id);
          req.session.people_id = people._id;
          req.session.type = people.type;

          res.send({
            status: 1,
            success: "登录成功",
          });
        }
      } catch (err) {
        console.log("登录失败", err);
        res.send({
          status: 0,
          type: "LOGIN_PEOPLE_FAILED",
          message: "登录失败",
        });
      }
    });
  }

  async register(req, res, next) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.send({
          status: 0,
          type: "FORM_DATA_ERROR",
          message: "表单信息错误",
        });
        return;
      }

      const { user_name, password, type, institute = "", phone = "" } = fields;

      try {
        if (!user_name) {
          throw new Error("用户名错误");
        } else if (!password) {
          throw new Error("密码错误");
        } else if (!type) {
          throw new Error("类型错误");
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
        const people = await PeopleModel.findOne({ user_name });
        if (people) {
          console.log("该用户已经存在");
          res.send({
            status: 0,
            type: "USER_HAS_EXIST",
            message: "该用户已经存在",
          });
        } else {
          const newPassword = this.encryption(password);

          const newPeople = {
            user_name,
            password: newPassword,
            type,
            create_time: dtime().format("YYYY-MM-DD"),
            institute,
            phone,
          };

          const findPeople = await PeopleModel.create(newPeople);

          req.session.people_id = findPeople._id;
          req.session.type = type;

          res.send({
            status: 1,
            message: "注册成功",
          });
        }
      } catch (err) {
        console.log("注册失败", err);
        res.send({
          status: 0,
          type: "REGISTER_People_FAILED",
          message: "注册失败",
        });
      }
    });
  }

  encryption(password) {
    const newPassword = this.Md5(
      this.Md5(password).substr(2, 7) + this.Md5(password)
    );
    return newPassword;
  }

  Md5(password) {
    const md5 = crypto.createHash("md5");
    return md5.update(password).digest("base64");
  }

  async logout(req, res, next) {
    try {
      delete req.session.people_id;
      delete req.session.type;
      res.send({
        status: 1,
        success: "退出成功",
      });
    } catch (err) {
      console.log("退出失败", err);
      res.send({
        status: 0,
        message: "退出失败",
      });
    }
  }

  async getAllPeopleWithType(req, res, next) {
    const { limit = 20, offset = 0, type } = req.query;
    try {
      // 返回信息中不包括 _id 和 -password
      const allPeople = await PeopleModel.find(
        {
          type,
        },
        "-_id -password -__v"
      )
        .skip(Number(offset))
        .limit(Number(limit));

      res.send({
        status: 1,
        data: allPeople,
      });
    } catch (err) {
      console.log("获取管理列表失败", err);
      res.send({
        status: 0,
        type: "ERROR_GET_People_LIST",
        message: "获取管理列表失败",
      });
    }
  }

  async getPeopleInfo(req, res, next) {
    const people_id = req.session.people_id;

    if (!people_id || !Number(people_id)) {
      // console.log('获取管理员信息的session失效');
      res.send({
        status: 0,
        type: "ERROR_SESSION",
        message: "获取管理员信息失败",
      });
      return;
    }

    try {
      const info = await PeopleModel.findOne(
        { _id: people_id },
        "-_id -password"
      );
      if (!info) {
        throw new Error("未找到人员");
      } else {
        res.send({
          status: 1,
          data: info,
        });
      }
    } catch (err) {
      console.log("获取信息失败");
      res.send({
        status: 0,
        type: "GET_People_INFO_FAILED",
        message: "获取信息失败",
      });
    }
  }

  async updateAvatar(req, res, next) {
    const people_id = req.params.people_id;

    if (!people_id) {
      console.log("people_id参数错误", people_id);
      res.send({
        status: 0,
        type: "ERROR_PeopleID",
        message: "people_id参数错误",
      });
      return;
    }

    try {
      const form = new formidable.IncomingForm();
      form.uploadDir = `./public/img`;

      form.parse(req, async (err, fields, files) => {
        const image_path = await getPath(files, res, "people");
        await PeopleModel.findOneAndUpdate(
          { _id: people_id },
          { $set: { avatar: image_path } }
        );

        res.send({
          status: 1,
          data: image_path,
        });

        return;
      });
    } catch (err) {
      console.log("上传图片失败", err);
      res.send({
        status: 0,
        type: "ERROR_UPLOAD_IMG",
        message: "上传图片失败",
      });
      return;
    }
  }
}

export default new People();
