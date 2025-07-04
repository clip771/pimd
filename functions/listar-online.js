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
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
}

const db = admin.database();

exports.handler = async function(event, context) {
  try {
    console.log('Recebendo requisição de limpar online...');

    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ success: false, error: 'Método não permitido' }),
      };
    }

    const body = JSON.parse(event.body);
    console.log('Body recebido:', body);

    if (!body.confirm || body.confirm !== 'DELETE') {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: 'Confirmação inválida. Envie { confirm: "DELETE" }.',
        }),
      };
    }

    console.log('Apagando dados em /online...');
    await db.ref('/online').remove();

    console.log('Dados apagados com sucesso.');

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Todos os acessos foram removidos.' }),
    };
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
