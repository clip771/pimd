const admin = require('firebase-admin');

// Inicializa o Firebase apenas uma vez
if (!admin.apps.length) {
  if (
    !process.env.FIREBASE_PRIVATE_KEY ||
    !process.env.FIREBASE_CLIENT_EMAIL ||
    !process.env.FIREBASE_PROJECT_ID
  ) {
    throw new Error('Variáveis de ambiente do Firebase não estão definidas!');
  }

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
    // Apaga todos os registros em "online"
    await db.ref('online').remove();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Todos os acessos foram apagados.' }),
    };
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
