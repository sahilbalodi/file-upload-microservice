const Hapi = require('hapi');
const routes = require('./routes')


const Port = 8080;
const server = new Hapi.Server();
server.connection({
  host: '0.0.0.0',
  port: Port,
});

server.route([routes]);

const start = async () => {
  await server.start();
  console.log('server running at port :', server.info.uri);
};
start();
