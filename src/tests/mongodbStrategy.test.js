const assert = require('assert');
const MongoDb = require('../db/strategies/mongodb/mongodb');
const Context = require('../db/strategies/base/contextStrategy');
const HeroiSchema = require('../db/strategies/mongodb/schemas/heroisSchema');


let context = {};

const MOCK_HEROI_CADASTRAR = {
    nome: 'Mulher Maravilha',
    poder: 'Laço'
};

const MOCK_HEROI_DEFAULT = {
    nome: `Spider Man-${Date.now()}`,
    poder: 'Spider Power'
};

const MOCK_HEROI_UPDATE = {
    nome: `Patolino-${Date.now()}`,
    poder: 'Velocidade'
};

let MOCK_HEROI_ID = null;

describe('MongoDb suíte de testes', function () {
   this.beforeAll(async ()=>{
    const connection = MongoDb.connect();
    context = new Context(new MongoDb(connection, HeroiSchema));

    await context.create(MOCK_HEROI_DEFAULT);
    const result = await context.create(MOCK_HEROI_UPDATE);
    MOCK_HEROI_ID = result._id;
   });

   it('Verificar conexão', async ()=>{
    const result = await context.isConnected();
    const expected = 'Conectado';

    console.log('result',result);

    assert.deepEqual(result, expected);
   }); 

   it('Cadastrar', async ()=>{
    const result = await context.create(MOCK_HEROI_CADASTRAR);
    const {nome, poder} = result;
    // console.log('result',result);

    assert.deepEqual({nome, poder}, MOCK_HEROI_CADASTRAR);

   });

   it('Listar', async ()=>{
    // const result = await context.read({nome: MOCK_HEROI_DEFAULT.nome});
    // console.log('result',result);

    const [{nome, poder}] = await context.read({nome: MOCK_HEROI_DEFAULT.nome});
    
    const result = {
        nome, poder
    };
    assert.deepEqual({nome, poder}, MOCK_HEROI_DEFAULT);

   });

   it('Atualizar', async ()=>{
    const result = await context.update(MOCK_HEROI_ID, {
        nome: 'Pernalonga'
    });

    assert.deepEqual(result.nModified, 1);
   });

   it('Deletar', async ()=>{
    const result = await context.delete(MOCK_HEROI_ID);
    assert.deepEqual(result.n, 1);
   });

});