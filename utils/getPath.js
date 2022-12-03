"use strict";

import path from "path";
import fs from "fs";

async function getPath(files, res, dir) {
  return new Promise((resolve, reject) => {
    if (!files.file) {
      resolve("default.jpg");
      console.log("未上传图片，使用默认图片");
      return;
    }

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
    const rePath = `./public/img/${dir}/` + fullName;

    try {
      // 改了名字就相当于移动了文件的位置
      fs.renameSync(files.file.path, rePath);
      resolve(`img/${dir}/` + fullName);
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
}

export default getPath;
