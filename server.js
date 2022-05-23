const express = require("express");
// const { initializeApp } = require("firebase-admin/app");

const app = express();
const port = process.env.PORT || 4000;
const cors = require("cors");
app.use(cors());
app.get("/", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.send("The time is not secret!: " + new Date());
});

app.get("/secret", (req, res) => {
  console.log("req for secret: ", { headers: req.headers });

  try {
    const token = req.get("Authorization");
    console.log({ token });
    // res.set('Access-Control-Allow-Origin', '*');
    res.send("SECRET!!!!!!!!: " + randomSentence());
  } catch (err) {
    console.error(err);
    res.send("error! an error happened!");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function randomSentence() {
  const articles = ["the"];
  const nouns =
    "bus shark beatboxer love teacher poem thought cinnamon donut crepe bearclaw experiment science policy bear kangaroo shaman ninja robot pirate helicopter band riot song".split(
      " "
    );
  const verbs =
    "ate hugged murdered composed conceived analysed cooked sang".split(" ");
  const adjectives =
    "hungry blue imaginary lovely cinnamon violent sweet god-fearing abyssal nightmarish rainbow 70s musical smelly flowery well-intentioned creative owlish otherworldly".split(
      " "
    );
  return [articles, nouns, verbs, articles, nouns].map(pick).join(" ");
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
