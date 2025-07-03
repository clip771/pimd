const admin = require("firebase-admin");
const serviceAccount = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método não permitido" };
  }

  const data = JSON.parse(event.body);

  const doc = {
    timestamp: Date.now(),
    pagina: data.pagina || "desconhecida",
    ip: event.headers["x-forwarded-for"] || "desconhecido",
    userAgent: event.headers["user-agent"] || "desconhecido"
  };

  await db.collection("acessos").add(doc);

  return { statusCode: 200, body: "OK" };
};
