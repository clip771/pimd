const admin = require('firebase-admin');

const serviceAccount = {
  "type": "service_account",
  "project_id": "contador-onlinepmd",
  "private_key_id": "3861a0d555ad777b96abdf49514a0b8d52072805",
  "private_key": process.env.FIREBASE_PRIVATE_KEY,
  "client_email": "firebase-adminsdk-fbsvc@contador-onlinepmd.iam.gserviceaccount.com",
  "client_id": "100108267689418340508",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40contador-onlinepmd.iam.gserviceaccount.com"
};

// Tratar a private_key para garantir formato PEM correto
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n').trim();

console.log('private_key começa assim:', serviceAccount.private_key.slice(0, 30));
console.log('private_key termina assim:', serviceAccount.private_key.slice(-30));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

exports.handler = async function(event, context) {
  try {
    const doisMinutosAtras = Date.now() - 2 * 60 * 1000; // timestamp em ms

    const snapshot = await db.collection('acessos')
      .where('datahora', '>=', new Date(doisMinutosAtras))
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
    console.error('Erro ao listar acessos recentes:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro interno no servidor' }),
    };
  }
};
