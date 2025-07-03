const admin = require("firebase-admin");

if (!admin.apps.length) {
  // Pega a credencial da variável de ambiente e faz o parse do JSON
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

exports.handler = async () => {
  try {
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
      }),
      headers: {
        "Content-Type": "application/json"
      }
    };
  } catch (error) {
    console.error("Erro ao listar online:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro interno" }),
      headers: {
        "Content-Type": "application/json"
      }
    };
  }
};
