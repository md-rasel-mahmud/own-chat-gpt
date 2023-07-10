/**
 * TODO:
 * Write JavaScript code for create drawer sidebar in mobile devices
    Select the menu button
    Select the close menu button
    Select the sidebar
    write logic: click menu button to open sidebar and click close menu button to close sidebar
 * Write JavaScript code for user input:
    Add an event listener to capture user input from the input box.
    Store the user's message in a variable.
    Trigger a function to handle the user's message.
 * Implement API request handling:
    Use the fetch() API to send a POST request to the ChatGPT API endpoint.
    Include the necessary headers, including the API key, in the request.
    Pass the user's message as the input for the API request.
    Handle the API response and extract the generated model response.
 * Update Prompt history 
    select prompt history section
    create prompt history element
    set innerHTML of prompt history element 
    append prompt history element to prompt history section
 * Update the conversation interface:
    fetch data with handling error
    Handling error and show the error message to ui
    Append the error response to the chat area.
    Append the user's message and generated model response to the chat area.
    Format and style the conversation history to distinguish between user and model messages.
    Scroll the chat area to the bottom to show the latest messages.
 * */

// ------------------------------------ Start code ------------------------------------

/**
 * Write JavaScript code for create drawer sidebar in mobile devices
 *  Select the menu button
 *  Select the close menu button
 *  Select the sidebar
 *  write logic: click menu button to open sidebar and click close menu button to close sidebar
 **/
const menu = document.querySelector(".menu-btn");
const closeMenu = document.querySelector(".close-menu-btn");
const sidebar = document.querySelector("aside");

// write logic: click menu button to open sidebar and click close menu button to close sidebar
menu.addEventListener("click", () => {
  sidebar.style.marginLeft = "0";
});

closeMenu.addEventListener("click", () => {
  sidebar.style.marginLeft = "-70vw";
});

//  Add an event listener to capture user input from the input box
const promptSubmit = document.querySelector(".prompt-form");
promptSubmit.userPrompt.focus();

/**
 * Implement API request handling:
 *    Use the fetch() API to send a POST request to the ChatGPT API endpoint.
 *    Include the necessary headers, including the API key, in the request.
 *    Pass the user's message as the input for the API request.
 *    Handle the API response and extract the generated model response.
 **/

// select submit button
const submitBtn = document.querySelector("form button");

// Update the conversation interface and prompt history
const conversation = document.querySelector(".conversation");
promptSubmit.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Get the user input
  const form = event.target;
  const userInput = form.userPrompt.value;

  if (userInput.length < 2) {
    return alert("Please enter at least 2 characters");
  }

  //empty the conversation section area
  document.querySelector(".quick-example-prompt").innerHTML = "";

  submitBtn.setAttribute("disabled", true);
  submitBtn.style.pointerEvents = "none";
  submitBtn.style.opacity = "0.5";

  /***
   * Update Prompt history
   * select prompt history section
   * create prompt history element
   * set innerHTML of prompt history element
   * append prompt history element to prompt history section
   ***/

  // select prompt history section
  const promptHistory = document.querySelector(".prompt-history");

  // create prompt history element
  const promptHistoryElement = document.createElement("div");
  promptHistoryElement.classList.add("prompt-history-msg");

  // set innerHTML of prompt history element
  promptHistoryElement.innerHTML = `
  <button onClick="handlePromptHistoryBtn(event)" type="button" class="prompt-history-btn">
    <i class="fa-solid fa-comments"></i>
    ${userInput}
  </button>
  <button onclick="handleDeleteBtn(event)" type="button" class="delete-btn">
    <i class="fa-solid fa-trash-can"></i>
  </button>`;

  // append prompt history element to prompt history section
  promptHistory.appendChild(promptHistoryElement);

  // create article element
  const article = document.createElement("article");

  // set loader while fetch data from api
  article.innerHTML = `            
    <div class="loader">
    <div class="loader-animation">
        <span></span>
        <span></span>
    </div>
    <p>Responding</p>
    </div>`;
  conversation.appendChild(article);
  form.userPrompt.value = "";
  form.userPrompt.focus();

  // Scroll the chat area to the bottom to show the latest messages.
  conversation.scrollTop = conversation.scrollHeight;

  /**
   * Update the conversation interface:
   *   fetch data with handling error
   *   Handling error and show the error message to ui
   *   Append the error response to the chat area.
   *   Append the user's message and generated model response to the chat area.
   *   Format and style the conversation history to distinguish between user and model messages.
   *   Scroll the chat area to the bottom to show the latest messages.
   * */

  //   fetch data with handling error
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

    //  Handling error and show the error message to ui
    if (data.error) {
      // button disable false
      submitBtn.removeAttribute("disabled");
      submitBtn.style.pointerEvents = "auto";
      submitBtn.style.opacity = "1";

      // Append the error response to the chat area.
      article.innerHTML = `
         <div class="prompt-message error-message">
         <i class="fa-solid fa-triangle-exclamation"></i>
            <p>Error: ${data.error.message}</p>
         </div>`;
      conversation.appendChild(article);
      form.userPrompt.value = "";
      form.userPrompt.focus();
    } else {
      // button disable false
      submitBtn.removeAttribute("disabled");
      submitBtn.style.pointerEvents = "auto";
      submitBtn.style.opacity = "1";
      // Append the user's message and generated model response to the chat area.
      article.innerHTML = `
         <div class="prompt-message">
         <i class="fa-solid fa-terminal"></i>
            <h2>${userInput}</h2>
         </div>
         <p><b>Response:</b> ${data.choices[0].message.content}</p>`;
      conversation.appendChild(article);
      form.userPrompt.value = "";
      form.userPrompt.focus();
    }
  } catch (error) {
    // button disable false
    submitBtn.removeAttribute("disabled");
    submitBtn.style.pointerEvents = "auto";
    submitBtn.style.opacity = "1";
    // handling error in console log
    console.log(error);
    // Append the error response to the chat area.
    article.innerHTML = `
      <div class="prompt-message error-message">
      <i class="fa-solid fa-triangle-exclamation"></i>
          <p>Error: ${error}</p>
      </div>`;
  }
});

