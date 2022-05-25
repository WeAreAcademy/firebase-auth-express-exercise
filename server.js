process.env.GOOGLE_APPLICATION_CREDENTIALS =
  "secret/firebase-service-account-secrets.json";

const express = require("express");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getSecretWisdom } = require("./bookOfSecrets");

const cors = require("cors");
initializeApp(); //Looks at env var `GOOGLE_APPLICATION_CREDENTIALS` for file path

const app = express();
app.use(cors());
const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("The time is not secret!: " + new Date());
});

app.get("/secret", (req, res) => {
  //Get authorization header value and trim "Bearer " prefix, to get idToken
  const authHeader = req.get("Authorization");
  if (!authHeader || authHeader.length < 20) {
    return res.status(401).send("no or bad auth header");
  }
  const idToken = authHeader.slice(7); //get rid of "Bearer " prefix

  //Verify and decode the token to see who we're talking to
  getAuth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      const uid = decodedToken.uid;
      console.log("VERIFIED TOKEN for user with uid: ", uid);

      //Verified, so they've earned access to the ancient wisdom!
      res.send("🤐: " + getSecretWisdom() + "🤫");

      //(Alternatively, we could go on to return only data created by the user with this uid)
    })
    .catch((error) => {
      console.error("Not a good token, so don't reveal secret");
      res
        .status(401)
        .send(
          "Error when trying to verify your token.  I will not reveal the ancient wisdom to you!"
        );
    });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
