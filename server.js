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

  ws.on('message', (data) => {
    tcp.write(Buffer.isBuffer(data) ? data : Buffer.from(data));
  });

  tcp.on('data', (data) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data, { binary: true });
    }
  });

  ws.on('close', () => tcp.destroy());
  tcp.on('close', () => ws.terminate());
  ws.on('error', (e) => { console.log('ws error', e); tcp.destroy(); });
  tcp.on('error', (e) => { console.log('tcp error', e); ws.terminate(); });
});

server.listen(PORT, () => console.log(`Running on port ${PORT}`));
