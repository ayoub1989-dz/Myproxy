const net = require('net');
const http = require('http');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('OK');
});

server.on('upgrade', (req, socket) => {
  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
    'Upgrade: websocket\r\n' +
    'Connection: Upgrade\r\n' +
    '\r\n'
  );

  const tcp = net.createConnection(22, '127.0.0.1');

  socket.pipe(tcp);
  tcp.pipe(socket);

  socket.on('error', () => tcp.destroy());
  tcp.on('error', () => socket.destroy());
  socket.on('close', () => tcp.destroy());
  tcp.on('close', () => socket.destroy());
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
  ws.on('close', () => tcp.destroy());
  tcp.on('close', () => ws.terminate());
  ws.on('error', () => tcp.destroy());
  tcp.on('error', () => ws.terminate());
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
