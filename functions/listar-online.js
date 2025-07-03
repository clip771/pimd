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

exports.handler = async function () {
  try {
    // Apenas um teste simples: pega a raiz do banco, mas com timeout manual curto
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout manual: Firebase demorou demais')), 7000)
    );
    
    const dataPromise = db.ref('/').once('value').then(snap => snap.val());

    const data = await Promise.race([dataPromise, timeoutPromise]);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
