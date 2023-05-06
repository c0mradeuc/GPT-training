import createChatCompletion from "../openapi/create-chat-completion";

const messages = [{
  role: 'system',
  content: `Eres un asistente virtual experto en gestionar tareas. Tu tarea es recibir un texto e identificar las tareas.
  - Recibiras una respuesta de otro asistente que contiene un listado de tareas.
  - Tu deber es identificar estas tareas y armar un json con 2 propiedades, el numero de la tarea como ""taskNumber"" y la tarea como ""task"". 
  `
}];

export default async function (text) {
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
}1
