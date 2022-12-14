import express from "express";
import config from "config-lite";
import router from "./routes/index.js";
import db from "./mongodb/db.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import connectMongo from "connect-mongo";

import history from "connect-history-api-fallback";
import chalk from "chalk";

const app = express();

app.all("*", (req, res, next) => {
  // CORS 跨域
  const { origin, Origin, referer, Referer } = req.headers;
  const allowOrigin = origin || Origin || referer || Referer || "*";
  res.header("Access-Control-Allow-Origin", allowOrigin);
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("X-Powered-By", "Express");

  if (req.method == "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

const MongoStore = connectMongo(session);
app.use(cookieParser());

app.use(
  session({
    name: config.session.name,
    secret: config.session.secret,
    resave: true,
    saveUninitialized: false,
    cookie: config.session.cookie,
    store: new MongoStore({
      url: config.url,
    }),
  })
);

router(app);

app.use(history());
app.use(express.static("./public"));

app.listen(process.env.PORT || config.port, () => {
  console.log(chalk.green(`成功监听端口：${config.port}`));
});
