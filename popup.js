var ws = new WebSocket("ws:localhost:3434");

var subscribed;

ws.addEventListener("message", function(event){
  var chunk = JSON.parse(event.data);
  view.log(chunk);
});

ws.addEventListener("error", function(error){
  console.log(error);
});

var lockToBottom = true;

var view = document.getElementById("messageContainer");
var visibleMessages = [];

var addChannel = function(channel){
  ws.send(channel);
}

view.log = function(chunk){
  var chatEntry = document.createElement("div");
  chatEntry.classList.add("chat-entry");
  chatEntry.title = chunk.time;

  var user = document.createElement("span");
  user.classList.add("user");
  user.textContent = chunk.user + ": ";
  
  var message = document.createElement("span");
  message.classList.add("message");
  message.textContent = chunk.msg;

  chatEntry.appendChild(user);
  chatEntry.appendChild(message);
  view.appendChild(chatEntry);
  visibleMessages.push(chatEntry);
  if(lockToBottom) {
    view.scrollTop = view.scrollHeight;
  } 
}

var start = Date.now(), end;
for(var i = 0; i < 100; ++i){
  view.log({"user":"blah",
            "time":"blah",
            "msg":"dkjldsfj"});
}
end = Date.now();
view.log({"msg":end - start});

document.body.addEventListener("wheel", function(){
  if((view.scrollHeight + 3) === (view.scrollTop + window.innerHeight)){
    lockToBottom = true;
  } else {
    lockToBottom = false;
  }
});
