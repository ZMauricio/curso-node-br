class NotImplementedException extends Error {
    constructor() {
        super("Not Implemented Exception");
    }
}

// Uma Interface no Java serve para garantir que todas as classes que a implementam
// devem implementar os seus métodos
// Porém, o JavaScript não possui interfaces. Portanto, a classe ICrud serve
// para simular a função de uma Interface para garantir que os bancos de dados implementem
// os métodos definidos por ela
class ICrud {
    create(item) {
     throw new NotImplementedException();
    }
    read(item) {
     throw new NotImplementedException();
    }
    update(id, item) {
     throw new NotImplementedException();
    }
    delete(id) {
     throw new NotImplementedException();
    }
}

class MongoDB extends ICrud {
    constructor() {
        super();
    }

    create(item) {
        console.log('O item foi salvo em MongoDB');
    }
}

class PostgreSQL extends ICrud {
    constructor() {
        super();
    }

    create(item) {
        console.log('O item foi salvo em PostgreSQL');
    }
}

class ContextStrategy {
    constructor(strategy) {
     this._database = strategy;
    }

    create(item) {
        return this._database.create(item);
    }
    read(item) {
        return this._database.read(item);
    }
    update(id, item) {
        return this._database.update(id,item);
    }
    delete(id) {
        return this._database.delete(id);
    }
}

const contextMongo = new ContextStrategy(new MongoDB());
contextMongo.create();

const contextPostgreSQL = new ContextStrategy(new PostgreSQL());
contextPostgreSQL.create();