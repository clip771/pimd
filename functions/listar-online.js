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
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    const snapshot = await db.collection("acessos")
      .where("timestamp", ">=", fiveMinutesAgo)
      .get();

    const acessos = [];
    snapshot.forEach(doc => {
      acessos.push({ id: doc.id, ...doc.data() });
    });

    return {
      statusCode: 200,
      body: JSON.stringify(acessos),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
