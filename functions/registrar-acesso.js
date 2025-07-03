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

function promiseTimeout(ms, promise) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Timeout")), ms);
    promise
      .then(value => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch(err => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

exports.handler = async function (event, context) {
  try {
    const timestamp = Date.now();
    const ip = event.headers['client-ip'] || event.headers['x-forwarded-for'] || 'desconhecido';

    await promiseTimeout(8000, db.ref(`onlineUsers/${timestamp}`).set({
      ip,
      timestamp,
    }));

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
