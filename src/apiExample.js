//npm i @hapi/hapi
const Hapi = require('@hapi/hapi');
const Context = require('./db/strategies/base/contextStrategy');
const MongoDb = require('./db/strategies/mongodb/mongodb');
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroisSchema');


// const app = new Hapi.Server({
//     port: 5000
// });

const app = new Hapi.server({
    port: 5000,
    host: 'localhost'
});

async function main() {
 const connection = MongoDb.connect();
 const context = new Context(new MongoDb(connection, HeroiSchema));

 app.route([
    {
     path: '/herois',
     method: 'GET',
     handler: (request, head)=>{
        return context.read();
     }
    }
 ]);

 await app.start();
 console.log('Servidor rodando na porta: ', app.info.port);
}

main();




// 'use strict';

// const Hapi = require('@hapi/hapi');

// const init = async () => {

//     const server = Hapi.server({
//         port: 5000,
//         host: 'localhost'
//     });

//     server.route({
//         method: 'GET',
//         path: '/',
//         handler: (request, h) => {

//             return 'Hello World!';
//         }
//     });

//     await server.start();
//     console.log('Server running on %s', server.info.uri);
// };

// process.on('unhandledRejection', (err) => {

//     console.log(err);
//     process.exit(1);
// });

// init();