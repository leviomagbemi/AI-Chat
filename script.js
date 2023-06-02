const apiKey = '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';

class Prompts {
  //textPrompt
  textPrompt(content) {
    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content }],
        max_tokens: 2048,
        n: 1,
        stop: ['?'],
      }),
    })
      .then((res) => res.json())
      .then((data) => displayTextPrompt(data.choices[0].message.content))
      .catch((err) => displayErrors(err));
  }

  //image prompts
  imagePrompt(prompt) {
    fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        n: 2,
      }),
    })
      .then((res) => res.json())
      .then((data) => displayImageResponse(data))
      .catch((err) => displayErrors(err));
  }
}

//text response
function displayTextPrompt(data) {
  //remove spinner
  selector('.spinner-container').classList.add('d-none');

  if (data.error) {
    displayErrors(data.error.message);
  } else {
    //create Ai response container
    const aiResponseContainer = document.createElement('div');

    //set ai response className
    aiResponseContainer.className = 'd-flex mb-3';

    //create Ai icon
    const icon = document.createElement('i');

    //set ai icon className
    icon.className =
      'fas fa-brain p-3 rounded-circle bg-primary text-light mr-3 align-self-center';

    //create ai response output
    const aiResponseOutput = document.createElement('div');

    //set ai responseOutput
    aiResponseOutput.className = 'container p-2 bg-primary text-light rounded';

    //insert into dom
    selector('#chat-display').appendChild(aiResponseContainer);

    aiResponseContainer.appendChild(icon);
    aiResponseContainer.appendChild(aiResponseOutput);

    displayText(data, aiResponseOutput);
  }
}

//image response
function displayImageResponse(data) {
  //remove spinner
  selector('.spinner-container').classList.add('d-none');

  if (data.error) {
    displayErrors(data.error.message);
  } else {
    selector('#imgone').setAttribute('src', data.data[0].url);
    selector('#imgtwo').setAttribute('src', data.data[1].url);
  }
}

//display error
function displayErrors(data) {
  const div = document.createElement('div');

  div.className = 'alert alert-danger text-center';

  div.appendChild(document.createTextNode(data));

  selector('.main-container').insertBefore(
    div,
    selector('#promptresult-container')
  );

  setTimeout(() => {
    div.remove();
  }, 4000);
}

//typing effect function
function displayText(data, output) {
  let i = 0;
  //typing effect
  const typeInterval = setInterval(() => {
    output.innerHTML += data.charAt(i);

    i++;

    if (i >= data.length) {
      clearInterval(typeInterval);
      i = 0;
    }
  }, 50);
}

function loadAllEventListeners() {
  selector('#send-prompt').addEventListener('click', sendPrompt);

  //text button
  selector('#text-mode').addEventListener('click', textMode);

  //image button
  selector('#image-mode').addEventListener('click', imageMode);

  document.addEventListener('DOMContentLoaded', textMode);
}

//send prompts
function sendPrompt() {
  //send prompts base on mode
  if (
    selector('#image-display').classList.contains('false') &&
    selector('#prompt').value !== ''
  ) {
    userTextPrompt();
  } else if (
    !selector('#image-display').classList.contains('false') &&
    selector('#prompt').value !== ''
  ) {
    userImagePrompt();
  }

  //user text prompt
  function userTextPrompt() {
    //display user prompts
    displayUserPrompt(selector('#prompt').value);

    //init prompt class
    const prompt = new Prompts();

    //send prompt
    prompt.textPrompt(selector('#prompt').value);

    //clear input field
    selector('#prompt').value = '';

    //display spinner
    selector('.spinner-container').classList.remove('d-none');
  }
}

//user image prompt
function userImagePrompt() {
  //init prompt class
  const prompt = new Prompts();

  //send prompt
  prompt.imagePrompt(selector('#prompt').value);

  //clear input field
  selector('#prompt').value = '';

  //display spinner
  selector('.spinner-container').classList.remove('d-none');
}

//display user prompt
function displayUserPrompt(value) {
  //creat prompt display
  const userPromptDisplay = `
  <div class="d-flex mb-3">
  <i class="fas fa-user p-3 rounded-circle bg-primary text-light mr-3 align-self-start">
  </i>
  <div class="container p-2 bg-light rounded">
   ${value}
  </div>
  </div>`;

  //insert into dom
  selector('#chat-display').innerHTML += userPromptDisplay;
}

//text mode
function textMode() {
  selector('#image-display').classList.add('d-none', 'false');
  selector('#chat-display').classList.remove('d-none');

  //set active state
  activeState(selector('#text-mode'), selector('#image-mode'));
}

//image mode
function imageMode() {
  selector('#image-display').classList.remove('d-none', 'false');
  selector('#chat-display').classList.add('d-none');

  //set active state
  activeState(selector('#image-mode'), selector('#text-mode'));
}

//activeState
function activeState(stateOne, stateTwo) {
  stateOne.classList.replace('btn-primary', 'btn-info');
  stateTwo.classList.replace('btn-info', 'btn-primary');
}

//selector
function selector(selector) {
  return document.querySelector(selector);
}

loadAllEventListeners();
