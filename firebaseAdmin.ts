import { applicationDefault, initializeApp, getApps } from "firebase-admin/app";
import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_KEY as string);

if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: serviceAccount.project_id,
                clientEmail: serviceAccount.client_email,
                privateKey: serviceAccount.private_key.replace(/\\n/g, "\n"),
            }),
        });
    } catch (error) {
        console.log("Firebase admin initialization error", error);
    }
}

const adminDb = admin.firestore();

export { adminDb };
