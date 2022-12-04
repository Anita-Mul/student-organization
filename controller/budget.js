"use strict";
import formidable from "formidable";

import BudgetModel from "../models/budget";
import ClubModel from "../models/club";

class Budget {
  constructor(props) {}

  async getBudgetWithBudgetId(req, res, next) {
    const budget_id = req.params.budget_id;

    if (!budget_id) {
      console.log("budget_id 参数错误", budget_id);
      res.send({
        status: 0,
        type: "ERROR_BUDGET_ID",
        message: "budget_id 参数错误",
      });
      return;
    }

    try {
      const budget = await BudgetModel.find({ _id: budget_id }, "-_id -__v");
      res.send({
        status: 1,
        data: budget,
      });
    } catch (err) {
      console.log("获取经费数据失败");
      res.send({
        status: 0,
        type: "ERROR_DATA",
        message: "获取经费数据失败",
      });
    }
  }

  async getBudgetWithClubId(req, res, next) {
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
      const budget = await BudgetModel.find({ club: club_id }, "-_id -__v");
      res.send({
        status: 1,
        data: budget,
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

  async getAllBudget(req, res, next) {
    try {
      const budgets = await BudgetModel.find({}, "-_id -__v");
      res.send({
        status: 1,
        data: budgets,
      });
    } catch (err) {
      console.log("获取经费数据失败");
      res.send({
        status: 0,
        type: "ERROR_DATA",
        message: "获取经费数据失败",
      });
    }
  }

  async addBudget(req, res, next) {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      const { club, input, description, money, state } = fields;

      try {
        if (!club) {
          throw new Error("必填经费所属社团");
        } else if (!input) {
          throw new Error("必填经费类型（收入[true] or 支出[false]）");
        } else if (!description) {
          throw new Error("必填经费描述");
        } else if (!money) {
          throw new Error("必填经费金额");
        } else if (!state) {
          throw new Error("必填经费状态（已批准[true] or 不批准[false]）");
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

      const budgetObj = {
        club,
        input,
        description,
        money,
        state,
      };

      const budget = new BudgetModel(budgetObj);
      try {
        const budget_id = await budget.save()._id;

        let belongClub = await ClubModel.findOne({ _id: club }).lean();
        belongClub.budget.push(budget_id);
        await ClubModel.findOneAndUpdate({ _id: club }, { $set: belongClub });

        res.send({
          status: 1,
          success: "添加经费成功",
        });
      } catch (err) {
        console.log("保存经费失败");
        res.send({
          status: 0,
          type: "ERROR_IN_SAVE_DATA",
          message: "保存经费失败",
        });
      }
    });
  }

  async deleteBudget(req, res, next) {
    const budget_id = req.params.budget_id;
    if (!budget_id) {
      console.log("budget_id参数错误");
      res.send({
        status: 0,
        type: "ERROR_PARAMS",
        message: "budget_id参数错误",
      });
      return;
    }
    try {
      const budget = await BudgetModel.findOne({ _id: budget_id });
      const club = await ClubModel.findOne({ _id: budget.lean().club }).lean();

      club.budget.splice(
        club.budget.findIndex((id) => id === budget_id),
        1
      );
      await ClubModel.findOneAndUpdate({ _id: club._id }, { $set: club });
      await budget.remove();

      res.send({
        status: 1,
        success: "删除经费成功",
      });
    } catch (err) {
      console.log("删除经费失败", err);
      res.send({
        status: 0,
        type: "DELETE_FOOD_FAILED",
        message: "删除经费失败",
      });
    }
  }

  async updateBudget(req, res, next) {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      const { id, club, input, description, money, state } = fields;

      try {
        if (!club) {
          throw new Error("必填经费所属社团");
        } else if (!input) {
          throw new Error("必填经费类型（收入[true] or 支出[false]）");
        } else if (!description) {
          throw new Error("必填经费描述");
        } else if (!money) {
          throw new Error("必填经费金额");
        } else if (!state) {
          throw new Error("必填经费状态（已批准[true] or 不批准[false]）");
        } else if (!id) {
          throw new Error("必填经费 id");
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

      const budgetObj = {
        club,
        input,
        description,
        money,
        state,
      };

      try {
        await BudgetModel.findOneAndUpdate({ _id: id }, { $set: budgetObj });

        res.send({
          status: 1,
          success: "更新经费成功",
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

  async updateBudgetState(req, res, next) {
    const budget_id = req.params.budget_id;
    const state = req.query.state;

    try {
      if (!budget_id) {
        throw new Error("必填经费 id");
      } else if (!state) {
        throw new Error("必填经费状态");
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
      await BudgetModel.findOneAndUpdate(
        { _id: budget_id },
        { $set: { state } }
      );

      res.send({
        status: 1,
        success: "更新经费状态成功",
      });

      return;
    } catch (err) {
      console.log("更新经费状态失败", err);
      res.send({
        status: 0,
        type: "ERROR_UPLOAD_IMG",
        message: "更新经费状态失败",
      });
      return;
    }
  }
}

export default new Budget();
