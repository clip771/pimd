const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      projectId: process.env.FIREBASE_PROJECT_ID,
    }),
    databaseURL: `https://contador-onlinepmd-default-rtdb.firebaseio.com`,
  });
}

const db = admin.database();

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, error: "Método não permitido" }),
    };
  }

  const ipRaw = event.headers["x-forwarded-for"] || "desconhecido";
  const ip = ipRaw.split(",")[0].trim();
  let marcador = "CK";

  try {
    const body = JSON.parse(event.body);
    if (body.marcador && typeof body.marcador === "string") {
      marcador = body.marcador;
    }
  } catch (e) {
    // ok, usa CK como default
  }

  const ref = db.ref("online").push();
  await ref.set({
    ip: `${marcador}-${ip}`,
    timestamp: Date.now()
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, message: "Acesso registrado com marcador." }),
  };
};
