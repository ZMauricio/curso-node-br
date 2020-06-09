const ICrud = require('./../interfaces/interfaceCRUD');
const Sequelize = require('sequelize');

class PostgreSQL extends ICrud {
    constructor(connection, schema) {
        super();
        this._connection = connection;
        this._schema = schema;
    }

    async isConnected() {
        try {
         await this._connection.authenticate();
         return true;
        } catch (error) {
            console.log('Error',error);
            return false;
        }
    }

    static async defineModel(connection, schema) {
     const model = connection.define(
        schema.name, schema.schema, schema.options
     );
     await model.sync();
     return model;
    }

    async create(item) {
     const { dataValues } = await this._schema.create(item);
     return dataValues;
    }

    async read(item ={}) {
     return await this._schema.findAll({where: item, raw: true}); 
    }

    async update(id, item, upsert=false) {
     const fn = upsert ? 'upsert': 'update';

     return this._schema[fn](item, {
         where: {id:id}
     });
    // return this._schema.update(item, {
    //     where: {id:id}
    // });
    }

    async delete(id) {
     const query = id ? {id:id}:{};
     return this._schema.destroy({where:query});
    }

    static async connect() {
        const connection = new Sequelize(
            'heroes',
            'mauricio',
            '123', {
                host: 'localhost',
                dialect: 'postgres',
                quoteIdentifiers: false,
                operatorsAliases: false,
                logging: true
            }
        );

        return connection;
    }
}

module.exports = PostgreSQL;