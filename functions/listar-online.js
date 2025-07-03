const admin = require('firebase-admin');

if (
  !process.env.FIREBASE_PRIVATE_KEY ||
  !process.env.FIREBASE_CLIENT_EMAIL ||
  !process.env.FIREBASE_PROJECT_ID
) {
  throw new Error('As variáveis de ambiente do Firebase não estão definidas!');
}

const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

const db = admin.firestore();

exports.handler = async function(event, context) {
  try {
    const agora = Date.now();
    const doisMinutosAtras = agora - 2 * 60 * 1000;

    const snapshot = await db
      .collection('acessos') // seu nome da coleção, ajuste se for diferente
      .where('timestamp', '>=', doisMinutosAtras)
      .get();

    const usuariosOnline = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(usuariosOnline),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
