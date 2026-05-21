const WebSocket = require('ws');
const net = require('net');
const http = require('http');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('OK');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  const tcp = net.createConnection(22, '127.0.0.1');

  ws.on('message', (data) => tcp.write(data));
  tcp.on('data', (data) => {
    if (ws.readyState === WebSocket.OPEN) ws.send(data);
  });

  ws.on('close', () => tcp.destroy());
  tcp.on('close', () => ws.terminate());
  ws.on('error', () => tcp.destroy());
  tcp.on('error', () => ws.terminate());
});

server.listen(PORT, () => console.log(`Running on port ${PORT}`));
