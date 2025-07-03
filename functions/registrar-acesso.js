const admin = require('firebase-admin');

if (!process.env.FIREBASE_PRIVATE_KEY ||
    !process.env.FIREBASE_CLIENT_EMAIL ||
    !process.env.FIREBASE_PROJECT_ID) {
  throw new Error('As variáveis de ambiente do Firebase não estão definidas!');
}

const serviceAccount = {
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  project_id: process.env.FIREBASE_PROJECT_ID,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
});

const db = admin.firestore();

exports.handler = async function(event, context) {
  try {
    const { userId } = JSON.parse(event.body);

    if (!userId) {
      return { statusCode: 400, body: 'userId é obrigatório' };
    }

    await db.collection('acessos').doc(userId).set({
      timestamp: new Date(),
      online: true,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Acesso registrado' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: 'Erro ao registrar acesso: ' + error.message,
    };
  }
};
