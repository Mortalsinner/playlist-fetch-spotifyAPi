const httpServer = require('http-server');
const open = require('open');

// Configure the server
const server = httpServer.createServer({
    root: './',
    cors: true
});

// Start the server on port 8080
const port = 8888;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
  open(`http://localhost:${port}`);
});
