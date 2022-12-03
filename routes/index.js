"use strict";

import people from "./people.js";
import news from "./news.js";
import budget from "./budget.js";

export default (app) => {
  app.use("/", people);
  app.use("/", news);
  app.use("/", budget);
};
