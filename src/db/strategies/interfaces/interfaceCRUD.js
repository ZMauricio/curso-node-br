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

    isConnected(){
     throw new NotImplementedException();
    }

    connect(){
     throw new NotImplementedException();
    }
}

module.exports = ICrud;