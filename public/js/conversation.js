/* eslint no-unused-vars: "off" */
/* global Api: true, Common: true*/

var ConversationPanel = (function() {
  var settings = {
    selectors: {
      chatBox: '#scrollingChat',
      fromUser: '.from-user',
      fromWatson: '.from-watson',
      latest: '.latest'
    },
    authorTypes: {
      user: 'user',
      watson: 'watson'
    },
    localStorage: {
      userCtx: 'userCtx',
      watsonCtx: 'watsonCtx',
      dateFromLastUserMsg: 'dateFromLastUserMsg',
      dateFromLastWatsonMsg: 'dateFromLastWatsonMsg'
    }
  };

  var conversationLog = Array();
  var lastMsgs = Array();
  lastMsgs.push = function (){
    if (this.length >= 22) {
        this.shift();
    }
    return Array.prototype.push.apply(this,arguments);
  }

  // Publicly accessible methods defined
  return {
    init: init,
    inputKeyDown: inputKeyDown
  };

  function init() {
    chatUpdateSetup();
    initWithLastMessages()
    Api.sendRequest('', null);
    setupInputBox();
    initButtonsOnClickAction()
  }

  function initWithLastMessages() {
    const userCtx = localStorage.getItem(settings.localStorage.userCtx),
          watsonCtx = localStorage.getItem(settings.localStorage.watsonCtx),
          dateFromLastUserMsg = localStorage.getItem(settings.localStorage.dateFromLastUserMsg),          
          dateFromLastWatsonMsg = localStorage.getItem(settings.localStorage.dateFromLastWatsonMsg)

    if(userCtx) {
      displayMessage(JSON.parse(userCtx), settings.authorTypes.user, dateFromLastUserMsg)
    }
    if(watsonCtx) {
      displayMessage(JSON.parse(watsonCtx), settings.authorTypes.watson, dateFromLastWatsonMsg)
    }
  }

  // Set up callbacks on payload setters in Api module
  // This causes the displayMessage function to be called when messages are sent / received
  function chatUpdateSetup() {
    var currentRequestPayloadSetter = Api.setRequestPayload;
    Api.setRequestPayload = function(newPayloadStr) {
      currentRequestPayloadSetter.call(Api, newPayloadStr);
      var payloadJson = JSON.parse(newPayloadStr)
      if(payloadJson && payloadJson.input && payloadJson.input.text) {
        localStorage.setItem(settings.localStorage.userCtx, newPayloadStr)
        localStorage.setItem(settings.localStorage.dateFromLastUserMsg, new Date().toLocaleString("pt-BR").toString())
      }
      setMsgInLog(payloadJson.input.text, true)
      displayMessage(payloadJson, settings.authorTypes.user);
    };

    var currentResponsePayloadSetter = Api.setResponsePayload;
    Api.setResponsePayload = function(newPayloadStr) {
      currentResponsePayloadSetter.call(Api, newPayloadStr);
      localStorage.setItem(settings.localStorage.watsonCtx, newPayloadStr)
      localStorage.setItem(settings.localStorage.dateFromLastWatsonMsg, new Date().toLocaleString("pt-BR").toString())
      var payloadJson = JSON.parse(newPayloadStr)
      setMsgInLog(payloadJson.output.text.join('<br>'), false)
      console.log(payloadJson)
      if (payloadJson.intents[0] && payloadJson.intents[0].intent === 'Finalizar_Conversa') {
        toggleButtons()
      }
      if (payloadJson.context.no_answer) {
	      sendMailToMrXper(payloadJson)
  	  }
      displayMessage(payloadJson, settings.authorTypes.watson);
    };
  }

  function initButtonsOnClickAction() {
    $('#continuarConversa').click(function() {
      toggleButtons()
    })
    $('#receberConversaPorEmail').click(function() {
      sendMailToUser()
      toggleButtons()
    })
  }
  
  function toggleButtons() {
    $('#textInput').toggle()
    $('#endConversationDiv').toggle()
  }

  function setMsgInLog(msg, isUser) {
    var msgFrom = isUser ? '<div style="background:ghostwhite;"><h4>' + localStorage.getItem('name') + ':</h4>' : '<div style="background:gainsboro;"><h4>Mr. Xper:</h4>'
    var log = msgFrom + msg + '</div>'
    conversationLog.push(log)
    lastMsgs.push(log)
  }

  function sendMailToMrXper(payloadJson) {
    var payloadToMail = {
      name: localStorage.getItem('name'),
      email: localStorage.getItem('email'),
      phone: localStorage.getItem('phone'),
      conversationId: payloadJson.context.conversation_id,
      userMsg: payloadJson.input.text,
      watsonMsg: payloadJson.output.text,
      lastMsgs
    }

    var http = new XMLHttpRequest();
    http.open('POST', '/api/mail/mrxper', true);
    http.setRequestHeader('Content-type', 'application/json');
    http.onreadystatechange = function() {
        if (http.readyState === 4 && http.status === 200 && http.responseText) {
        console.log('Entraremos em contato com você em breve!')
        }
    };
    var params = JSON.stringify(payloadToMail);
    http.send(params);
  }

  function sendMailToUser() {
    var payloadToMail = {
      name: localStorage.getItem('name'),
      email: localStorage.getItem('email'),
      conversationLog
    }

    var http = new XMLHttpRequest();
    http.open('POST', '/api/mail/user', true);
    http.setRequestHeader('Content-type', 'application/json');
    http.onreadystatechange = function() {
        if (http.readyState === 4 && http.status === 200 && http.responseText) {
        console.log('E-mail enviado com sucesso! Pode levar alguns minutos para chegar.')
        console.log('Por favor checar caixa de SPAM')
        }
    };
    var params = JSON.stringify(payloadToMail);
    http.send(params);
  }

// Set up the input box to underline text as it is typed
  // This is done by creating a hidden dummy version of the input box that
  // is used to determine what the width of the input text should be.
  // This value is then used to set the new width of the visible input box.
  function setupInputBox() {
    var input = document.getElementById('textInput');
    var dummy = document.getElementById('textInputDummy');
    var minFontSize = 14;
    var maxFontSize = 16;
    var minPadding = 4;
    var maxPadding = 6;

    // If no dummy input box exists, create one
    if (dummy === null) {
      var dummyJson = {
        'tagName': 'div',
        'attributes': [{
          'name': 'id',
          'value': 'textInputDummy'
        }]
      };

      dummy = Common.buildDomElement(dummyJson);
      document.body.appendChild(dummy);
    }

    function adjustInput() {
      if (input.value === '') {
        // If the input box is empty, remove the underline
        input.classList.remove('underline');
        input.setAttribute('style', 'width: 100%');
        input.style.width = '100%';
      } else {
        // otherwise, adjust the dummy text to match, and then set the width of
        // the visible input box to match it (thus extending the underline)
        input.classList.add('underline');
        var txtNode = document.createTextNode(input.value);
        ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height',
          'text-transform', 'letter-spacing'].forEach(function(index) {
            dummy.style[index] = window.getComputedStyle(input, null).getPropertyValue(index);
          });
        dummy.textContent = txtNode.textContent;

        var padding = 0;
        var htmlElem = document.getElementsByTagName('html')[0];
        var currentFontSize = parseInt(window.getComputedStyle(htmlElem, null).getPropertyValue('font-size'), 10);
        if (currentFontSize) {
          padding = Math.floor((currentFontSize - minFontSize) / (maxFontSize - minFontSize)
            * (maxPadding - minPadding) + minPadding);
        } else {
          padding = maxPadding;
        }

        var widthValue = ( dummy.offsetWidth + padding) + 'px';
        input.setAttribute('style', 'width:' + widthValue);
        input.style.width = widthValue;
      }
    }

    // Any time the input changes, or the window resizes, adjust the size of the input box
    input.addEventListener('input', adjustInput);
    window.addEventListener('resize', adjustInput);

    // Trigger the input event once to set up the input box and dummy element
    Common.fireEvent(input, 'input');
  }

  // Display a user or Watson message that has just been sent/received
  function displayMessage(newPayload, typeValue, msgDate) {
    var isUser = isUserMessage(typeValue);
    var textExists = (newPayload.input && newPayload.input.text)
      || (newPayload.output && newPayload.output.text);
    if (isUser !== null && textExists) {
      // Create new message DOM element
      var messageDivs = buildMessageDomElements(newPayload, isUser, msgDate);
      var chatBoxElement = document.querySelector(settings.selectors.chatBox);
      var previousLatest = chatBoxElement.querySelectorAll((isUser
              ? settings.selectors.fromUser : settings.selectors.fromWatson)
              + settings.selectors.latest);
      // Previous "latest" message is no longer the most recent
      if (previousLatest) {
        Common.listForEach(previousLatest, function(element) {
          element.classList.remove('latest');
        });
      }

      messageDivs.forEach(function(currentDiv) {
        chatBoxElement.appendChild(currentDiv);
        // Class to start fade in animation
        currentDiv.classList.add('load');
      });
      // Move chat to the most recent messages when new messages are added
      scrollToChatBottom();
    }
  }

  // Checks if the given typeValue matches with the user "name", the Watson "name", or neither
  // Returns true if user, false if Watson, and null if neither
  // Used to keep track of whether a message was from the user or Watson
  function isUserMessage(typeValue) {
    if (typeValue === settings.authorTypes.user) {
      return true;
    } else if (typeValue === settings.authorTypes.watson) {
      return false;
    }
    return null;
  }

  // Constructs new DOM element from a message payload
  function buildMessageDomElements(newPayload, isUser, msgDate) {
    var textArray = isUser ? newPayload.input.text : newPayload.output.text;
    if (Object.prototype.toString.call( textArray ) !== '[object Array]') {
      textArray = [textArray];
    }
    var messageArray = [];

    textArray.forEach(function(currentText) {
      if (currentText) {
        var msg = [{
          // <div class='message-inner'>
          'tagName': 'div',
          'classNames': ['message-inner'],
          'children': [{
            // <p>{messageText}</p>
            'tagName': 'p',
            'text': currentText
          }]
        }]
        if (messageArray.length === 0) {
          msg.splice(0, 0, {
            // <div>
            'tagName': 'div',
            'children': [{
              // <small class="text-muted">{date now()}</p>
              'classNames': ['text-muted'],
              'tagName': 'small',
              'text': msgDate || new Date().toLocaleString("pt-BR")
            }]
          })
        }
        var messageJson = {
          // <div class='segments'>
          'tagName': 'div',
          'classNames': ['segments'],
          'children': [{
            // <div class='from-user/from-watson latest'>
            'tagName': 'div',
            'classNames': [(isUser ? 'from-user' : 'from-watson'), 'latest', 'top'], //top ou sub
            'children': msg
          }]
        }
        messageArray.push(Common.buildDomElement(messageJson));
      }
    });

    return messageArray;
  }

  function scrollToChatBottom() {
    var scrollingChat = document.querySelector('#scrollingChat');

    var scrollEl = scrollingChat.querySelector(settings.selectors.fromUser
            + settings.selectors.latest);
    if (scrollEl) {
      scrollingChat.scrollTop = scrollEl.offsetTop;
    }
  }

  function inputKeyDown(event, inputBox) {
    if (event.keyCode === 13 && inputBox.value) {
      var context;
      var latestResponse = Api.getResponsePayload();
      if (latestResponse) {
        context = latestResponse.context;
      }

      Api.sendRequest(inputBox.value, context);

      inputBox.value = '';
      Common.fireEvent(inputBox, 'input');
    }
  }
}());
