const express = require("express");
const router = express.Router();

const {
  create,
  setMealById,
  read,
  remove,
  update,
  list,
  listRelated,
  listCategories,
  listBySearch,
  photo,
  listSearch,
  listByCategory,
} = require("../controllers/setMealController");
const { foodCategoryById } = require("../controllers/foodCategoryController");
const { userById } = require("../controllers/userController");
const {
  requireLogin,
  isAuth,
  isAdmin,
} = require("../controllers/authController");
router.param("userId", userById);
router.param("setMealId", setMealById);
router.param("foodCategoryId", foodCategoryById);

router.get("/setMeal/:setMealId", read);
router.post("/setMeal/create/:userId", requireLogin, isAuth, isAdmin, create);
router.delete(
  "/setMeal/:setMealId/:userId",
  requireLogin,
  isAuth,
  isAdmin,
  remove
);

router.put(
  "/setMeal/:setMealId/:userId",
  requireLogin,
  isAuth,
  isAdmin,
  update
);

router.get("/setMeals", list);
router.get("/setMeals/search", listSearch);
router.get("/setMeals/related/:setMealId", listRelated);
router.get("/setMeals/categories", listCategories);
router.post("/setMeals/by/search", listBySearch);
router.get("/setMeal/photo/:setMealId", photo);
router.get("/setMeals/byCategory/:foodCategoryId", listByCategory);
module.exports = router;
