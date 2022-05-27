/** 
Initialises firebase-admin app with credentials either from
a local json file or from a base64-encoded env var, for local or production, respectively.
*/
function initFirebaseAdminApp(admin) {
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
    console.log(
      "initialising firebase admin from GOOGLE_CONFIG_BASE64 env var"
    );
    admin.initializeApp({ credential: admin.credential.cert(fromJSON) });
  } else {
    //local
    process.env.GOOGLE_APPLICATION_CREDENTIALS =
      "./secrets/firebase-service-account-secrets.json";
    console.log("initialising firebase admin from local file");
    admin.initializeApp();
  }
}

module.exports = { initFirebaseAdminApp };
