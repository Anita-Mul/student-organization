"use strict";

import people from "./people.js";

export default (app) => {
  app.use("/", people);
};
