const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const SetMealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 40,
    },
    subtitle: {
      type: String,
      trim: true,
      required: true,
      maxlength: 60,
    },
    description: {
      type: String,
      trim: true,
      required: true,
      maxlength: 2000,
    },

    time: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      trim: true,
      required: true,
    },

    photo: {
      data: Buffer,
      contentType: String,
    },
    category: {
      type: ObjectId,
      ref: "foodCategory",
      required: true,
    },

    sold: {
      type: Number,
    },
    rating: {
      type: Number,
      default:2.5,
    },
    totalRating: {
      type: Number,
    },
    discount: {
      type: Number,
      default:0,
    },
    discountPrice: {
      type: Number,
    },
    calorie: {
      type: Number,
    },

    flavors: {
      type: Array,
    },
    
    trending: {
      type: Boolean,
    },
    label: {
      type: Boolean,
    },
    combo: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SetMeal", SetMealSchema);
