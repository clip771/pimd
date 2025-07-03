const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

exports.handler = async (event) => {
  try {
    // Recebe os dados enviados no corpo da requisição (JSON)
    const data = JSON.parse(event.body);

    // Adiciona timestamp atual
    data.timestamp = Date.now();

    await db.collection("acessos").add(data);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Acesso registrado com sucesso." })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
