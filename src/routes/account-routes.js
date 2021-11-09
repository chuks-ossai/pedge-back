const express = require("express");
const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");

const router = express.Router();

router.post(
  "/create",
  [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
  controller.signup
);

router.post("/login", controller.signin);

router.get("/user", (req, res) => {
  res.status(200).json({
    Success: true,
    ErrorMessage: null,
    Results: "Details of User should be here",
  });
});

module.exports = router;
