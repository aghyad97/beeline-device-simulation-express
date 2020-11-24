// simple HTTP server using TCP sockets
var net = require('net');
var fs = require('fs');
var http = require('http');




var server = net.createServer(function (socket) {
  let angle;

  socket.on('data', function (data) {
    console.log(String(data));
    r = data.toString();
    if (r.substring(0, 4) == "POST") {
      var angleIndex = String(r).indexOf('angle');
      if (angleIndex != -1) angle = String(r).slice(angleIndex + 6);
      // if (r.substring(0, 3) == "GET" & r.length <= 600) { // if GET only

      //socket.write("OK");
      socket.write("HTTP/1.1 200 OK\n");
      socket.write("Content-Length: " + String(angle).length);
      socket.write("\n\n");
      socket.write(String(angle));
    }
    // socket.push(String(angle));
    if (r.substring(0, 5) == "GET /") {
      socket.write("HTTP/1.1 200 OK\n");
      console.log('here');
      console.log(angle);
      fs.readFile('../../direction.html', 'utf8', function (contents) {
        socket.write("Content-Length: " + String(angle).length);
        socket.write("\n\n");
        socket.write(String(angle));
      })
    }

    // } else console.log(r); // show the actual message

  });
  socket.on('close', function () {
    console.log('Connection closed');
  });
  socket.on('end', function () {
    console.log('client disconnected');
  });

  socket.on('error', function () {
    console.log('client disconnected');
  });
});
server.listen(1337, function () {
  console.log('server is listening on port 1337');
});