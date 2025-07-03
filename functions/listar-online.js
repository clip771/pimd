const admin = require("firebase-admin");

if (!admin.apps.length) {
  if (
    !process.env.FIREBASE_PRIVATE_KEY ||
    !process.env.FIREBASE_CLIENT_EMAIL ||
    !process.env.FIREBASE_PROJECT_ID
  ) {
    throw new Error("As variáveis de ambiente do Firebase não estão definidas!");
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      projectId: process.env.FIREBASE_PROJECT_ID,
    }),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
}

const db = admin.database();

exports.handler = async function (event, context) {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Busca tudo que tem em onlineUsers
    const snapshot = await db.ref("onlineUsers").once("value");
    const data = snapshot.val() || {};

    // Transforma em array, se quiser
    const acessos = Object.entries(data).map(([key, value]) => ({
      id: key,
      ...value,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        total: acessos.length,
        acessos,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  }
};
