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

exports.handler = async function(event, context) {
  try {
    await db.ref('online').remove();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Nó online limpo com sucesso.' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
