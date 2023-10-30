const express = require("express");
const {
  publishcar,
  addnewcar,
  sellcar,
  allcar,
  readcarByUserId,
  readcarById,
  updateInspectionDate,
  addTask,
  addcharge,
  addcommission,
} = require("../controller/car.controller");
const { verifyAccessToken } = require("../middlewere/jwt");
const route = express.Router();

route.post("/add", verifyAccessToken, addnewcar);
route.get("/user/:userid", verifyAccessToken, readcarByUserId);
route.get("/:carid", verifyAccessToken, readcarById);
route.post("/add-task/:id", verifyAccessToken, addTask);
route.post("/inspection-date/:id", verifyAccessToken, updateInspectionDate);
route.get("/allcar", verifyAccessToken, allcar);
route.post("/publish/:id", verifyAccessToken, publishcar);
route.post("/sell/:id", verifyAccessToken, sellcar);
route.post("/addcharge/:id", verifyAccessToken, addcharge);
route.post("/addcommission/:id", verifyAccessToken, addcommission);
module.exports = route;
