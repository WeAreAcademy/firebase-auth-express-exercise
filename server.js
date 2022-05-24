process.env.GOOGLE_APPLICATION_CREDENTIALS =
  "secret/cohort4-auth-demo-firebase-adminsdk-7z5zx-641aa67888.json";
const express = require("express");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getSecretWisdom } = require("./bookOfSecrets");

const cors = require("cors");
initializeApp(); //default credential

const app = express();
app.use(cors());
const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("The time is not secret!: " + new Date());
});

app.get("/secret", (req, res) => {
  console.log("req for secret: ", { headers: req.headers });
  const authHeader = req.get("Authorization");
  if (!authHeader || authHeader.length < 20) {
    return res.status(401).send("no or bad auth header");
  }
  const idToken = authHeader.slice(7); //get rid of "Bearer " prefix

  getAuth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      const uid = decodedToken.uid;
      console.log("VERIFIED TOKEN", uid, decodedToken);
      res.send("🤐: " + getSecretWisdom() + "🤫");
    })
    .catch((error) => {
      console.error("NOT A GOOD TOKEN - don't reveal secret");
      res.send("I will not reveal the secrets to you!"); //in reality we'd send a 401 status?
    });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
