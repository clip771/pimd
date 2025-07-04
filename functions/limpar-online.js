const admin = require('firebase-admin');

// Inicializa Firebase se necessário
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

exports.handler = async function (event, context) {
  try {
    // Verifica método POST
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ success: false, error: "Use POST e envie { confirm: \"DELETE\" } no body." }),
      };
    }

    // Tenta ler o body
    const body = JSON.parse(event.body || "{}");

    if (body.confirm !== "DELETE") {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Confirmação inválida. Envie { confirm: \"DELETE\" }." }),
      };
    }

    // Limpa o nó
    await db.ref('online').remove();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Todos os acessos foram removidos." }),
    };
  } catch (error) {
    console.error("Erro ao limpar online:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
