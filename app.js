var gravatar = require('node-gravatar'),
    express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    port = process.env.PORT || 3000;

app.use('/public', express.static(__dirname+'/public'));

app.get('/', function(req, res){
  res.sendFile('index.html', { root: __dirname });
});

io.on('connection', function(socket){
  console.log('user connected');

  io.emit('register', socket.id);

  socket.on('chat message', function(msg){
    var avatar = gravatar.get(this.email, null, 40);
    io.emit('chat message', msg, this.id, avatar);
  });

  socket.on('user setup', function(email) {
    this.email = email;
  });
});

http.listen(port, function(){
  console.log('listening on *:3000');
});
