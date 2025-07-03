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
    // Exemplo: buscar documentos online nos últimos 2 minutos
    const doisMinutosAtras = Date.now() - 2 * 60 * 1000;
    const querySnapshot = await db.collection('acessos')
      .where('timestamp', '>=', new Date(doisMinutosAtras))
      .get();

    const listaOnline = [];
    querySnapshot.forEach(doc => {
      listaOnline.push({ id: doc.id, ...doc.data() });
    });

    return {
      statusCode: 200,
      body: JSON.stringify(listaOnline),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: 'Erro ao listar online: ' + error.message,
    };
  }
};
