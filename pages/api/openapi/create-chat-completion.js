import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (messages) {
  if (!configuration.apiKey) {
    throw new Error("OpenAI API key not configured, please follow instructions in README.md");
  }

  if (!messages || messages.length === 0) {
    throw new Error("Please enter at least one message");
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0,
    });

    var responseMessage = completion.data.choices[0].message;

    return { result: responseMessage };
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
