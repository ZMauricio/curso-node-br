// docker ps
// docker exec -it 3a7735407936 mongo -u mauricio -p 123 --authenticationDatabase heroes

// show dbs // mostra todos os bancos disponíveis
// use heroes // define que o database é heroes, muda o contexto para uma database específica
// show collections // visualiza as coleções de documentos (tabelas)

// CREATE
// insere no banco
db.heroes.insert({
    nome: 'Flash',
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'
});

// Loops podem ser usados
for (let i=0; i<10; i++) {
    db.heroes.insert({
        nome: `Clone${i}`,
        poder: 'Velocidade',
        dataNascimento: '1998-01-01'
    }); 
}


// READ
// Lista todos os documentos
db.heroes.find();
// Lista todos os documentos formatados
db.heroes.find().pretty();
// Retorna o primeiro documento da lista
db.heroes.findOne();
// Retorna o primeiro documento da lista cujo nome é igual
// ao informado
db.heroes.find({nome: 'Superman'});

// Lista todos os N primeiros documentos
// em ordem decrescente
db.heroes.find().limit(5).sort({nome: -1});
// Lista todos documentos, mas apenas mostra o atributo poder
// e força que o id não é apresentado
db.heroes.find({}, { poder:1, _id:0 });

// Conta o número de documentos
db.heroes.count();

// UPDATE
// Atualiza o nome do heróis com _id igual a ObjectId("5ebb526646e5517854191130"), ou seja,
// o object JSON
db.heroes.update({_id: ObjectId("5ebb526646e5517854191130")}, {
    nome: 'Superman'
});
// É semelhante ao anterior, porém o $set evita que os demais campos sejam removidos
db.heroes.update({_id: ObjectId("5ebb53c346e551785419113a")}, {
  $set:{nome: 'Aquaman'}
});


// DELETE
// {} indica que todos os heroes são removidos da base
db.heroes.remove({});
// remove o heroe com nome igual a Aquaman
db.heroes.remove({nome: 'Aquaman'});



