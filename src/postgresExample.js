// npm install sequelize (ele converte os objetos para tables)
// npm install pg-hstore pg
const Sequelize = require('sequelize');

const driver = new Sequelize(
    'heroes',
    'mauricio',
    '123', {
        host: 'localhost',
        dialect: 'postgres',
        quoteIdentifiers: false,
        operatorsAliases: false
    }

);

async function main() {
    const Herois = drive.define('heroes',{
        id: {
            type: Sequelize.INTEGER,
            require: true,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: Sequelize.STRING,
            require: true
        },
        poder: {
            type: Sequelize.STRING,
            require: true
        }
    },{
        tableName: 'TB_HEROIS',
        freezeTableName: false,
        timestamps: false
    });

    await Herois.sync();
    // await Herois.create({
    //     nome: 'Lanterna Verde',
    //     poder: 'Poder do Anel'
    // });

    const result = await Herois.findAll({
        raw: true,
        attributes: ['nome']
    });

    console.log('result',result);

}

main();
