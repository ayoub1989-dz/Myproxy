const WebSocket = require('ws');
const net = require('net');
const http = require('http');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('SSH WebSocket Server');
});

server.on('upgrade', (req, socket, head) => {
  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
    'Upgrade: websocket\r\n' +
    'Connection: Upgrade\r\n' +
    '\r\n'
  );

  const tcp = net.createConnection(22, '127.0.0.1', () => {
    console.log('SSH connected');
  });

  socket.on('data', (data) => tcp.write(data));
  tcp.on('data', (data) => socket.write(data));

  socket.on('close', () => tcp.destroy());
  tcp.on('close', () => socket.destroy());
  socket.on('error', () => tcp.destroy());
  tcp.on('error', () => socket.destroy());
});

server.listen(PORT, () => console.log(`Running on port ${PORT}`));
