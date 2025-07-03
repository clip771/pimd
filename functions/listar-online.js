const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      projectId: process.env.FIREBASE_PROJECT_ID,
    }),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
}

const db = admin.database();

// Função para limitar a leitura a no máximo 50 registros
exports.handler = async function (event, context) {
  try {
    console.log("Iniciando leitura do onlineUsers");

    const snapshot = await Promise.race([
      db.ref("onlineUsers").limitToLast(50).once("value"),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 5000))
    ]);

    console.log("Snapshot lido com sucesso");

    const data = snapshot.val() || {};

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        total: Object.keys(data).length,
        acessos: data
      }),
    };
  } catch (error) {
    console.error("Erro:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  }
};
