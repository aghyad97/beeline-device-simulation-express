var wsbroker = "localhost"; //mqtt websocket enabled broker
var wsport = 9001 // port for above

// create client using the Paho library
var client = new Paho.MQTT.Client(wsbroker, wsport,
  "myclientid_" + parseInt(Math.random() * 100, 10));
client.onConnectionLost = function (responseObject) {
  console.log("connection lost: " + responseObject.errorMessage);
};

function init() {
  client.connect(options);
}
window.setInterval(function () {

  console.log('1');
  client.onMessageArrived = function (message) {
    $('.location img').css({
      'width': '10cm',
      'height': '10cm',
      'position': 'relative',
      'transform': 'rotate(' + message + 'deg)',
    })
    console.log(message.destinationName, ' -- ', message.payloadString);
  };
  // $.ajax({
  //   type: 'GET',
  //   url: 'http://127.0.0.1:1337',
  //   dataType: 'JSON',
  //   success: function (data) {
  //     console.log(data);
  //     $('.location img').css({
  //       'width' : '10cm',
  //       'height' : '10cm',
  //       'position': 'relative',
  //       'transform': 'rotate(' + data + 'deg)',
  //     })
  //   }
  // });
}, 500);