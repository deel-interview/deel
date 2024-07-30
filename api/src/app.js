const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { sequelize } = require("./models/model");

const app = express();
const routes = require("./routes");
//add cors

app.use(cors());
app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

// /**
//  * FIX ME!
//  * @returns contract by id
//  */
// app.get("/contracts/:id", getProfile, async (req, res) => {
//   const { Contract } = req.app.get("models");
//   const { id } = req.params;
//   const contract = await Contract.findOne({ where: { id } });
//   if (!contract) return res.status(404).end();
//   res.json(contract);
// });

app.use("/", routes);
module.exports = app;
