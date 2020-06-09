const Bcrypt = require('bcrypt');
const { promisify } = require('util');

const hashAsync = promisify(Bcrypt.hash);
const compareAsync = promisify(Bcrypt.compare);
// SALT é Parâmetro que define a complexidade do algoritmo,
// em que quanto maior é a complexidade, maior é o tempo de execução dele.
const SALT = 3;
class PasswordHelper {
    static hashPassword(pass) {
        return hashAsync(pass, SALT);
    }
    static comparePassword(pass, hash) {
        return compareAsync(pass, hash);
    }
}

module.exports = PasswordHelper;