const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const SetMeal = require("../models/SetMeal");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.setMealById = (req, res, next, id) => {
  SetMeal.findById(id)
    .populate("FoodCategory")
    .exec((err, setMeal) => {
      if (err || !setMeal) {
        return res.status(400).json({
          error: "Set Meal not found",
        });
      }
      req.setMeal = setMeal;
      next();
    });
};

exports.read = (req, res) => {
  req.setMeal.photo = undefined;
  return res.json(req.setMeal);
};

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }
    // check for all fields
    const { title, subtitle, description, category, price, calorie } = fields;

    if (
      !title ||
      !subtitle ||
      !description ||
      !category ||
      !price ||
      !calorie
    ) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    let setMeal = new SetMeal(fields);

    // 1kb = 1000
    // 1mb = 1000000

    if (files.photo) {
      // console.log("FILES PHOTO: ", files.photo);
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1mb in size",
        });
      }
      setMeal.photo.data = fs.readFileSync(files.photo.path);
      setMeal.photo.contentType = files.photo.type;
    }

    setMeal.save((err, result) => {
      if (err) {
        console.log("SET MEAL CREATE ERROR ", err);
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(result);
    });
  });
};

exports.remove = (req, res) => {
  let setMeal = req.setMeal;
  setMeal.remove((err, deletedSetMeal) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Set Meal deleted successfully",
    });
  });
};

exports.update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }

    let setMeal = req.setMeal;
    setMeal = _.extend(setMeal, fields);

    // 1kb = 1000
    // 1mb = 1000000

    if (files.photo) {
      // console.log("FILES PHOTO: ", files.photo);
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1mb in size",
        });
      }
      setMeal.photo.data = fs.readFileSync(files.photo.path);
      setMeal.photo.contentType = files.photo.type;
    }

    setMeal.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(result);
    });
  });
};

exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  SetMeal.find()
    .select("-photo")
    .populate("FoodCategory")
    .limit(limit)
    .exec((err, setMeals) => {
      if (err) {
        return res.status(400).json({
          error: "Set Meals not found",
        });
      }
      res.json(setMeals);
    });
};

exports.listByCategory = (req, res) => {
  SetMeal.find({ category: req.foodCategory._id })
    .select("-photo")
    .populate("FoodCategory")
    .exec((err, setMeals) => {
      if (err) {
        return res.status(400).json({
          error: "Set Meals not found",
        });
      }
      res.json(setMeals);
    });
};

exports.listRelated = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;
  SetMeal.find({ _id: { $ne: req.setMeal }, category: req.setMeal.category })
    .limit(limit)
    .populate("FoodCategory", "_id title")
    .exec((err, setMeals) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(setMeals);
    });
};

exports.listCategories = (req, res) => {
  SetMeal.distinct("category", {}, (err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "Categories not found",
      });
    }
    res.json(categories);
  });
};

exports.listBySearch = (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  console.log(order, sortBy, limit, skip, req.body.filters);
  console.log("findArgs", findArgs);

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  SetMeal.find(findArgs)
    .select("-photo")
    .populate("FoodCategory")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Set Meals not found",
        });
      }
      res.json({
        size: data.length,
        data,
      });
    });
};

exports.photo = (req, res, next) => {
  if (req.setMeal.photo.data) {
    res.set("Content-Type", req.setMeal.photo.contentType);
    return res.send(req.setMeal.photo.data);
  }
  next();
};

exports.listSearch = (req, res) => {
  // create query object to hold search value and category value
  const query = {};
  // assign search value to query.name
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: "i" };
    // assigne category value to query.category
    if (req.query.category && req.query.category != "All") {
      query.category = req.query.category;
    }
    // find the product based on query object with 2 properties
    // search and category
    SetMeal.find(query, (err, setMeals) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(setMeals);
    }).select("-photo");
  }
};
