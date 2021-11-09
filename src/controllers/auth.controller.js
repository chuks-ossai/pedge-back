const crypto = require("crypto");
var jwt = require("jsonwebtoken");

const db = require("../models");
const config = require("../configs/auth.config");

const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;

exports.signup = (req, res) => {
  console.log("encrypt", encryptPassword(req.body.password));
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: encryptPassword(req.body.password),
  })
    .then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid =
        encryptPassword(req.body.password) === user.password;

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

function encryptPassword(password) {
  if (!password) return "";
  return crypto
    .pbkdf2Sync(
      password,
      process.env.PASSWORD_ENCRIPTION_SALT,
      1000,
      64,
      `sha512`
    )
    .toString(`hex`);
}
