"use strict";

import people from "./people.js";
import news from "./news.js";

export default (app) => {
  app.use("/", people);
  app.use("/", news);
};
