// /functions/testar-env.js

exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ? "OK" : "NÃO DEFINIDO",
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL ? "OK" : "NÃO DEFINIDO",
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ? "OK" : "NÃO DEFINIDO",
    }),
  };
};
