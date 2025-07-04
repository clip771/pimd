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

exports.handler = async function (event, context) {
  try {
    // Apenas grava e lê um valor de teste
    const ref = db.ref("test");
    await ref.set({ timestamp: Date.now() });
    const snapshot = await ref.once("value");
    const data = snapshot.val();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Conexão Firebase OK",
        data,
      }),
    };
  } catch (error) {
    console.error("Erro ao testar Firebase:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
