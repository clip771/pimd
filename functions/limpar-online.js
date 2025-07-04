const admin = require('firebase-admin');

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

exports.handler = async function(event, context) {
  try {
    // Só aceita POST
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ success: false, error: 'Método não permitido. Use POST.' }),
      };
    }

    // Parse do body JSON
    const body = JSON.parse(event.body || '{}');

    if (body.confirm !== 'DELETE') {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: 'Confirmação inválida. Envie { confirm: "DELETE" }.' }),
      };
    }

    // Apaga o nó "online"
    await db.ref('online').remove();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Todos os registros "online" foram apagados.' }),
    };
  } catch (error) {
    console.error('Erro ao limpar:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
