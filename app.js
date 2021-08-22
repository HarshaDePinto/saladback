const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const cors = require("cors");
require("dotenv").config();

//import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const mainSliderRoutes = require("./routes/mainSliderRoutes");
const foodCategoryRoutes = require("./routes/foodCategoryRoutes");
const setMealRoutes = require("./routes/setMealRoutes");
const addOnRoute = require("./routes/addOnRoutes");

//App
const app = express();
require("dotenv").config();

//db connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    createIndexes: true,
  })
  .then(() => console.log("DB Connected"));

mongoose.connection.on("error", (err) => {
  console.log(`DB Connection Error: ${err.message}`);
});

//Middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

//Routes middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", mainSliderRoutes);
app.use("/api", foodCategoryRoutes);
app.use("/api", setMealRoutes);
app.use("/api", addOnRoute);
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
