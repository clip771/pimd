const admin = require('firebase-admin');

const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;
if (!privateKeyRaw) {
  throw new Error('FIREBASE_PRIVATE_KEY não está definida no ambiente');
}
const privateKey = privateKeyRaw.replace(/\\n/g, '\n');

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: privateKey,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

exports.handler = async function(event, context) {
  try {
    const db = admin.firestore();

    const data = JSON.parse(event.body);

    // Assumindo que você quer gravar o timestamp e algum identificador no documento "acessos"
    const acesso = {
      ...data,
      timestamp: Date.now()
    };

    const docRef = await db.collection('acessos').add(acesso);

    return {
      statusCode: 200,
      body: JSON.stringify({ id: docRef.id, message: 'Acesso registrado com sucesso!' }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
