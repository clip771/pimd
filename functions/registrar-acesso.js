const admin = require("firebase-admin");

let app;

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  // Corrige as quebras de linha
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  app = admin.app();
}

const db = admin.firestore();

exports.handler = async (event, context) => {
  try {
    const ip = event.headers["x-forwarded-for"] || "IP_DESCONHECIDO";

    await db.collection("acessos").add({
      ip: ip,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Acesso registrado com sucesso." }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
