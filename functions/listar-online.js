const admin = require('firebase-admin');

let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
} catch (e) {
  console.error("Erro ao parsear FIREBASE_SERVICE_ACCOUNT", e);
  throw e;
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

exports.handler = async function(event, context) {
  try {
    const agora = Date.now();
    const doisMinutosAtras = agora - 2 * 60 * 1000;

    // Supondo que a coleção seja "acessos" e o timestamp esteja no campo "timestamp" em milissegundos
    const snapshot = await db.collection('acessos')
      .where('timestamp', '>=', doisMinutosAtras)
      .get();

    const acessosRecentes = [];
    snapshot.forEach(doc => {
      acessosRecentes.push({ id: doc.id, ...doc.data() });
    });

    return {
      statusCode: 200,
      body: JSON.stringify(acessosRecentes),
      headers: {
        'Content-Type': 'application/json'
      }
    };

  } catch (error) {
    console.error("Erro listar-online:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
