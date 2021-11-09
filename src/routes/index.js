const express = require("express");

const accountRoutes = require("./account-routes");
const routes = express();

routes.use("/account", accountRoutes);

module.exports = routes;
