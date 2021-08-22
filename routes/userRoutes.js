const express = require("express");
const { userById, read, update } = require("../controllers/userController");
const { requireLogin, isAuth } = require("../controllers/authController");
const router = express.Router();

router.param("userId", userById);

router.get("/user/:userId", read);
router.put(
  "/user/:userId",
  requireLogin,
  isAuth,
  update
);

module.exports = router;
