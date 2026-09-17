const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);
  
  const ext = path.extname(filePath);
  const contentType = MIME[ext] || 'application/octet-stream';
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Serve index.html for SPA routing
        fs.readFile(path.join(__dirname, 'index.html'), (err2, data2) => {
          if (err2) {
            res.writeHead(500);
            res.end('Server Error');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data2);
        });
      } else {
        res.writeHead(500);
        res.end('Server Error');
      }
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Funky Chess server running on port ${PORT}`);
});
