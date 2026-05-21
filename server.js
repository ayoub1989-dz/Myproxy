const net = require('net');
const http = require('http');

const PORT = process.env.PORT || 8080;

const server = http.createServer(function(req, res) {
  res.writeHead(200);
  res.end('OK');
});

server.on('upgrade', function(req, socket) {
  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
    'Upgrade: websocket\r\n' +
    'Connection: Upgrade\r\n' +
    '\r\n'
  );

  const tcp = net.createConnection(22, '127.0.0.1');

  socket.pipe(tcp);
  tcp.pipe(socket);

  socket.on('error', function() { tcp.destroy(); });
  tcp.on('error', function() { socket.destroy(); });
  socket.on('close', function() { tcp.destroy(); });
  tcp.on('close', function() { socket.destroy(); });
});

server.listen(PORT, function() {
  console.log('Listening on port ' + PORT);
});
