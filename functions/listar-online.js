exports.handler = async function(event, context) {
  const chave = process.env.FIREBASE_PRIVATE_KEY || 'não definida';

  // Vamos mostrar a string recebida no ambiente (sem quebra de linha literal)
  return {
    statusCode: 200,
    body: JSON.stringify({
      length: chave.length,
      startsWith: chave.substring(0, 30),
      endsWith: chave.substring(chave.length - 30),
      raw: chave.slice(0, 100) // mostrar só os primeiros 100 chars pra evitar flood
    }),
  };
};
