const admin = require('firebase-admin');

let app; // cache da app Firebase

if (!admin.apps.length) {
  app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
} else {
  app = admin.app();
}

const db = admin.database(app);

exports.handler = async function(event, context) {
  context.callbackWaitsForEmptyEventLoop = false; // evita timeout esperando event loop vazio

  try {
    await db.ref('online').remove();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Todos os registros foram apagados.',
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
