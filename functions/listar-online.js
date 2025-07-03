const admin = require('firebase-admin');

console.log('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? 'definida' : 'não definida');
console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? 'definida' : 'não definida');
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? 'definida' : 'não definida');

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

// Sua função handler continua aqui...

exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: 'Funcionou!',
  };
};
