const hapi = require('hapi');
const moongose = require('mongoose');
const {
  graphqlHapi,
  graphiqlHapi
} = require('apollo-server-hapi');

const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');

const Painting = require('./models/painting');

const schema = require('./graphql/schema');

moongose.connect("mongodb://admin@localhost:27017/powerful-api");

moongose.connection.on('open', () => {
  console.log('Db connection opened!');
});

const server = hapi.server({
  port: 4000,
  host: 'localhost'
});

const swaggerOptions = {
  info: {
    title: 'Test API Documentation',
    version: Pack.version,
  },
};

const init = async () => {

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    }
  ]);

  await server.register({
    plugin: graphiqlHapi,
    options: {
      path: '/graphiql',
      graphiqlOptions: {
        endpointURL: '/graphql',
      },
      route: {
        cors: true,
      }
    }
  });

  await server.register({
    plugin: graphqlHapi,
    options: {
      path: '/graphql',
      graphqlOptions: {
        schema,
      },
      route: {
        cors: true,
      }
    }
  });

  server.route([{
    method: 'GET',
    path: '/',
    handler: () => `Hello world`,
  }, {
    method: 'GET',
    path: '/api/v1/paintings',
    handler: (request, reply) => Painting.find(),
  }, {
    method: 'POST',
    path: '/api/v1/paintings',
    handler: (request, reply) => {
      const {
        name,
        url,
        technique
      } = request.payload;
      const painting = new Painting({
        name,
        url,
        technique
      })
      return painting.save();
    }
  }]);

  await server.start();
}

init();
