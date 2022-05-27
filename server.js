//TODO: move out of js into environment
process.env.GOOGLE_APPLICATION_CREDENTIALS =
  "secrets/firebase-service-account-secrets.json";

const express = require("express");
const { getAncientWisdom } = require("./bookOfAncientWisdom");
const cors = require("cors");

const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const firebaseApp = initializeApp();

console.log();
const app = express();
app.use(cors());

const port = process.env.PORT || 4000;

//This route stays public for all
app.get("/", (req, res) => {
  res.send("Time (not secret): " + new Date());
});

//TODO: Your task will be to secure this route to prevent access by those who are not, at least, logged in.
app.get("/wisdom", (req, res) => {
  const authHeaderValue = req.get("Authorization") || "";

  const [junk, accessToken] = authHeaderValue.split(" ");
  if (!accessToken || accessToken.length < 10) {
    console.log("ignoring user with bad or missing authorization header value");
    res.status(401).send("no or bad auth header");
    return;
  }
  getAuth()
    .verifyIdToken(accessToken)
    .then((decodedToken) => {
      console.log("HURRAY! verified token.  ", decodedToken);
      res.send("🤐: " + getAncientWisdom() + "🤫");
    })
    .catch((nope) => {
      res.status(401).send("your token didn't check out! no wisdom for you.");
    });

  //Eventual plan:
  //1. authHeader = get the value of the Authorization header
  //2. potentialToken = strip the "Bearer " prefix from authHeader
  //3. if (potentialToken is verified legit)
  //4.     return protected info in response
  //5. else
  //       say access denied in response
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
