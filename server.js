const http = require('http'); //a default nodejs package
const app = require('./backend/app')

const port = process.env.PORT || 3000;
app.set('port', port);
const server = http.createServer(app);

server.listen(port);
