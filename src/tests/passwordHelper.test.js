const assert = require('assert');
const PasswordHelper = require('./../helpers/passwordHelper');

const SENHA = '123'; //pokemon123456';
const HASH = '$2b$04$3QniVtrvEnloKFcnuQLfPeddHQ63cfgRfT9XbvMZNjhnqO6tHX4ba'; // '$2b$04$6NrFKC.TwIrME5LNS20t.eYPWLiCyY8TyBnDjNx7QdHUZl6WURafC';

describe('UserHelper test suite', function () {
  it('Deve gerar um hash a partir de uma senha', async ()=>{
    const result = await PasswordHelper.hashPassword(SENHA);

    // console.log('result',result);

    assert.ok(result.length>10);
  });

  it('Deve comparar um hash com uma senha', async ()=>{
    const result = await PasswordHelper.comparePassword(SENHA, HASH);

    assert.ok(result);
  });
});