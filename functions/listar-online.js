const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

exports.handler = async () => {
  try {
    const agora = Date.now();
    const limite = agora - 2 * 60 * 1000; // últimos 2 minutos

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
