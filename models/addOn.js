const mongoose = require("mongoose");

const addOnSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      unique:true,
      maxlength: 40,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    addType: {
      type: Number,
      trim: true,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AddOn", addOnSchema);
