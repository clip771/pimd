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
    databaseURL: `https://contador-onlinepmd-default-rtdb.firebaseio.com`,
  });
}

const db = admin.database();

exports.handler = async function (event, context) {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ success: false, error: 'Método não permitido' }),
      };
    }

    const ipRaw = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'desconhecido';
    const ip = `CK-${ipRaw.split(',')[0].trim()}`;

    const ref = db.ref('online');
    await ref.push({
      ip,
      timestamp: Date.now(),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Acesso CK registrado com sucesso.' }),
    };
  } catch (error) {
    console.error('Erro ao registrar acesso:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
