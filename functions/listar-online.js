const admin = require('firebase-admin');

let serviceAccount;

try {
  // Parse o JSON da variável ambiente
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  // Substitui os caracteres literais "\n" por quebras de linha reais
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
} catch (err) {
  console.error('Erro ao carregar a chave do serviço:', err);
  throw err;
}

// Inicializa o app Firebase apenas se ainda não estiver inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

exports.handler = async function(event, context) {
  try {
    // Exemplo: listar documentos da coleção "acessos"
    const snapshot = await db.collection('acessos').get();

    const dados = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(dados)
    };
  } catch (error) {
    console.error('Erro ao acessar o Firestore:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro no servidor' })
    };
  }
};
