const admin = require('firebase-admin');

let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
} catch (e) {
  console.error("Erro ao parsear FIREBASE_SERVICE_ACCOUNT", e);
  throw e;
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

exports.handler = async function(event, context) {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Método não permitido" }),
      };
    }

    const body = JSON.parse(event.body);
    // Exemplo: espera um campo "usuarioId" no corpo da requisição
    const { usuarioId } = body;

    if (!usuarioId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Campo 'usuarioId' é obrigatório" }),
      };
    }

    const timestamp = Date.now();

    const docRef = await db.collection('acessos').add({
      usuarioId,
      timestamp
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: docRef.id, usuarioId, timestamp }),
    };

  } catch (error) {
    console.error("Erro registrar-acesso:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
