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
  // Impede a função de ficar pendurada
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const timestamp = Date.now();
    const ip = event.headers["x-forwarded-for"] || event.headers["client-ip"] || "desconhecido";
    const userAgent = event.headers["user-agent"] || "desconhecido";

    // Salva no nó 'onlineUsers' com um ID único (push gera id automático)
    await db.ref("onlineUsers").push({
      timestamp,
      ip,
      userAgent,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Acesso registrado com sucesso." }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
