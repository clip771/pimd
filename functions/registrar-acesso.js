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
    const ipOriginal = event.headers["x-forwarded-for"] || "desconhecido";
    // Troca "." por "-"
    const ip = ipOriginal.replace(/\./g, "-");

    await db.ref("online").child(ip).set({
      timestamp: Date.now(),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        ipOriginal,
        ipFirebase: ip,
      }),
    };
  } catch (error) {
    console.error("Erro ao registrar acesso:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
