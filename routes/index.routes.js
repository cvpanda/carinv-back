const express = require("express");
const route = express.Router();
const { login } = require("../controller/user.controller");
const { verifyAccessToken } = require("../middlewere/jwt");

const userRoute = require("./user.routes");
const carRoute = require("./car.routes");
const dashboardRoute = require("./dashboard.routes");
const { cityState, carModel } = require("../controller/cityState.controller");
const { commission } = require("../controller/commission.controller");

route.use("/user", userRoute);
route.use("/dashboard", dashboardRoute);
route.post("/login", verifyAccessToken, login);
route.get("/citystate", verifyAccessToken, cityState);
route.get("/carmodel", verifyAccessToken, carModel);
route.use("/car", carRoute);
route.get("/commission", verifyAccessToken, commission);

module.exports = route;
