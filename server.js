const http = require('http');

const dotenv = require('dotenv');
dotenv.config();
const app = require('./app');

const port = process.env.PORT;
const server = http.createServer(app);

// initializeSocket(server);

server.listen(port,()=>{
    console.log("server is live now"+port);
})