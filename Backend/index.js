const express = require("express");
const app = express();
require("dotenv").config();

const mongoDb = require("./db");

mongoDb();
const port = 4000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use((req, res, next) => {
  const allowedOrigin = req.headers.origin || '*';
  
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Include additional HTTP methods
  res.header("Access-Control-Allow-Credentials", true); // Allow credentials (if needed)
  
  if (req.method === 'OPTIONS') {
      res.sendStatus(200); // Respond to preflight requests
  } else {
      next();
  }
});

app.use(express.json());

app.use("/api", require("./routes/CreateUser"));

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
