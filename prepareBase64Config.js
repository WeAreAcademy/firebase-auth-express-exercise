/**

## Tool for preparing firebase credentials for heroku deployment

This program squishes and logs your secret service-account config into a base64-encoded
string suitable for an env var value on heroku.

WARNING: logs sensitive information to console.

### More detail
We have to do something clunky to get the details of our service account credentials loaded by heroku.

Heroku doesn't let you store _files_, only env vars. We could create multiple env vars on heroku (one for each key-value pair in the service account json) and then reassemble the credentials object piece by piece, but instead we're going to squish the service-account credentials down to one "base64" encoded string, and store _that_ as a single env var on heroku. Here's how:

### Steps:

0. Ensure the `secrets/` folder is git-ignored as a whole. (We're about to add something sensitive to it.)
1. Ensure your service account credentials are in exactly `secrets/firebase-service-account-secrets.json`
2. run `node prepareBase64Config.js > secrets/base64Secret.txt`
3. In your heroku dashboard for your app, go to settings, then "reveal config vars"
4. Add a config var with a key of GOOGLE_CONFIG_BASE64 and for its value, copy and paste the exact contents of base64Secret.txt, making sure to get it all very precisely - no extra spaces, no missing characters.
5. In the top right of heroku dashboard, choose more: restart all dynos
*/

const config = require("./secrets/firebase-service-account-secrets.json");
console.log(Buffer.from(JSON.stringify(config)).toString("base64"));
