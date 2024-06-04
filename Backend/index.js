const express = require("express");
const app = express();
require('dotenv').config();

const mongoDb = require("./db");

mongoDb();
const port = 4000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
