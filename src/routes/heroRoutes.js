const BaseRoute = require('./base/baseRoute');
const Joi = require('@hapi/joi');
const Boom = require('boom');

const failAction = (request, headers, error)=> {
  throw error;
};

// Todas as rotas usarão headers para validar se o corpo da requisição
// está com o objeto conforme a necessidade
const headers = Joi.object({
  authorization: Joi.string().required() 
}).unknown();

class HeroRoutes extends BaseRoute {
    constructor(db) {
     super();
     this.db = db;
    }
    list() {
      return {
        path: '/herois',
        method: 'GET',
        config: {
          tags: ['api'],
          description: 'Deve listar heróis',
          notes: 'pode paginar os resultados e filtrar por nome',
          validate: {
            // payload-> body
            // headers-> header
            // params-> na URL :id
            // query-> ?skip=10&limit=1000&nome=name
            failAction: failAction,
            query: Joi.object({
              skip: Joi.number().integer().default(0),
              limit: Joi.number().integer().default(10),
              nome: Joi.string().min(3).max(100)
            }),
            headers,
            //headers é colocado aqui pois há uma query
          }
        },
        handler: (request, headers)=>{
          try {
            const {
              skip, 
              limit, 
              nome
            } = request.query;

            console.log('skip',skip);
            console.log('limit',limit);
            console.log('nome',nome);

            

            // throw Error('Erro test');

            // const query = nome ? {nome: nome} : {};
            const query = nome ? {nome: {$regex: `.*${nome}*.`} } : {};

            // Bloco comentado pois o Joi já faz a validação dos dados
            // let query = {};
            // if(nome) {
            //   query.nome = nome;
            // }

            // if(isNaN(skip))
            //   throw Error('O tipo do skip é incorreto');
            // if(isNaN(limit))
            //   throw Error('O tipo do limit é incorreto');

            return this.db.read(nome?query:{}, skip, limit);
          } catch (error) {
            console.log('list:',error);
            // return 'Erro interno no servidor';
            return Boom.internal();
          }
        }
      };
    }
    create() {
        return {
            path: '/herois',
            method: 'POST',
            config: {
              tags: ['api'],
              description: 'Deve cadastrar o herói',
              notes: 'Deve cadastrar o herói por nome e poder',
              validate: {
                failAction: failAction,
                headers,// headers colocado aqui pois há validação (não há query)
                payload: Joi.object({
                    nome: Joi.string().required().min(3).max(100),
                    poder: Joi.string().required().min(2).max(100)
                })
              }
            },
            handler: async (request) => {
              try {
                const {nome, poder} = request.payload;
                const result = await this.db.create({nome, poder});
                console.log('result',result);
                return {
                  message: 'Heroi cadastrado com sucesso!',
                  _id: result._id
                };
              } catch (error) {
                 console.log('DEU RUIM',error);
                 // return 'Internal Error!';
                 return Boom.internal();
              }
            }
        };
    }

    update() {
      return {
        path: '/herois/{id}',
        method: 'PATCH',
        config: {
          tags: ['api'],
          description: 'Deve atualizar o herói por id',
          notes: 'Pode atualizar qualquer campo',
          validate: {
            params: Joi.object({ id: Joi.string().required() }),
            headers,
            payload: Joi.object({
                nome: Joi.string().min(3).max(100),
                poder: Joi.string().min(2).max(100)
            })
          }
        },
        handler: async (request)=>{
          try {
            const { id } = request.params;
            const { payload } = request;

            const dadosString = JSON.stringify(payload);
            // dadas recebe dadosString convertido para Objeto, porém, se algum
            // atributo (nome, poder) estive undefined ou null ele será ignorado, fazendo
            // com que o objeto seja formado apenas pelos atributos que possuem valores válidos
            const dados = JSON.parse(dadosString);
            const result = await this.db.update(id, dados);
            console.log('result',result);
            
            if(result.nModified !== 1) {
              // return {
              //   message: 'Não foi possível atualizar!'
              // };
              return Boom.preconditionFailed('Id não encontrado no banco!');
            }
            return {
                message: 'Herói atualizado com sucesso!'
            };
          } catch (error) {
             console.error('DEU RUIM',error);
             // return 'Erro interno!';
             return Boom.internal();
          }
        }
      };
    }

    delete() {
      return {
        path: '/herois/{id}',
        method: 'DELETE',
        config: {
          tags: ['api'],
          description: 'Deve remover o herói por id',
          notes: 'O id deve ser válido',
          validate: {
            failAction: failAction,
            headers,
            params: Joi.object({ id: Joi.string().required() })
          }
        },
        handler: async (request)=>{
          try {
            const {id} = request.params;
            const result = await this.db.delete(id);

            console.log('DELETE - result',id);

            console.log('DELETE - result',result);

            if(result.n !==1) {
              // return {
              //   message: 'Não foi possível remover o item!'
              // };
              return Boom.preconditionFailed('Id não encontrado no banco!');
            }
            return {
              message: 'Herói removido com sucesso!'
            };
          } catch (error) {
             console.error('DEU RUIM',error);
             // return 'DELETE: Erro interno!';
             return Boom.internal();
          }
        }
      };
    }
}

module.exports = HeroRoutes;