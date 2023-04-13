const apiKey = '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';

class Prompts {
  //textPrompt
  textPrompt(content) {
    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
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
      .then((data) => {
        displayTextResponse(data.choices[0].message.content, content);
      });
  }

  //imagePrompt
  imagePrompt(prompt) {
    fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        n: 2,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        displayImageResponse(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //text mode
  textMode() {
    selector('#image-display').classList.add('d-none', 'false');
    selector('#chat-display').classList.remove('d-none');
    selector('#text-mode').classList.replace('btn-primary', 'btn-info');
  }

  //image mode
  imageMode() {
    selector('#image-display').classList.remove('d-none', 'false');
    selector('#chat-display').classList.add('d-none');
  }
}

//text response
function displayTextResponse(data, content) {
  let i = 0;

  //remove spinner
  selector('.spinner-container').classList.add('d-none');

  //create question display
  const questionDisplay = `<div class="d-flex mb-3"><i class="fas fa-user p-3 rounded-circle bg-primary text-light mr-3 align-self-start"></i>  <div class="container p-2 bg-light rounded"> ${content}</div></div>`;

  //create Ai response container
  const aiResponseContainer = document.createElement('div');

  //set ai response className
  aiResponseContainer.className = 'd-flex mb-3';

  //create Ai icon
  const icon = document.createElement('i');

  //set Ai icon className
  icon.className =
    'fas fa-brain p-3 rounded-circle bg-primary text-light mr-3 align-self-start';

  //create Ai response output
  const aiResponseOutput = document.createElement('div');

  //set Ai response className
  aiResponseOutput.className = 'container p-2 bg-primary text-light rounded';

  //insert into dom
  selector('#chat-display').innerHTML += questionDisplay;
  selector('#chat-display').appendChild(aiResponseContainer);

  const typeInterval = setInterval(() => {
    //append icon and Ai response output to Ai container
    aiResponseContainer.appendChild(icon);
    aiResponseContainer.appendChild(aiResponseOutput);

    aiResponseOutput.innerHTML += data.charAt(i);

    i++;

    if (i >= data.length) {
      clearInterval(typeInterval);
      i = 0;
    }
  }, 50);
}

//image response
function displayImageResponse(data) {
  //remove spinner
  selector('.spinner-container').classList.add('d-none');

  if (data.error) {
    const div = document.createElement('div');

    div.className = 'alert alert-danger text-center';

    div.appendChild(document.createTextNode(data.error.message));

    selector('.main-container').insertBefore(
      div,
      selector('#promptresult-container')
    );

    //remove after 4secs
    setTimeout(() => {
      div.remove();
    }, 4000);
  } else {
    selector('#imgone').setAttribute('src', data.data[0].url);
    selector('#imgtwo').setAttribute('src', data.data[1].url);
  }
}

//selector
function selector(selector) {
  return document.querySelector(selector);
}

//load eventlisteners
function loadEventListeners() {
  selector('#send-prompt').addEventListener('click', () => {
    if (
      selector('#image-display').classList.contains('false') &&
      selector('#prompt').value !== ''
    ) {
      const prompt = new Prompts();

      prompt.textPrompt(selector('#prompt').value);

      selector('#prompt').value = '';

      //add spinner
      selector('.spinner-container').classList.remove('d-none');
    } else if (
      !selector('#image-display').classList.contains('false') &&
      selector('#prompt').value !== ''
    ) {
      const prompt = new Prompts();

      prompt.imagePrompt(selector('#prompt').value);

      selector('#prompt').value = '';

      //add spinner
      selector('.spinner-container').classList.remove('d-none');
    }
  });

  //text button
  selector('#text-mode').addEventListener('click', () => {
    const prompt = new Prompts();

    prompt.textMode();

    //active state
    selector('#text-mode').classList.replace('btn-primary', 'btn-info');
    selector('#image-mode').classList.replace('btn-info', 'btn-primary');
  });

  //image button
  selector('#image-mode').addEventListener('click', () => {
    const prompt = new Prompts();

    prompt.imageMode();

    //active state
    selector('#image-mode').classList.replace('btn-primary', 'btn-info');
    selector('#text-mode').classList.replace('btn-info', 'btn-primary');
  });

  //set default mode to text mode
  document.addEventListener('DOMContentLoaded', () => {
    const prompt = new Prompts();

    prompt.textMode();
  });
}

loadEventListeners();
