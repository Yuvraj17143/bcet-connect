// backend/src/app.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes");
const { PORT } = require("./config/env");
const errorHandler = require("./middleware/errorHandler");
const app = express();
app.use(cors());               
app.use(express.json());       
app.use(morgan("dev"));        
app.get("/", (req, res) => {
  res.send(`BCET CONNECT API running on port ${PORT}`);
});
app.use("/api", routes);
app.use(errorHandler); 
module.exports = app;
