process.env.GOOGLE_APPLICATION_CREDENTIALS =
  "secret/cohort4-auth-demo-firebase-adminsdk-7z5zx-641aa67888.json";
const express = require("express");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const cors = require("cors");

initializeApp(); //default credential

const app = express();
app.use(cors());
const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
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
      res.send("SECRET!!!!!!!!: " + randomSentence());
    })
    .catch((error) => {
      console.error("NOT A GOOD TOKEN - don't reveal secret");
      res.send("I will not reveal the secrets to you!"); //in reality we'd send a 401 status?
    });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

function randomSentence() {
  const articles = ["the"];
  const nouns =
    "bus shark falcon beatboxer love teacher poem thought cinnamon donut crepe bearclaw experiment science policy bear kangaroo shaman ninja robot pirate helicopter band riot song".split(
      " "
    );
  const verbs =
    "ate hugged murdered composed conceived analysed cooked sang wrestled petted fed tutored neuralyzed".split(
      " "
    );
  const adjectives =
    "hungry blue imaginary peanut-butter-covered lovely cinnamon violent sweet god-fearing sugar-coated weapon-grade apocalyptic abyssal nightmarish rainbow 70s musical smelly flowery well-intentioned creative owlish otherworldly".split(
      " "
    );
  return [articles, adjectives, nouns, verbs, articles, nouns]
    .map(pick)
    .join(" ");
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
