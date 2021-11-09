const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  const { username, email } = req.body;
  if (username && email) {
    User.findOne({
      where: {
        username,
      },
    }).then((user) => {
      if (user) {
        res.status(400).send({
          Success: false,
          ErrorMessage: "Failed! Username is already in use!",
          Results: null,
        });
        return;
      }

      // Email
      User.findOne({
        where: {
          email,
        },
      }).then((user) => {
        if (user) {
          res.status(400).send({
            Success: false,
            ErrorMessage: "Failed! Email is already in use!",
            Results: null,
          });
          return;
        }

        next();
      });
    });
  } else {
    return res.status(400).send({
      Success: false,
      ErrorMessage: "Invalid parameters passed to the body!",
      Results: null,
    });
  }
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          Success: false,
          ErrorMessage: `Failed!  ${req.body.roles[i]} does not exist`,
          Results: null,
        });
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted,
};

module.exports = verifySignUp;
