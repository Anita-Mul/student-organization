"use strict";

import path from "path";
import fs from "fs";
import formidable from "formidable";

export default async function (req, res, next) {
  return new Promise((resolve, reject) => {
    const form = formidable.IncomingForm();
    form.uploadDir = `./public/img/${req.imgType}`;

    form.parse(req, async (err, fields, files) => {
      const hashName = (
        new Date().getTime() + Math.ceil(Math.random() * 10000)
      ).toString(16);
      const extname = path.extname(files.file.name);

      if (![".jpg", ".jpeg", ".png"].includes(extname)) {
        fs.unlinkSync(files.file.path);
        res.send({
          status: 0,
          type: "ERROR_EXTNAME",
          message: "文件格式错误",
        });
        reject("上传失败");
        return;
      }

      const fullName = hashName + extname;
      const rePath = `./public/img/${req.imgType}` + fullName;

      try {
        // 改了名字就相当于移动了文件的位置
        fs.renameSync(files.file.path, rePath);
        resolve(fullName);
      } catch (err) {
        console.log("保存图片失败", err);
        if (fs.existsSync(rePath)) {
          fs.unlinkSync(rePath);
        } else {
          fs.unlinkSync(files.file.path);
        }
        reject("保存图片失败");
      }
    });
  });
}
