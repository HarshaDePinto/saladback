const formidable = require("formidable");
const AddOn = require("../models/addOn");
const _ = require("lodash");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtension = true;
  form.parse(req, (error, fields) => {
    if (error) {
      return res.status(400).json({
        error: "Add On can not be uploaded",
      });
    }
    let { title, price, available,addType } = fields;
    if (!title || !price || !available || !addType) {
      return res.status(400).json({
        error: "All fields required",
      });
    }
   
    let addOn = new AddOn(fields);

    addOn.save((error, data) => {
      if (error) {
        return res.status(400).json({
          error: errorHandler(error),
        });
      }
      res.json(data);
    });
  });
};

exports.addOnById = (req, res, next, id) => {
  AddOn.findById(id).exec((error, addOn) => {
    if (error || !addOn) {
      res.status(400).json({
        error: "Add On not found",
      });
    }
    req.addOn = addOn;
    next();
  });
};

exports.read = (req, res) => {
  return res.json(req.addOn);
};

exports.remove = (req, res) => {
  let addOn = req.addOn;
  addOn.remove((error, deletedAddOn) => {
    if (error) {
      return res.status(400).json({
        error: errorHandler(error),
      });
    }
    res.json({ message: "Add On deleted successfully" });
  });
};

exports.update = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields) => {
    if (err) {
      return res.status(400).json({
        error: "Add On can not be uploaded",
      });
    }

    let addOn = req.addOn;
    addOn = _.extend(addOn, fields);
   

    addOn.save((err, data) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(data);
    });
  });
};


exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  AddOn.find()
    .sort({ [sortBy]: [order] })
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(data);
    });
};

exports.frontAddOn = (req, res) => {
  AddOn.find({ available: "true" })
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(data);
    });
};

exports.listID = (req, res) => {
  AddOn.distinct('_id', {}, (err, addOnIds) => {
      if (err) {
          return res.status(400).json({
              error: 'Ads ons not found'
          });
      }
      res.json(addOnIds);
  });
};
