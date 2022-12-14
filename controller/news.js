"use strict";
import formidable from "formidable";

import NewsModel from "../models/news";
import ClubModel from "../models/club";
import getPath from "../utils/getPath";
class News {
  constructor(props) {}

  async getNewsWithNewsId(req, res, next) {
    const news_id = req.params.news_id;

    if (!news_id) {
      console.log("news_id 参数错误", news_id);
      res.send({
        status: 0,
        type: "ERROR_ADMINID",
        message: "news_id 参数错误",
      });
      return;
    }

    try {
      const activities = await NewsModel.find({ _id: news_id }, "-_id -__v");
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

  async getNewsWithClubId(req, res, next) {
    const club_id = req.params.club_id;

    if (!club_id) {
      console.log("club_id 参数错误", club_id);
      res.send({
        status: 0,
        type: "ERROR_ADMINID",
        message: "club_id 参数错误",
      });
      return;
    }

    try {
      const activities = await NewsModel.find({ club: club_id }, "-_id -__v");
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

  async getAllNews(req, res, next) {
    try {
      const activities = await NewsModel.find({}, "-_id -__v");
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

  async addNews(req, res, next) {
    const form = new formidable.IncomingForm();
    form.uploadDir = `./public/img`;

    form.parse(req, async (err, fields, files) => {
      const { club, title, content, author } = fields;

      try {
        if (!club) {
          throw new Error("必填新闻所属社团");
        } else if (!title) {
          throw new Error("必填新闻标题");
        } else if (!content) {
          throw new Error("必填新闻内容");
        } else if (!author) {
          throw new Error("必填新闻作者");
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

      const image_path = await getPath(files, res, "news");

      const newsObj = {
        club,
        title,
        content,
        author,
        picture: image_path,
      };

      const news = new NewsModel(newsObj);
      try {
        await news.save(async function (err, result) {
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
          success: "添加新闻成功",
          image_path,
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

  async deleteNews(req, res, next) {
    const news_id = req.params.news_id;
    if (!news_id) {
      console.log("food_id参数错误");
      res.send({
        status: 0,
        type: "ERROR_PARAMS",
        message: "food_id参数错误",
      });
      return;
    }
    try {
      const news = await NewsModel.findOne({ _id: news_id });
      const club = await ClubModel.findOne({ _id: news._doc.club }).lean();

      club.news.splice(
        club.news.findIndex((id) => id === news_id),
        1
      );
      await ClubModel.findOneAndUpdate({ _id: club._id }, { $set: club });
      await news.remove();

      res.send({
        status: 1,
        success: "删除新闻成功",
      });
    } catch (err) {
      console.log("删除新闻失败", err);
      res.send({
        status: 0,
        type: "DELETE_FOOD_FAILED",
        message: "删除新闻失败",
      });
    }
  }

  async updateNews(req, res, next) {
    const form = new formidable.IncomingForm();
    form.uploadDir = `./public/img`;

    form.parse(req, async (err, fields, files) => {
      const { id, club, title, content, author, picture } = fields;

      try {
        if (!club) {
          throw new Error("必填新闻所属社团");
        } else if (!title) {
          throw new Error("必填新闻标题");
        } else if (!content) {
          throw new Error("必填新闻内容");
        } else if (!author) {
          throw new Error("必填新闻作者");
        } else if (!id) {
          throw new Error("必填新闻 id");
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

      const image_path = await getPath(files, res, "news");

      const newsObj = {
        club,
        title,
        content,
        author,
        picture: image_path,
      };

      try {
        await NewsModel.findOneAndUpdate({ _id: id }, { $set: newsObj });

        res.send({
          status: 1,
          success: "更新新闻成功",
          image_path,
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
}

export default new News();
