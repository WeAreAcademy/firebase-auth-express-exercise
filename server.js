const express = require("express");
const { getAncientWisdom } = require("./bookOfAncientWisdom");
const { getAuth } = require("firebase-admin/auth");
const cors = require("cors");

const admin = require("firebase-admin");

if (process.env.NODE_ENV === "production") {
  //heroku, not local
  const base64Config = process.env.GOOGLE_CONFIG_BASE64;
  if (!base64Config) {
    console.error("no env var GOOGLE_CONFIG_BASE64");
    process.exit(1);
  }
  console.log("Got SECRET base64 config of length: ", base64Config?.length);
  const fromJSON = JSON.parse(
    Buffer.from(process.env.GOOGLE_CONFIG_BASE64, "base64").toString("ascii")
  );
  console.log("initialising firebase admin from GOOGLE_CONFIG_BASE64 env var");
  admin.initializeApp({ credential: admin.credential.cert(fromJSON) });
} else {
  //local
  process.env.GOOGLE_APPLICATION_CREDENTIALS =
    "./secrets/firebase-service-account-secrets.json";
  console.log("initialising firebase admin from local file");
  admin.initializeApp();
}
const app = express();
app.use(cors());

const port = process.env.PORT || 4000;

//This route stays public for all
app.get("/", (req, res) => {
  res.send("Time (not secret): " + new Date());
});

//TODO: Your task will be to secure this route to prevent access by those who are not, at least, logged in.
app.get("/wisdom", async (req, res) => {
  const authHeaderVal = req.header("Authorization");

  if (!authHeaderVal || authHeaderVal.length < 20) {
    res.status(401).send("No authorization header (or it is too short)");
    console.log("ignoring request with no (or short) auth header");
    return;
  }
  const idToken = authHeaderVal.slice(7);
  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    console.log("VERIFIED TOKEN.  uid: ", decodedToken.uid);
    res.send("🤐: " + getAncientWisdom() + "🤫");
  } catch (err) {
    res.status(401).send("token did not verify");
  }
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
