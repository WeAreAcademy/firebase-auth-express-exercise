//Not an important function at all.
/** Return a fun sentence (string) which we'll pretend is wisdom to be protected. */
function getAncientWisdom() {
  const articles = ["the"];
  const nouns =
    "arrest-warrant band bear bearclaw beatboxer board-game boardgamer boyfriend bus call-centre cinnamon coroner cowboy crepe detective dog donut dungeon-master experiment falcon game girlfriend good-bye helicopter icon kangaroo love magician ninja ore particle-accelerator piano pirate pizza playwright poem policy potato reviewer rhyme riot robot rule-book science screenplay shaman shark song space-mobile submarine summoning teacher theory thought worker".split(
      " "
    );
  const adjectives =
    "70s abyssal apocalyptic blue burnt-out cinnamon creative dragon-borne drug-addicted eloquent enlightened flimsy flowery giant glowing god-fearing golden hallucinatory hungry imaginary immobile lovely miniature musical mythical nightmarish ninja obnoxious otherworldly owlish parallel-universe peanut-butter-covered pirate poorly-written radioactive rainbow rusty smelly stealthy sugar-coated sweet sweet tearful unconscious violent virtual weapon-grade well-intentioned".split(
      " "
    );
  const verbs =
    "analysed arrested ate befuddled betrayed chastised composed compromised conceived confused cooked coveted created fed fought harassed hugged invented killed kissed murdered nagged painted praised programmed robbed sang seduced serenaded sued suffocated summoned taught tutored treated wrestled".split(
      " "
    );
  const sentenceAsArray = [
    articles,
    adjectives,
    nouns,
    verbs,
    articles,
    adjectives,
    nouns,
  ].map(pick);

  return sentenceAsArray.join(" ");
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = { getAncientWisdom };
