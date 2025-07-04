const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
}

const db = admin.database();

exports.handler = async (event) => {
  // Somente POST permitido
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, error: 'Método não permitido' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: 'JSON inválido' }),
    };
  }

  if (body.confirm !== 'DELETE') {
    return {
      statusCode: 403,
      body: JSON.stringify({ success: false, error: 'Confirmação inválida. Envie { confirm: "DELETE" }.' }),
    };
  }

  try {
    await db.ref('online').remove();
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Registros apagados com sucesso.' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: 'Erro ao apagar os dados: ' + error.message }),
    };
  }
};
