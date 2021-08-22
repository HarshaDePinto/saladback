const express = require("express");
const { userById } = require("../controllers/userController");
const {
  requireLogin,
  isAuth,
  isAdmin,
} = require("../controllers/authController");

const router = express.Router();
router.param("userId", userById);
const {
  create,
  foodCategoryById,
  read,
  remove,
  update,
  photo1,
  photo2,
  homeFoodCategory,
  adminFoodCategoryList,
} = require("../controllers/foodCategoryController");
router.param("foodCategoryId", foodCategoryById);
router.get("/foodCategory/:foodCategoryId", read);
router.post(
  "/foodCategory/create/:userId",
  requireLogin,
  isAuth,
  isAdmin,
  create
);

router.delete(
  "/foodCategory/:foodCategoryId/:userId",
  requireLogin,
  isAdmin,
  isAuth,
  remove
);

router.put(
  "/foodCategory/:foodCategoryId/:userId",
  requireLogin,
  isAdmin,
  isAuth,
  update
);
router.get("/home/foodCategories", homeFoodCategory);
router.get("/admin/foodCategories", adminFoodCategoryList);
router.get("/foodCategory/photo1/:foodCategoryId/", photo1);
router.get("/foodCategory/photo2/:foodCategoryId/", photo2);
module.exports = router;