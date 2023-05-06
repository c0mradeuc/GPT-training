import createChatCompletion from "../openapi/create-chat-completion";

export default async function (text) {
  const messages = [{
    role: 'system',
    content: `Eres un asistente virtual experto en desarrollar codigo en nodejs. 
      Recibiras instrucciones para crear codigo y deberas seguir las siguientes instrucciones:
      - Tu respuesta solo sera codigo en nodejs, no incluyas instrucciones.
      - Tu respuesta sera en formato objeto json con 2 campos, el primero "filename" que es nombre del archivo, el segundo "code" que es el codigo generado. 
      - Incluye un campo extra que indique si la extension del nombre del archivo es .json, el nombre del campo es isJSON
      ` 
  }];
  const message = { role: 'user', content: text };
  messages.push(message);

  try {
    const completion = await createChatCompletion(messages);

    var responseMessage = completion.result;

    return JSON.parse(responseMessage.content);
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
        console.error(error.response.status, error.response.data);
        throw new Error(error.response.data);
      } else {
        console.error(`Error with OpenAI API request: ${error.message}`);
      
        throw new Error('An error occurred during your request.');
      }
  }
}
