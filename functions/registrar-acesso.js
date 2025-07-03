const admin = require('firebase-admin');

if (!admin.apps.length) {
  if (
    !process.env.FIREBASE_PRIVATE_KEY ||
    !process.env.FIREBASE_CLIENT_EMAIL ||
    !process.env.FIREBASE_PROJECT_ID
  ) {
    throw new Error('As variáveis de ambiente do Firebase não estão definidas!');
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

exports.handler = async function (event) {
  try {
    const body = JSON.parse(event.body || '{}');
    if (!body.userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: 'Faltando userId' }),
      };
    }

    // Salva timestamp do acesso com userId como chave
    await db.ref(`onlineUsers/${body.userId}`).set({
      lastAccess: Date.now(),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Acesso registrado' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
