exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || null,
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || null,
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ? "OK" : null
    }),
  };
};