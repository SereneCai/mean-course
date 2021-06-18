const http = require('http'); //a default nodejs package
const server = http.createServer((req, res)=>{
  res.end("this is the 1st response");
})

server.listen(process.env.PORT || 3000);
