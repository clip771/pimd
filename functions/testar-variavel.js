exports.handler = async (event, context) => {
  const jsonString = process.env.FIREBASE_SERVICE_ACCOUNT;

  console.log("========== RAW STRING ==========");
  console.log(jsonString);

  const serviceAccount = JSON.parse(jsonString);

  console.log("========== PRIVATE KEY ==========");
  console.log(serviceAccount.private_key);

  return {
    statusCode: 200,
    body: JSON.stringify({
      private_key_length: serviceAccount.private_key.length,
      starts_with: serviceAccount.private_key.slice(0, 30),
      ends_with: serviceAccount.private_key.slice(-30)
    }),
    headers: {
      "Content-Type": "application/json"
    }
  };
};
