const express = require("express");
const { getSecretWisdom } = require("./bookOfSecrets");

const cors = require("cors");

const app = express();
app.use(cors());
const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Time (not secret): " + new Date());
});

app.get("/secret", (req, res) => {
  res.send("🤐: " + getSecretWisdom() + "🤫");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
