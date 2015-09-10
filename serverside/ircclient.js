var irc = require('irc');
var client = new irc.Client('irc.twitch.tv', 'shinpiplup', {
  "channels" : ['#tsm_dyrus', '#tsm_bjergsen', '#esea', '#tsm_santorin'],
  "password" : "oauth:vcna25phbdqya03v8om3f5evnglh5x"
});

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 3434});

var messages = [];
var connections = [];

wss.on("connection", function connection(ws){
  ws.on("message", function(message){
    client.join("#" + message);
  });
  connections.push(ws);
});

client.addListener('error', function(message){
  console.error(message);
});

client.addListener('join', function(channel, nick, message){
  console.log("joined: ", channel, nick, message);
  // console.log(channel);
  // console.log(nick);
  // console.log(message);
});

client.addListener('message', function(user, channel, message){
  var msgObj = {
    "user" : user,
    "ch" : channel,
    "msg" : message,
    "time" : new Date()
  };
  console.log(msgObj);
  for(var i = 0; i < connections.length; ++i){
    try{
      connections[i].send(JSON.stringify(msgObj));
    }catch(e){
      connections.splice(i, 1);
      console.log("Socket not open. Thrown out.");
    }
  }
});