// Handle prompt history conversation
const handlePromptHistoryBtn = (event) => {
  promptSubmit.userPrompt.value = event.target.innerText;
  promptSubmit.userPrompt.focus();
};

// handle delete history
const handleDeleteBtn = (event) => {
  // confirmation from user for delete prompt history
  if (confirm("Are you sure to delate this history?")) {
    // check the event target element
    if (event.target.classList[0] === "delete-btn") {
      event.target.parentElement.remove();
    } else {
      event.target.parentElement.parentElement.remove();
    }
  }
};

// click new chat to append example prompts
const newChat = document.querySelector(".new-chat");
newChat.addEventListener("click", () => {
  conversation.innerHTML = `
  <h1>OWN CHAT-GPT</h1>

  <section class="quick-example-prompt">
    <h2>EXAMPLES</h2>
    <div class="example-prompts">
      <button onclick="handleExamplePrompt(event)" class="example-prompt">
        Can you explain the concept of artificial intelligence and its
        potential applications?
        <i class="fa-regular fa-square-caret-right"></i>
      </button>
      <button onclick="handleExamplePrompt(event)" class="example-prompt">
        What are some effective strategies for time management and
        increasing productivity?
        <i class="fa-regular fa-square-caret-right"></i>
      </button>
      <button onclick="handleExamplePrompt(event)" class="example-prompt">
        Discuss the impact of climate change on the environment and
        possible mitigation measures.
        <i class="fa-regular fa-square-caret-right"></i>
      </button>
      <button onclick="handleExamplePrompt(event)" class="example-prompt">
        Can you provide an overview of the history and significance of
        the Industrial Revolution
        <i class="fa-regular fa-square-caret-right"></i>
      </button>
      <button onclick="handleExamplePrompt(event)" class="example-prompt">
        Explore the ethical implications of genetic engineering and its
        potential benefits and risks
        <i class="fa-regular fa-square-caret-right"></i>
      </button>
      <button onclick="handleExamplePrompt(event)" class="example-prompt">
        Discuss the major theories of the origin of the universe and the
        evidence supporting them.
        <i class="fa-regular fa-square-caret-right"></i>
      </button>
    </div>
  </section>`;

  promptSubmit.userPrompt.value = "";
  promptSubmit.userPrompt.focus();
});

// click example set prompts to user input
const handleExamplePrompt = (event) => {
  promptSubmit.userPrompt.value = event.target.innerText;
  promptSubmit.userPrompt.focus();
};

// ------------------------------------ End code ------------------------------------
