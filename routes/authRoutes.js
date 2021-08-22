const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/authController");
const { userSignupValidator } = require("../validator/index");

router.post("/register", userSignupValidator, register);
router.post("/login", login);
router.get("/logout", logout);

module.exports = router;
