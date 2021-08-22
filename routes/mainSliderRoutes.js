const express = require("express");
const {
  create,
  mainSlideById,
  read,
  remove,
  update,
  photo,
  list,
  frontSlide,
} = require("../controllers/mainSliderController");
const { userById } = require("../controllers/userController");
const {
  requireLogin,
  isAuth,
  isAdmin,
} = require("../controllers/authController");
const router = express.Router();

router.param("userId", userById);
router.param("mainSlideId", mainSlideById);

router.get("/mainSlide/:mainSlideId", read);
router.post(
  "/mainSlider/create/:userId",
  requireLogin,
  isAuth,
  isAdmin,
  create
);

router.delete(
  "/mainSlide/:mainSlideId/:userId",
  requireLogin,
  isAdmin,
  isAuth,
  remove
);
router.put(
  "/mainSlide/:mainSlideId/:userId",
  requireLogin,
  isAdmin,
  isAuth,
  update
);
router.get("/mainSlides", list);
router.get("/frontSlides", frontSlide);
router.get("/mainSlide/photo/:mainSlideId/", photo);
module.exports = router;
