const assert = require('assert');
const api = require('./../api');
const Context = require('./../db/strategies/base/contextStrategy');
const Postgres = require('./../db/strategies/postgres/postgres');
const UsuarioSchema = require('./../db/strategies/postgres/schema/usuarioSchema');


let app = {};
const USER = {
    username: 'Paquita',
    password: '123'
};

const USER_DB = {
    username: USER.username.toLowerCase(),
    password: '$2b$04$3QniVtrvEnloKFcnuQLfPeddHQ63cfgRfT9XbvMZNjhnqO6tHX4ba'
};

describe('Auth test suite', function () {
    this.beforeAll(async ()=>{
     app = await api;

     const connectionPostgres = await Postgres.connect();
     const model = await Postgres.defineModel(connectionPostgres, UsuarioSchema);
     const postgres = new Context(new Postgres(connectionPostgres, model));

     await postgres.update(null, USER_DB, true);

    });

    it('Deve obter um token', async ()=>{
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USER
        });

        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);

        console.log('TOKEN dados', dados);

        assert.deepEqual(statusCode,200);
        assert.ok(dados.token.length > 10);
    });

    it('Deve retornar não autorizado quando for informado um login inválido', async ()=>{
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'Chaves',
                password: '123'
            }
        });

        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);

       

        assert.deepEqual(statusCode,401);
        assert.deepEqual(dados.error, 'Unauthorized');
    });
});