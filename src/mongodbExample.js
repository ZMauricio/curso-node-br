// npm install mongoose
const Mongoose = require('mongoose');
Mongoose.connect('mongodb://mauricio:123@localhost:27017/heroes', {useNewUrlParser: true},
    function (error){
      if(!error) {
        return;
      } else {
          console.log('Falha na conexão!', error);
      }
    }
);

const connection = Mongoose.connection;
connection.once('open', ()=>console.log('Database rodando!!!'));

/*
setTimeout(() => {
 const state = connection.readyState;
 console.log('state',state);
}, 1000);
*/
/*
 state
 0: Disconectado
 1: Conectado
 2: Conectando
 3: Disconectando
*/

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

const model = Mongoose.model('herois', heroiSchema);

async function main() {
  const resultCadastrar = await model.create({
      nome: 'Superman',
      poder: 'Voar'
  });

  console.log('resultCadastrar',resultCadastrar);

  const listItem = await model.find();
  console.log('listItem',listItem);
}

main();
