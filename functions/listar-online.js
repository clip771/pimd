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
  const now = Date.now();
  const twoMinutesAgo = now - 2 * 60 * 1000;

  const db = admin.firestore();

  try {
    const snapshot = await db.collection('acessos')
      .where('timestamp', '>=', twoMinutesAgo)
      .get();

    const acessosRecentes = [];
    snapshot.forEach(doc => {
      acessosRecentes.push({ id: doc.id, ...doc.data() });
    });

    return {
      statusCode: 200,
      body: JSON.stringify(acessosRecentes),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
