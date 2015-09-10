var recentMessages = [];
var oldMessages = [];
var subscribed = [];
var ws = new WebSocket("ws:localhost:3434");

ws.addEventListener("message", function(message){
  if(recentMessages.length > 100){
  	oldMessages.push(recentMessages.shift());
  	recentMessages.push(message);
  } else {
  	recentMessages.push(message);
  }
  
});



//Begin connection by sending list of channels
if(chrome.storage.sync.get("subscribed", function(){})){
  chrome.storage.sync.get("subscribed", function(item){
    subscribed = item.list;
  });
}

chrome.storage.sync.get({names:""}, function(elm){
	subscribed = elm.names;
	ws.send(JSON.stringify(
      {"type":"list",
       "users": subscribed}
    ));
});


