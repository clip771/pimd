const admin = require("firebase-admin");

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

exports.handler = async (event) => {
  try {
    // Aqui você pode receber dados do acesso via event.body (se precisar)
    // Exemplo simples para salvar timestamp atual
    const registro = {
      timestamp: Date.now(),
      ip: event.headers['client-ip'] || event.headers['x-forwarded-for'] || 'unknown'
    };

    await db.collection("acessos").add(registro);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Acesso registrado com sucesso!" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
