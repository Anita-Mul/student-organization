"use strict";

module.exports = {
  port: parseInt(process.env.PORT, 10) || 3000,
  // url: "mongodb://Anita-Sun:19631010@ac-aomk4od-shard-00-00.mxgtqc7.mongodb.net:27017,ac-aomk4od-shard-00-01.mxgtqc7.mongodb.net:27017,ac-aomk4od-shard-00-02.mxgtqc7.mongodb.net:27017/?ssl=true&replicaSet=atlas-pwsa8a-shard-0&authSource=admin&retryWrites=true&w=majority",
  url: "mongodb://127.0.0.1:27017/student-organization",
  session: {
    name: "SID",
    secret: "SID",
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: 365 * 24 * 60 * 60 * 1000,
    },
  },
};
