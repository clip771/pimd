const admin = require("firebase-admin");

// Pega o JSON da serviceAccount da variável ambiente (string JSON)
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountJson) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable is missing");
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountJson);
} catch (e) {
  throw new Error("Invalid JSON in FIREBASE_SERVICE_ACCOUNT environment variable");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

exports.handler = async () => {
  const agora = Date.now();
  const limite = agora - 2 * 60 * 1000; // últimos 2 minutos

  try {
    const snapshot = await db.collection("acessos")
      .where("timestamp", ">=", limite)
      .get();

    const online = [];
    snapshot.forEach(doc => {
      online.push(doc.data());
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        total: online.length,
        acessos: online
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
