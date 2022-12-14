"use strict";

import crypto from "crypto";
import formidable from "formidable";
import dtime from "time-formater";

import PeopleModel from "../models/people";
import ClubModel from "../models/club";
import ApplyAdminModel from "../models/applyAdmin";
import getPath from "../utils/getPath";

const ADMIN = "Admin";
const USER = "User";
const LEADER = "Leader";

class People {
  constructor() {
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
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

      const { user_name, password, institute = "", phone = "" } = fields;

      try {
        if (!user_name) {
          throw new Error("用户名错误");
        } else if (!password) {
          throw new Error("密码错误");
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
            type: "User",
            create_time: dtime().format("YYYY-MM-DD"),
            institute,
            phone,
          };

          const findPeople = await PeopleModel.create(newPeople);

          req.session.people_id = findPeople._id;

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

  async getPeopleInfo(req, res, next) {
    const people_id = req.params.people_id;

    if (!people_id) {
      res.send({
        status: 0,
        type: "ERROR_PARAMS",
        message: "people_id 必填",
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

  async applyClubLeader(req, res, next) {
    const people_id = req.session.people_id;
    // const people_id = "638caafd2e55e96b382c616a";
    const club = req.query.club;

    try {
      if (!people_id) {
        throw new Error("登录过期，请重新登录");
      } else if (!club) {
        throw new Error("社团必填");
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
      let oneClub = await ClubModel.findOne({ _id: club }).lean();
      oneClub.applyLeader.push(people_id);
      await ClubModel.findOneAndUpdate({ _id: club }, { $set: oneClub });

      res.send({
        status: 1,
        message: "添加 club leader 成功",
      });

      return;
    } catch (err) {
      console.log("添加 club leader 失败", err);
      res.send({
        status: 0,
        type: "ERROR_ADD_CLUB_LEADER",
        message: "添加 club leader 失败",
      });
      return;
    }
  }

  async applyClubUser(req, res, next) {
    const people_id = req.session.people_id;
    // const people_id = "638cab832e55e96b382c616b";
    const club = req.query.club;

    try {
      if (!people_id) {
        throw new Error("登录过期，请重新登录");
      } else if (!club) {
        throw new Error("社团必填");
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
      let oneClub = await ClubModel.findOne({ _id: club }).lean();
      oneClub.applyMember.push(people_id);
      await ClubModel.findOneAndUpdate({ _id: club }, { $set: oneClub });

      res.send({
        status: 1,
        message: "添加 club member 成功",
      });

      return;
    } catch (err) {
      console.log("添加 club member 失败", err);
      res.send({
        status: 0,
        type: "ERROR_ADD_CLUB_MEMBER",
        message: "添加 club member 失败",
      });
      return;
    }
  }

  async applyAdmin(req, res, next) {
    // const people_id = req.session.people_id;
    const people_id = "638cab9c2e55e96b382c616c";

    try {
      if (!people_id) {
        throw new Error("登录过期，请重新登录");
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
      let applyAdmin = await ApplyAdminModel.findOne({}).lean();
      if (applyAdmin == null) {
        const tempApplyAdmin = new ApplyAdminModel({ applyAdminPeople: [] });
        await tempApplyAdmin.save();
      }

      applyAdmin = await ApplyAdminModel.findOne({}).lean();
      applyAdmin.applyAdminPeople.push(people_id);
      await ApplyAdminModel.findOneAndUpdate({}, { $set: applyAdmin });

      res.send({
        status: 1,
        message: "添加 admin 成功",
      });

      return;
    } catch (err) {
      console.log("添加 admin 失败", err);
      res.send({
        status: 0,
        type: "ERROR_ADD_ADMIN",
        message: "添加 admin 失败",
      });
      return;
    }
  }

  async getClubApplyLeader(req, res, next) {
    const { club } = req.query;
    let leadersInfo = [];

    try {
      const allClub = await ClubModel.findOne({
        _id: club,
      }).lean();

      await allClub.applyLeader.forEach(async (leader, index) => {
        const leaderInfo = await PeopleModel.findOne(
          {
            _id: leader,
          },
          "-_id -password -__v"
        ).lean();

        leadersInfo.push(leaderInfo);

        if (index === allClub.applyLeader.length - 1) {
          res.send({
            status: 1,
            data: leadersInfo,
          });
        }
      });
    } catch (err) {
      console.log("获取 Club Leader 列表失败", err);
      res.send({
        status: 0,
        type: "ERROR_GET_People_LIST",
        message: "获取 Club Leader 列表失败",
      });
    }
  }

  async getClubApplyUser(req, res, next) {
    const { club } = req.query;
    let usersInfo = [];

    try {
      const allClub = await ClubModel.findOne({
        _id: club,
      }).lean();

      allClub.applyMember.forEach(async (member, index) => {
        const memberInfo = await PeopleModel.findOne(
          {
            _id: member,
          },
          "-_id -password -__v"
        ).lean();

        usersInfo.push(memberInfo);

        if (index === allClub.applyMember.length - 1) {
          res.send({
            status: 1,
            data: usersInfo,
          });
        }
      });
    } catch (err) {
      console.log("获取 Club Member 列表失败", err);
      res.send({
        status: 0,
        type: "ERROR_GET_People_LIST",
        message: "获取 Club Member 列表失败",
      });
    }
  }

  async getApplyAdmin(req, res, next) {
    let usersInfo = [];

    try {
      const allAdmin = await ApplyAdminModel.findOne({}).lean();

      allAdmin.applyAdminPeople.forEach(async (adminPeople, index) => {
        const memberInfo = await PeopleModel.find(
          {
            _id: adminPeople,
          },
          "-_id -password -__v"
        ).lean();

        usersInfo.push(memberInfo);

        if (index === allAdmin.applyAdminPeople.length - 1) {
          res.send({
            status: 1,
            data: usersInfo,
          });
        }
      });
    } catch (err) {
      console.log("获取 Admin 列表失败", err);
      res.send({
        status: 0,
        type: "ERROR_GET_People_LIST",
        message: "获取 Admin 列表失败",
      });
    }
  }

  async addClubLeader(req, res, next) {
    const people_id = req.query.people_id;
    const club = req.query.club;

    try {
      if (!people_id) {
        throw new Error("people id 必填");
      } else if (!club) {
        throw new Error("社团必填");
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
      let people = await PeopleModel.findOne({ _id: people_id }).lean();
      people.manageClub.push(club);
      await PeopleModel.findOneAndUpdate({ _id: people_id }, { $set: people });

      let belongClub = await ClubModel.findOne({ _id: club }).lean();
      belongClub.applyLeader.forEach((item, index) => {
        if (item === people_id) {
          belongClub.applyLeader.splice(index, 1);
        }
      });
      belongClub.leader.push(people_id);
      await ClubModel.findOneAndUpdate({ _id: club }, { $set: belongClub });

      res.send({
        status: 1,
        message: "添加 club leader 成功",
      });

      return;
    } catch (err) {
      console.log("添加 club leader 失败", err);
      res.send({
        status: 0,
        type: "ERROR_ADD_CLUB_LEADER",
        message: "添加 club leader 失败",
      });
      return;
    }
  }

  async addClubUser(req, res, next) {
    const people_id = req.query.people_id;
    const club = req.query.club;

    try {
      if (!people_id) {
        throw new Error("people id 必填");
      } else if (!club) {
        throw new Error("社团必填");
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
      let people = await PeopleModel.findOne({ _id: people_id }).lean();
      people.club.push(club);
      await PeopleModel.findOneAndUpdate({ _id: people_id }, { $set: people });

      let belongClub = await ClubModel.findOne({ _id: club }).lean();
      belongClub.applyMember.forEach((item, index) => {
        if (item === people_id) {
          belongClub.applyMember.splice(index, 1);
        }
      });
      belongClub.member.push(people_id);
      await ClubModel.findOneAndUpdate({ _id: club }, { $set: belongClub });

      res.send({
        status: 1,
        message: "添加 club user 成功",
      });

      return;
    } catch (err) {
      console.log("添加 club user 失败", err);
      res.send({
        status: 0,
        type: "ERROR_ADD_CLUB_USER",
        message: "添加 club user 失败",
      });
      return;
    }
  }

  async addAdmin(req, res, next) {
    const people_id = req.query.people_id;

    try {
      if (!people_id) {
        throw new Error("people id 必填");
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
      let people = await PeopleModel.findOne({ _id: people_id }).lean();
      people.type = "Admin";
      await PeopleModel.findOneAndUpdate({ _id: people_id }, { $set: people });

      let applyAdmin = await ApplyAdminModel.findOne({}).lean();
      applyAdmin.applyAdminPeople.forEach((item, index) => {
        if (item === people_id) {
          console.log(item);
          applyAdmin.applyAdminPeople.splice(index, 1);
        }
      });
      await ApplyAdminModel.findOneAndUpdate({}, { $set: applyAdmin });

      res.send({
        status: 1,
        message: "添加 club Admin 成功",
      });

      return;
    } catch (err) {
      console.log("添加 club user 失败", err);
      res.send({
        status: 0,
        type: "ERROR_ADD_CLUB_USER",
        message: "添加 club user 失败",
      });
      return;
    }
  }
}

export default new People();
