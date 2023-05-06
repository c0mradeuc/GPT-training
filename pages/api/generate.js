import createChatCompletion from "./openapi/createChatCompletion";
import codeDeveloper from "./plugins/code-developer";
import taskManager from "./plugins/task-manager";
import appendFile from "./services/append-file";
import deleteFiles from "./services/delete-files";

const messages = [{
  role: 'system',
  content: `Eres un asistente virtual experto en generar tareas de programacion en nodejs. 
  Recibiras un texto que solicita la creacion de un codigo en nodejs. Tu objectivo crear las tareas segun los requerimientos de un usuario para que las ejecute otro asistente virtual. 
  Debes seguir las siguiente instrucciones:
  - Tu respuesta debe estar ordenada por orden de ejecucion y siempre incluir el nombre del archivo. 
  - Debes caracterizar la funcion, incluir su nombre de funcion y el archivo al que pertenece.
  - Cada funcion debe ir en un archivo separado, por lo que incluye el nombre del archivo en la descripcion de la tarea
  - Cada tarea debe incluir todo lo que se debe hacer en ese archivo.
  - En la primera tarea, describiras el contenido del package.json del projecto.
  - No debe incluir codigo.
  - Para configuracion usar .env con dotenv.
  - No considerar tareas que no sean escribir codigo.
  `
}];

export default async function (req, res) {
  const role = req.body.role;
  const content = req.body.content;

  if (!role || !content) {
    return res.status(400).json({
      error: {
        message: "Please enter a role and content",
      }
    });
  }

  const message = { role, content };
  messages.push(message);

  try {
    console.log('Deleting previous generated code');
    const baseCodeGenerationPath = 'C:/Users/Jordna/Documents/Personal/Proyectos/ia/openai-quickstart-node/code/';
    await deleteFiles(baseCodeGenerationPath);

    console.log("Generating code tasks");
    const completion = await createChatCompletion(messages);

    messages.push(completion.result);
    
    console.log("Extracting code tasks");
    const tasksResult = await taskManager(JSON.stringify(messages));

    for (let task of tasksResult.tasks) {
      console.log(`Executing code task ${task.taskNumber}: ${task.task}`);
      const code = await codeDeveloper(task.task);
      console.log(code);
      appendFile(code.filename, baseCodeGenerationPath + code.filename, code.isJSON ? JSON.stringify(code.code) : code.code);
    }

    // console.log(messages);
    return res.status(200).json({ result: messages });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}
