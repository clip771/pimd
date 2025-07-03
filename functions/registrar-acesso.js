const admin = require("firebase-admin");

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const timestamp = Date.now();

    const novoAcesso = {
      ...data,
      timestamp,
    };

    await db.collection("acessos").add(novoAcesso);

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
