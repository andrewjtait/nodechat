var NodeChat = function() {
  var scope = this;

  // Node Socket
  this.socket = io();

  // App Views
  this.chatRoomView = document.getElementsByClassName('chat-room')[0];
  this.setupView = document.getElementsByClassName('setup')[0];

  // App Forms
  this.setupForm = document.getElementsByClassName('setup-form')[0];
  this.messageForm = document.getElementsByClassName('message-form')[0];

  // App Elements
  this.emailAddress = document.getElementsByClassName('email-address')[0];
  this.messages = document.getElementsByClassName('messages')[0];
  this.messageInput = document.getElementsByClassName('message-input')[0];

  this.emailAddress.focus();

  // When a user connects to the app
  this.socket.on('register', function(id) {
    if (scope.socket.id == null) {
      scope.socket.id = id;
    }
  });

  // On submission of the setup form
  this.setupForm.addEventListener('submit', function(ev) {
    ev.preventDefault();
    scope.socket.emit('user setup', scope.emailAddress.value);
    scope.startChatApp();
  });

  // When a chat message is posted
  this.messageForm.addEventListener('submit', function(ev) {
    ev.preventDefault();
    scope.socket.emit('chat message', scope.messageInput.value);
    scope.messageInput.value = '';
    scope.messageInput.focus();
  });

  // When a chat message is received
  this.socket.on('chat message', function(msg, id, avatarUrl) {
    if (msg) {
      var klass = 'message';

      if (id == scope.socket.id) {
        klass += ' me';
      }

      var avatar = createAvatar(avatarUrl),
          message = createMessage(klass, msg, avatar);

      scope.messages.appendChild(message);
      window.scrollTo(0, scope.messages.offsetHeight)
    }
  });

  // Creates HTML avatar
  function createAvatar(avatarUrl) {
    var avatar = document.createElement('img');

    avatar.setAttribute('class', 'avatar');
    avatar.setAttribute('src', avatarUrl);

    return avatar;
  };

  // Creates HTLM message
  function createMessage(klass, msg, avatar) {
    var message = document.createElement('li');

    message.setAttribute('class', klass);
    message.innerHTML = msg;
    message.appendChild(avatar);

    return message;
  };
};

NodeChat.prototype = {
  startChatApp: function() {
    var scope = this;

    this.setupForm.classList.add('boot-app');
    this.setupView.classList.add('hide');

    setTimeout(function() {
      scope.setupView.classList.add('hidden');
      scope.chatRoomView.classList.remove('hidden');
      scope.messageInput.focus();
    }, 500);
  }
};
