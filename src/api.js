// npm i @hapi/hapi
// npm install hapi-swagger --save
// npm install @hapi/inert --save
// npm install @hapi/vision --save
// npm install hapi-auth-jwt2 --save
// npm bcrypt // manipulação de senhas

const Hapi = require('@hapi/hapi');
const Context = require('./db/strategies/base/contextStrategy');
const MongoDb = require('./db/strategies/mongodb/mongodb');
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroisSchema');
const HeroRoute = require('./routes/heroRoutes');
const AuthRoute = require('./routes/authRoutes');
const Postgres = require('./db/strategies/postgres/postgres');
const UsuarioSchema = require('./db/strategies/postgres/schema/usuarioSchema');

const HapiSwagger = require('hapi-swagger');
const Vision = require('@hapi/vision');
const Inert = require('@hapi/inert');

// Pacote que garante que todos os serviços (rotas)
// precisarão de um token válido para serem usados
const HapiJWT2 = require('hapi-auth-jwt2');

const JWT_SECRET = 'MEU_SEGREDO_123';

// const app = new Hapi.Server({
//     port: 5000
// });

const app = new Hapi.server({
    port: 5000,
    host: 'localhost'
});

function mapRoutes(instance, methods) {
   return methods.map(method=>instance[method]());
}

async function main() {
 const connection = MongoDb.connect();
 const context = new Context(new MongoDb(connection, HeroiSchema));

 const connectionPostgres = await Postgres.connect();
 const model = await Postgres.defineModel(connectionPostgres, UsuarioSchema);
 const contextPostgres = new Context(new Postgres(connectionPostgres, model));
 
 const swaggerOptions = {
  info: {
    title: 'API Herois',
    version: 'V1.0',
  },
 };

 await app.register([
   HapiJWT2,
   Vision,
   Inert,
   {
     plugin: HapiSwagger,
     options: swaggerOptions
   }
 ]);

 // Cria uma estratégia de validação do usuário, chamada jwt, para em seguida fornecer ou não o token
 app.auth.strategy('jwt','jwt',{
    key: JWT_SECRET,

    validate: async (dado, request)=>{
      // Essa função vai checar se o usuário pode ter acesso aos serviços do sistema.
      // Exemplos de condições:
      // verifica no banco se o usuário continua ativo
      // verifica no banco se o usuário continua pagando
      console.log('dado',dado);

      const [result] = await contextPostgres.read({
        username: dado.username.toLowerCase()
      }); 

      if(!result) {
        return {
          isValid: false
        };
      }


      return {
        isValid: true // false, caso o usuário não possa ter acesso
      };
    }
 });

 app.auth.default('jwt');


// console.log('mapRoutes: ',mapRoutes(new HeroRoute(context), HeroRoute.methods()));
//  app.route([
//    ...mapRoutes(new HeroRoute(context), HeroRoute.methods())
//  ]);
 app.route([
  ...mapRoutes(new HeroRoute(context), HeroRoute.methods()),
  ...mapRoutes(new AuthRoute(JWT_SECRET, contextPostgres), AuthRoute.methods())
 ]);

 await app.start();
 console.log('Servidor rodando na porta: ', app.info.port);

 return app;
}

module.exports = main();