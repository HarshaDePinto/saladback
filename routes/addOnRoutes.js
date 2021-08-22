const express = require("express");
const router = express.Router();


const {
  create,
  addOnById,
  read,
  update,
  remove,
  list,
  listID,
} = require("../controllers/addOnController");
const {
  requireLogin,
  isAuth,
  isAdmin,
} = require("../controllers/authController");

const { userById } = require("../controllers/userController");

router.get("/addOn/:addOnId", read);
router.post(
  "/addOn/create/:userId",
  requireLogin,
  isAuth,
  isAdmin,
  create
);

router.put(
  "/addOn/:addOnId/:userId",
  requireLogin,
  isAuth,
  isAdmin,
  update
);

router.delete(
  "/addOn/:addOnId/:userId",
  requireLogin,
  isAuth,
  isAdmin,
  remove
);
router.get("/addOns", list);
router.get("/addOns/addOnIds", listID);

router.param("addOnId", addOnById);
router.param("userId", userById);

module.exports = router;
