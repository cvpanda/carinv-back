const express = require("express");
const { verifyAccessToken } = require("../middlewere/jwt");
const {
  charges,
  purchaseChart,
  salesChart,
  inventoryChart,
  marginChart,
} = require("../controller/dashboard.controller");
const route = express.Router();

route.get("/charges/:id", charges);
route.get("/purchase/:id", verifyAccessToken, purchaseChart);
route.get("/sales/:id", verifyAccessToken, salesChart);
route.get("/inventory/:id", verifyAccessToken, inventoryChart);
route.get("/margin/:id", verifyAccessToken, marginChart);

module.exports = route;
