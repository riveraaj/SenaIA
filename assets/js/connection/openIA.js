const API_KEY = 'sk-proj-vfHKJ0PO62DuFVZ8dO7rT3BlbkFJK2fqtD1IP5YuO8g7nScT';
const URL = 'https://api.openai.com/v1/chat/completions'; //OpenAI API endpoint

/**
 * Sends a message to the OpenAI API and retrieves the response.
 * @param {string} message - The message to send to OpenAI.
 * @param {object} options - Additional options for the request configuration.
 * @param {number} [options.maxTokens=100] - The maximum number of tokens in the response.
 * @param {number} [options.temperature=0.7] - The temperature of the response.
 * @returns {Promise<string>} - The response from OpenAI.
 */
export async function sendMessageToOpenAI({
   message,
   maxTokens = 100,
   temperature = 0.7
}) {
   try {
      const response = await fetch(URL, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
         },
         body: JSON.stringify({
            model: 'gpt-3.5-turbo', //Model to use
            messages: [{
                  role: 'system',
                  //System message to set the assistant's behavior
                  content: `Actúa siempre como un experto en psicología para adolescentes estudiantiles, recuerda que solo tienes ${maxTokens} tokens maximos para responder asi que calcula para que no se corte en mensaje.`
               },
               {
                  role: 'user',
                  content: message //User message to be sent to the assistant
               }
            ],
            max_tokens: maxTokens, //Maximum number of tokens in the response
            temperature: temperature //Temperature setting for the response
         })
      });

      // Check if the response is not ok (status code is not in the range 200-299)
      if (!response.ok) {
         const errorText = await response.text(); // Get the error text
         throw new Error(`Error fetching response from OpenAI: ${errorText}`); // Throw an error with the response text
      }

      const data = await response.json(); //Parse the JSON response
      return data.choices[0].message.content; //Return the content of the first choice

   } catch (error) {
      console.error('Error fetching response:', error); //Log the error to the console
      return '¡Ops! Algo salió mal. Por favor, inténtalo de nuevo más tarde.' //Return a user-friendly error message
   }
}