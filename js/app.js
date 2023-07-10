//NOTE: I am using this api key for demo purpose so I am showing this apiKey publicly. But whenever I use this API key in production I will use the API key by environment variable.

/**
 * TODO:
 * Write JavaScript code for user input:
import * as config from 'config'
    Add an event listener to capture user input from the input box.
    Store the user's message in a variable or data structure.
    Trigger a function to handle the user's message.
 * Implement API request handling:
    Use the fetch() API to send a POST request to the ChatGPT API endpoint.
    Include the necessary headers, including the API key, in the request.
    Pass the user's message as the input for the API request.
    Handle the API response and extract the generated model response.
 * Update the conversation interface:
    Append the user's message and generated model response to the chat area.
    Format and style the conversation history to distinguish between user and model messages.
    Scroll the chat area to the bottom to show the latest messages.
 * Test the application:
    Test the application by sending different messages and verifying the responses.
    Check for any errors or unexpected behavior.
    Debug and fix issues as needed.
 * Document the code:
    Add comments to explain important implementation details.
    Provide usage instructions for running the application.
    Include any specific instructions for obtaining and using the API key.
 * */

//  Add an event listener to capture user input from the input box
const promptSubmit = document.querySelector(".prompt-form");

promptSubmit.addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;

  const userInput = form.userPrompt.value;
  console.log(userInput);

  // Append the user's message and generated model response to the chat area
  const conversation = document.querySelector(".conversation");

  const article = document.createElement("article");
  article.innerHTML = `            
      <div class="loader">
      <div class="loader-animation">
         <span></span>
         <span></span>
      </div>
      <p>Responding</p>
      </div>`;


  conversation.scrollTop = conversation.scrollHeight;

  conversation.appendChild(article);
  form.userPrompt.value = "";
  form.userPrompt.focus();

  // Scroll the chat area to the bottom to show the latest messages.

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userInput }],
        max_tokens: 100,
      }),
    });
    const data = await response.json();

    console.log(data);

   //  Handling error and show the error message to ui 
    if (data.error) {
      article.innerHTML = `
         <div class="prompt-message error-message">
         <i class="fa-solid fa-triangle-exclamation"></i>
            <p>Error: ${data.error.message}</p>
         </div>`;
    } else {
      article.innerHTML = `
         <div class="prompt-message">
            <i class="fa-solid fa-angles-right prompt-icon"></i>
            <h2>${userInput}</h2>
         </div>
         <p><b>Response:</b> ${data.choices[0].message.content}</p>`;
    }
  } catch (error) {
    console.log(error);
  }
});
