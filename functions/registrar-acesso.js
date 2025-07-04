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

exports.handler = async function (event) {
  try {
    const ip = event.headers['x-forwarded-for'] || 'desconhecido';
    const timestamp = Date.now();

    await db.ref(`online/${ip}`).set({ timestamp });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, ip, timestamp }),
    };
  } catch (error) {
    console.error('Erro ao registrar acesso:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
