const admin = require("firebase-admin");

// Inicializa Firebase só 1x
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      projectId: process.env.FIREBASE_PROJECT_ID,
    }),
    databaseURL: "https://contador-onlinepmd-default-rtdb.firebaseio.com",
  });
}

const db = admin.database();

exports.handler = async (event, context) => {
  try {
    const ip = event.headers["x-forwarded-for"] || "desconhecido";
    const sanitizedIp = ip.replace(/\./g, "_");

    const ref = db.ref("online/" + sanitizedIp);
    await ref.set({
      timestamp: Date.now(),
      mark: "CK"
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Acesso registrado com marcação CK." }),
    };
  } catch (error) {
    console.error("Erro ao registrar acesso com CK:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
