
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Qassem Digital Archive API Running" });
});

app.listen(5000, () => {
  console.log("Server running");
});
