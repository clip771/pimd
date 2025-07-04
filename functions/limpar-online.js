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

exports.handler = async function () {
  try {
    const snapshot = await db.ref('online').once('value');
    const data = snapshot.val() || {};
    const agora = Date.now();
    const LIMITE = 5 * 60 * 1000; // 5 minutos em ms

    const updates = {};
    for (const ip in data) {
      if (agora - data[ip].timestamp > LIMITE) {
        updates[ip] = null; // Firebase: set null = remove
      }
    }

    await db.ref('online').update(updates);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        removidos: Object.keys(updates),
      }),
    };
  } catch (error) {
    console.error('Erro ao limpar online:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
