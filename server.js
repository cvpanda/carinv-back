const express = require("express");
const connection = require("./config/db");
const cors = require("cors");
const indexRoute = require("./routes/index.routes");

require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", express.static("public"));

connection();

const port = process.env.PORT;
app.use("/api", indexRoute);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
