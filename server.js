if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const morgan = require("morgan");
const express = require("express");
const cors = require("cors");
const db = require("./src/models");
const routes = require("./src/routes");
const port = process.env.PORT || 7622;

const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.json({ limit: "5mb", type: "application/json" }));
server.use(
  cors({
    origin: "*",
  })
);
server.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});
server.use("/api/v1", routes);

const Role = db.role;

function initial() {
  Role.create({
    name: "user",
  });

  Role.create({
    name: "moderator",
  });

  Role.create({
    name: "admin",
  });
}

db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and Resync Db");
  initial();
});

server.listen(port, () => {
  console.log(`Server connected to db and listening on port ${port}`);
});
