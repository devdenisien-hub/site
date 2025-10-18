import { google } from "googleapis";
import readline from "readline";
import { config } from "dotenv";

// Charger les variables d'environnement depuis .env.local
config({ path: ".env.local" });

const CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost"; // peu importe, on n'utilise pas de serveur web

// Vérifier que les variables d'environnement sont définies
if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("❌ Erreur : Variables d'environnement manquantes");
  console.error("Assurez-vous d'avoir défini dans .env.local :");
  console.error("- GOOGLE_OAUTH_CLIENT_ID");
  console.error("- GOOGLE_OAUTH_CLIENT_SECRET");
  process.exit(1);
}

console.log("✅ Variables d'environnement chargées");
console.log(`CLIENT_ID: ${CLIENT_ID.substring(0, 20)}...`);
console.log(`CLIENT_SECRET: ${CLIENT_SECRET.substring(0, 10)}...`);

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
const scopes = ["https://www.googleapis.com/auth/drive.file"];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
  prompt: "consent",
});

console.log("\n👉 Ouvre ce lien dans ton navigateur :\n", authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.question("\nColle ici le code affiché par Google : ", async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  console.log("\n✅ Ton REFRESH_TOKEN est :\n", tokens.refresh_token);
  rl.close();
});
