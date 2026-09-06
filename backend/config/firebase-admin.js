import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serviceAccount = JSON.parse(
  readFileSync(path.join(__dirname, "firebase-service-account.json"), "utf-8")
);

const app = initializeApp({
  credential: cert(serviceAccount),
});

const adminAuth = getAuth(app);

export default adminAuth;