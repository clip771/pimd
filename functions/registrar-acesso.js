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

  const timestamp = Date.now();
  const ip = event.headers["x-forwarded-for"] || event.headers["client-ip"] || "desconhecido";
  const userAgent = event.headers["user-agent"] || "desconhecido";

  // *NAO* usar await aqui
  db.ref("onlineUsers").push({
    timestamp,
    ip,
    userAgent,
  });

  // Responde imediatamente sem esperar o push
  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, message: "Acesso registrado." }),
  };
};
