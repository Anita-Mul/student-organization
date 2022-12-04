"use strict";

import people from "./people.js";
import news from "./news.js";
import budget from "./budget.js";
import activity from "./activity.js";
import club from "./club.js";

export default (app) => {
  app.use("/", people);
  app.use("/", news);
  app.use("/", budget);
  app.use("/", activity);
  app.use("/", club);
};
