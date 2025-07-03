const admin = require("firebase-admin");

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const agora = Date.now();

    // Exemplo: salvando IP e timestamp (ajuste conforme seu esquema)
    await db.collection("acessos").add({
      ip: body.ip || "desconhecido",
      timestamp: agora
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Acesso registrado" }),
      headers: {
        "Content-Type": "application/json"
      }
    };
  } catch (error) {
    console.error("Erro ao registrar acesso:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro interno" }),
      headers: {
        "Content-Type": "application/json"
      }
    };
  }
};
