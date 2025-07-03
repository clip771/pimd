const admin = require("firebase-admin");
const serviceAccount = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

exports.handler = async () => {
  const agora = Date.now();
  const limite = agora - 2 * 60 * 1000; // Últimos 2 minutos

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
};
