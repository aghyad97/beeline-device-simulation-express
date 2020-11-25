var wsbroker = "localhost"; //mqtt websocket enabled broker
var wsport = 9001 // port for above

// create client using the Paho library
var client = new Paho.MQTT.Client(wsbroker, wsport, "clientId");
var options = {
  timeout: 3,
  onSuccess: function () {
    console.log("mqtt connected");
    // Connection succeeded; subscribe to our topic, you can add multile lines of these        
    //use the below if you want to publish to a topic on connect
    client.subscribe("coordinates", {
      qos: 1
    });
  },
  onFailure: function (message) {
    console.log("Connection failed: " + message.errorMessage);
  }
};


$(document).ready(function () {
  client.connect(options);
  
  window.setInterval(function () {
    
    console.log('1');
    client.onMessageArrived = function (message) {
      console.log(message);
      $('.location img').css({
        'width': '10cm',
        'height': '10cm',
        'position': 'relative',
        'transform': 'rotate(' + message.payloadString + 'deg)',
      })
    };
  }, 500);
});