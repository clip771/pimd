const functions = require("firebase-functions");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);
    const db = admin.firestore();

    await db.collection("online").add({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      ...body,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Acesso registrado com sucesso." }),
    };
  } catch (error) {
    console.error("Erro ao registrar acesso:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro ao registrar acesso." }),
    };
  }
};
