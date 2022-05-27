process.env.GOOGLE_APPLICATION_CREDENTIALS =
  "./secrets/firebase-service-account-secrets.json";

const express = require("express");
const { getAncientWisdom } = require("./bookOfAncientWisdom");
const { getAuth } = require("firebase-admin/auth");
const cors = require("cors");

const admin = require("firebase-admin");
admin.initializeApp();
const app = express();
app.use(cors());

const port = process.env.PORT || 4000;

//This route stays public for all
app.get("/", (req, res) => {
  res.send("Time (not secret): " + new Date());
});

//(this is a middleware function)
//if the request has a verified accessToken in Authorization header,
//then it puts the user id in as req.uid and proceeds to the next handler
//else it replies to the client immediately with a 401 and stops the flow.
async function checkIsAuthenticated(req, res, next) {
  const authHeaderVal = req.header("Authorization");

  if (!authHeaderVal) {
    res.status(401).send("No authorization header.");
    return;
  }
  const idToken = authHeaderVal.slice(7);
  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    //put whatever you like into the request, for your route handlers to make use of.
    req.uid = decodedToken.uid;
    next();
  } catch (err) {
    res.status(401).send("Token did not verify.");
  }
}
app.get("/wisdom", checkIsAuthenticated, async (req, res) => {
  //@ts-ignore // ts doesn't think there's a uid on the request object.
  console.log("uid: ", req.uid);
  res.send("🤐: " + getAncientWisdom() + "🤫");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
