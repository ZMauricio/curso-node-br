const assert = require('assert');
const api = require('./../api');

let app = {};

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlBhcXVpdGEiLCJpZCI6MSwiaWF0IjoxNTg5NTgwODA1fQ.6MRiiLB-XB2SYzCyCaNCTEJwfWPggjxQvowbcqitYko';

const headers = {
 Authorization: TOKEN
};

const MOCK_HEROI_CADASTRAR = {
  nome: 'Chapolin Colorado',
  poder: 'Marreta Biônica'
};

const MOCK_HEROI_INICIAL = {
 nome: 'Green Arrow',
 poder: 'Arrow'
};

let MOCK_ID = null;

describe('Suite de testes da API Heroes', function () {
    this.beforeAll(async ()=>{
        app = await api;

        const result = await app.inject({
          method: 'POST',
          url: '/herois',
          headers,
          payload: JSON.stringify(MOCK_HEROI_INICIAL)
        });

        const dados = JSON.parse(result.payload);
        MOCK_ID = dados._id;
    });

    it('Listar GET- /herois', async ()=>{
        const result = await app.inject({
            method: 'GET',
            headers,
            url: '/herois?skip=0&limit=10'
        });

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        // console.log('result',result);

        assert.deepEqual(statusCode, 200);
        assert.ok(Array.isArray(dados));
    });

    it('lista GET- /herois - deve retornar apenas 3 registros', async ()=>{
      const TAMANHO_LIMITE = 3;
      const result = await app.inject({
        method: 'GET',
        headers,
        url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
      });

      const dados = JSON.parse(result.payload);
      const statusCode = result.statusCode;

      console.log('dados',dados);
      console.log('dados.length',dados.length);
      assert.deepEqual(statusCode, 200);
      assert.ok(dados.length===TAMANHO_LIMITE);
    });


    it('listar GET- /herois - deve retornar erro se o valor de limit é inválido', async ()=>{
        const TAMANHO_LIMITE = 'AEEE';
        const result = await app.inject({
          method: 'GET',
          headers,
          url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
        });

        const errorResult= {
          "statusCode": 400,
          "error": "Bad Request",
          "message":"\"limit\" must be a number",
          "validation":{
              "source":"query",
              "keys":["limit"]
          }
        };
  
        assert.deepEqual(result.statusCode, 400);
        assert.deepEqual(result.payload, JSON.stringify(errorResult));
    });

    it('lista GET- /herois - deve filtrar um item', async ()=>{
        const TAMANHO_LIMITE = 1000;
        // const NOME = 'Spider Man-1589392819467';
        const NOME = MOCK_HEROI_INICIAL.nome;
        const result = await app.inject({
          method: 'GET',
          headers,
          url: `/herois?skip=0&limit=${TAMANHO_LIMITE}&nome=${NOME}`
        });
  
        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;
  
        // console.log('dados',dados);
        assert.deepEqual(statusCode, 200);
        assert.ok(dados[0].nome === NOME);
    });

    it('Cadastrar POST- /herois', async ()=>{
      const result = await app.inject({
        method: 'POST',
        url: `/herois`,
        headers,
        payload: MOCK_HEROI_CADASTRAR
      });

      const statusCode = result.statusCode;
      const {
        message,
        _id
      } = JSON.parse(result.payload);

      console.log('result.payload',result.payload);

      assert.ok(statusCode===200);
      assert.notStrictEqual(_id, undefined);
      assert.deepEqual(message, "Heroi cadastrado com sucesso!");
    });

    it('Atualizar PATCH- /herois/:id', async ()=>{
      const id = MOCK_ID;
      const expected = {
        poder: 'Super Mira'
      };

      const result = await app.inject({
        method: 'PATCH',
        url: `/herois/${id}`,
        headers,
        payload: JSON.stringify(expected)
      });

      const statusCode = result.statusCode;
      const dados = JSON.parse(result.payload);

      assert.ok(statusCode===200);
      assert.deepEqual(dados.message, 'Herói atualizado com sucesso!');
    });


    it('Atualizar PATCH- /herois/:id = Não deve atualizar com id incorreto', async ()=>{
      // const id = `${MOCK_ID}01`;//testar o erro com id inválido
      const id = `5ebdf479ded32b1aa10d84da`;
      const expected = {
        poder: 'Super Mira'
      };

      const result = await app.inject({
        method: 'PATCH',
        url: `/herois/${id}`,
        headers,
        payload: JSON.stringify(expected)
      });

      const statusCode = result.statusCode;
      const dados = JSON.parse(result.payload);
      
      // console.log('dados',dados);

      // assert.ok(statusCode===200);
      // assert.deepEqual(dados.message, 'Id não encontrado no banco!');
      const resposta = {
        statusCode: 412,
        error: 'Precondition Failed',
        message: 'Id não encontrado no banco!'
      };
      
      
      assert.ok(statusCode===412);
      
      assert.deepEqual(dados, resposta);
    });

    it('Remover DELETE- /herois/:id', async ()=>{
      const id = MOCK_ID;
      const result = await app.inject({
        method: 'DELETE',
        headers,
        url: `/herois/${id}`,
      });

      const statusCode = result.statusCode;
      const dados = JSON.parse(result.payload);

      assert.ok(statusCode===200);
      assert.deepEqual(dados.message, 'Herói removido com sucesso!');
    });

    it('Remover DELETE- /herois/:id - simular erro na remoção', async ()=>{
      const id = '5ebdf479ded32b1aa10d84da';

      const expected = {
        statusCode: 412,
        error: 'Precondition Failed',
        message: 'Id não encontrado no banco!'
      };

      const result = await app.inject({
        method: 'DELETE',
        headers,
        url: `/herois/${id}`,
      });

      const statusCode = result.statusCode;
      const dados = JSON.parse(result.payload);

      // console.log('TESTE dados', dados);

      assert.ok(statusCode===412);
      assert.deepEqual(dados, expected);
    });

    it('Remover DELETE- /herois/:id - simular erro com ID inválido na remoção', async ()=>{
      const id = 'ID_INVÁLIDO';

      const expected = {
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'An internal server error occurred'
      };

      const result = await app.inject({
        method: 'DELETE',
        headers,
        url: `/herois/${id}`,
      });

      const statusCode = result.statusCode;
      const dados = JSON.parse(result.payload);

      console.log('TESTE dados', dados);

      assert.ok(statusCode===500);
      assert.deepEqual(dados, expected);
    });
});