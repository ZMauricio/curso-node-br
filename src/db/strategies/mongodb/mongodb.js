const ICrud = require('../interfaces/interfaceCRUD');
const Mongoose = require('mongoose');
const STATUS = {
    0: 'Disconectado',
    1: 'Conectado',
    2: 'Conectando',
    3: 'Disconectando'
};

class MongoDB extends ICrud {
    constructor(connection, schema) {
        super();
        this._connection = connection;
        this._schema = schema;
    }

    create(item) {
     return this._schema.create(item);
    }

    read(item, skip=0, limit=10) {
     return this._schema.find(item).skip(skip).limit(limit);
    }

    update(id, item) {
        return this._schema.updateOne({_id: id}, {$set: item});
    }

    delete(id) {
        return this._schema.deleteOne({_id: id});
    }

    async isConnected() {
     const state = STATUS[this._connection.readyState];
     if(state==='Conectado') {
        return state;
     }
     
     if (state!=='Conectando') {
        return state;
     }
     
     await new Promise(resolve=>setTimeout(resolve, 1000));
     return STATUS[this._connection.readyState];
    }

    static connect(){
        Mongoose.connect('mongodb://mauricio:123@localhost:27017/heroes', { useNewUrlParser: true, useUnifiedTopology: true },
            function (error) {
                if (!error) {
                    return;
                } else {
                    console.log('Falha na conexão!', error);
                }
            }
        );

        const connection = Mongoose.connection;
        connection.once('open', () => console.log('Database rodando!!!'));

        return connection;
    }

    /*
       defineModel() {

     const heroiSchema = new Mongoose.Schema({
            nome: {
                type: String,
                required: true
            },
            poder: {
                type: String,
                required: true
            },
            insertedAt: {
                type: Date,
                default: new Date()
            }
        });
        
        this._schema = Mongoose.model('herois', heroiSchema);
    }
    */
}

module.exports = MongoDB;