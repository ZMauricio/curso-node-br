const assert = require('assert');
const Postgres = require('../db/strategies/postgres/postgres');
const Context = require('../db/strategies/base/contextStrategy');
const HeroiSchema = require('./../db/strategies/postgres/schema/heroisSchema');


const MOCK_HEROI_CADASTRAR = {
    nome: 'Shazam',
    poder: 'Super Force'
};

const MOCK_HEROI_ATUALIZAR = {
    nome: 'Green Arrow',
    poder: 'Arrows'
};

let context = {};

describe('PostgreSQL Strategy', function () {
    this.timeout(Infinity);

    this.beforeAll(async function () {
       const connection = await Postgres.connect();
       const model = await Postgres.defineModel(connection, HeroiSchema);
       context = new Context(new Postgres(connection, model));

       await context.delete();
       await context.create(MOCK_HEROI_ATUALIZAR);
    });

    it('PostgreSQL Connection', async function () {
        const result = await context.isConnected();
        assert.equal(result, true);
    });

    it('Cadastrar', async function () {
        const result = await context.create(MOCK_HEROI_CADASTRAR);
        
        delete result.id;
        
        console.log('result',result);
        console.log('MOCK_HEROI_CADASTRAR',MOCK_HEROI_CADASTRAR);

        assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
    });

    it('Listar', async function () {
     const [result] = await context.read({nome: MOCK_HEROI_CADASTRAR.nome});
     // Pegar primeira posição
     // const posicaoZero = result[0];
     // const [posicaoUm, posicaoDois] = ['esse é o Um', 'esse é o Dois'];
     delete result.id;

     assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
    });

    it('Atualizar', async function () {
     const [itemAtualizar] = await context.read({nome: MOCK_HEROI_ATUALIZAR.nome});
     //Abaixo, MOCK_HEROI_ATUALIZAR tem apenas o campo nome alterado
     const novoItem = {
        ...MOCK_HEROI_ATUALIZAR,
        nome: 'Wonder Woman'
     };

     const [result] = await context.update(itemAtualizar.id, novoItem);

     const [atualizarResult] = await context.read({id: itemAtualizar.id});

     // assert.deepEqual(result.nome, novoItem.nome);
     assert.deepEqual(result, 1);
     assert.deepEqual(atualizarResult.nome, novoItem.nome);
     

     // No JavaScript há uma técnica chamada rest/spread que é um método
     // usada para fazer o merge(unir) entre objetos ou então separa um objeto
     /*
        {
            nome: 'Green Arrow',
            poder: 'Arrows'
        }
        // +
        {
            dataNascimento: '11-05-2020'
        }

        é igual a:
        {
            nome: 'Green Arrow',
            poder: 'Arrows',
            dataNascimento: '11-05-2020'
        }
     */


    });

    it('Remover por ID', async function () {
     const [item] = await context.read({});
     const result = await context.delete(item.id);

     assert.deepEqual(result, 1);
    });
    
});