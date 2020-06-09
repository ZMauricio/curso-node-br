const BaseRoute = require('./base/baseRoute');
const Joi = require('@hapi/joi');
const Boom = require('boom');

// npm install jsonwebtoken
const JWT = require('jsonwebtoken');
const PasswordHelper = require('./../helpers/passwordHelper');

const failAction = (request, headers, error)=> {
  throw error;
};

const USER = {
    username: 'Paquita',
    password: '123'
};

class AuthRoutes extends BaseRoute {
    constructor(secret, db) {
        super();
        this.secret = secret;
        this.db = db;
    }

    login() {
        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false,// importante
                tags: ['api'],
                description: 'Obter o token',
                notes: 'Faz o login com user e password do banco',
                validate: {
                    failAction: failAction,
                    payload: Joi.object({
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    })
                }
            },
            handler: async (request)=>{
                const {
                    username,
                    password
                } = request.payload;

                // Antes era:
                // if(username.toLowerCase()!== USER.username.toLowerCase() ||
                //    password.toLowerCase()!== USER.password.toLowerCase()) {
                //     return Boom.unauthorized();
                // }

                const [usuario] = await this.db.read({
                    username: username.toLowerCase()
                });

                if(!usuario) {
                 return Boom.unauthorized('O usuário informado não existe!');
                }

                const match = PasswordHelper.comparePassword(password, usuario.password);

                if(!match) {
                 return Boom.unauthorized('Usuário ou senha inválidos!');
                }

                const token = JWT.sign({
                    username: username,
                    id: usuario.id
                }, this.secret);

                return {
                    token
                };

            }
        };
    }
}

module.exports = AuthRoutes;