const admin = require('firebase-admin');

if (!admin.apps.length) {
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

// Tempo máximo de inatividade para considerar alguém online (em ms)
const TEMPO_ONLINE = 1000 * 60 * 5; // 5 minutos

exports.handler = async function (event, context) {
  try {
    const snapshot = await db.ref("online").once("value");
    const acessos = snapshot.val() || {};

    const agora = Date.now();
    const online = {};

    for (const ip in acessos) {
      const tempo = acessos[ip].timestamp;
      if (tempo && agora - tempo <= TEMPO_ONLINE) {
        online[ip] = tempo;
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        total: Object.keys(online).length,
        acessos: online,
      }),
    };
  } catch (error) {
    console.error("Erro ao listar acessos:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
