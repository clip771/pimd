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

exports.handler = async function(event, context) {
  try {
    // Apaga tudo que está no nó "online"
    await db.ref('online').remove();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Todos os registros foram apagados.'
      }),
    };
  } catch (error) {
    console.error('Erro ao limpar online:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      }),
    };
  }
};
