const { expect, sinon, request } = require('./testHelper')
const dependency = require('../lib/dependency')
const app = require('../lib/app')
const { UnexpectedError } = require('../lib/errors')

beforeEach(() => {
  sinon.stub(dependency, 'getRandomNumber')
})

// Verification que tout est fonctionnel
describe('un test qui est vert', () => {
  let response

  beforeEach(async () => {
    response = await request(app).get('/status')
  })

  it('le status de réponse est 200', () => {
    expect(response).to.have.status(200)
  })

  it('le body de réponse contient status = ok', () => {
    const expectedResponseBody = { status: 'ok' }
    expect(response).to.be.json
    expect(response.body).to.deep.equal(expectedResponseBody)
  })
})

// Question 1
// Ajouter une route GET /number qui retourne un nombre aléatoire
// Il faut récupérer le nombre aléatoire en utilisant dependency.getRandomNumber
// Le retour doit être un json au format suivant : { number: 20 }
describe('appel GET /number', () => {
  let response
  let number

  beforeEach(async () => {
    number = Math.floor(Math.random() * 100)
    dependency.getRandomNumber.resolves(number)

    response = await request(app).get('/number')
  })

  it('le status de réponse est 200', () => {
    expect(response).to.have.status(200)
  })

  it('le body de réponse contient le nombre généré', () => {
    const expectedResponseBody = { number: number }
    expect(response).to.be.json
    expect(response.body).to.deep.equal(expectedResponseBody)
  })
})

// Question 2
// Ajouter une route POST /multiply qui retourne un nombre passé en argument au carré
// Il faut récupérer le nombre depuis le body { number: 2 }
// Le retour doit être un json au format suivant : { number: 32 }
describe.skip('appel POST /multiply', () => {
  let response
  let bodyNumber
  let dependencyNumber

  beforeEach(async () => {
    dependencyNumber = Math.floor(Math.random() * 100)
    bodyNumber = Math.floor(Math.random() * 100)
    dependency.getRandomNumber.resolves(dependencyNumber)

    response = await request(app)
      .post('/multiply')
      .send({ 'number': bodyNumber })
  })

  it('le status de réponse est 200', () => {
    expect(response).to.have.status(200)
  })

  it('le body de réponse contient le nombre généré', () => {
    const expectedNumber = bodyNumber * dependencyNumber
    const expectedResponseBody = { number: expectedNumber }

    expect(response).to.be.json
    expect(response.body).to.deep.equal(expectedResponseBody)
  })
})

// Question 3
// Modifier la une route POST /multiply pour retourner un status 400
// si la clé number n'est pas présente dans le body
// Le body de retour doit contenir { error: 'number is absent from request body' }
describe.skip('appel POST /multiply 400 error', () => {
  let response
  let dependencyNumber

  beforeEach(async () => {
    dependencyNumber = Math.floor(Math.random() * 100)
    dependency.getRandomNumber.resolves(dependencyNumber)

    response = await request(app)
      .post('/multiply')
      .send({ 'anOtherKey': 'a string !' })
  })

  it('le status de réponse est 400', () => {
    expect(response).to.have.status(400)
  })

  it('le body de réponse contient le message d’erreur attendu', () => {
    const expectedResponseBody = { error: 'number is absent from request body' }
    expect(response).to.be.json
    expect(response.body).to.deep.equal(expectedResponseBody)
  })
})

// Question 4
// Modifier la une route POST /multiply pour retourner un status 422
// si le résultat est plus grand que 1024
// Le body de retour doit contenir { error: 'multiplied number is too big' }
describe.skip('appel POST /multiply 422 error', () => {
  let response
  let bodyNumber
  let dependencyNumber

  beforeEach(async () => {
    dependencyNumber = 97
    bodyNumber = 12
    dependency.getRandomNumber.resolves(dependencyNumber)

    response = await request(app)
      .post('/multiply')
      .send({ 'number': bodyNumber })
  })

  it('le status de réponse est 422', () => {
    expect(response).to.have.status(422)
  })

  it('le body de réponse contient le message d’erreur attendu', () => {
    const expectedResponseBody = { error: 'multiplied number is too big' }
    expect(response).to.be.json
    expect(response.body).to.deep.equal(expectedResponseBody)
  })
})

// Question 5
// Modifier la une route POST /multiply pour gérer un cas d'erreur
// sur la fonction getRandomNumber
// Le faire en utilisant un middleware de gestion d'erreur
// Le body de retour doit contenir { error: 'unexpected error' } et un status 500
describe.skip('appel POST /multiply 500 error', () => {
  let response
  let bodyNumber
  let dependencyNumber

  beforeEach(async () => {
    dependencyNumber = 97
    bodyNumber = 12
    dependency.getRandomNumber.rejects(new UnexpectedError())

    response = await request(app)
      .post('/multiply')
      .send({ 'number': bodyNumber })
  })

  it('le status de réponse est 500', () => {
    expect(response).to.have.status(500)
  })

  it('le body de réponse contient le message d’erreur attendu', () => {
    const expectedResponseBody = { error: 'unexpected error' }
    expect(response).to.be.json
    expect(response.body).to.deep.equal(expectedResponseBody)
  })
})

// Question 6
// Modifier la l'application pour gérer les erreurs 404
// Le faire en utilisant un middleware catch all
// Le body de retour doit contenir { error: 'route not found' } et un status 404
describe.skip('appel POST /not/a/route 404 error', () => {
  let response

  beforeEach(async () => {
    response = await request(app).get('/not/a/route')
  })

  it('le status de réponse est 404', () => {
    expect(response).to.have.status(404)
  })

  it('le body de réponse contient le message d’erreur attendu', () => {
    const expectedResponseBody = { error: 'route not found' }
    expect(response).to.be.json
    expect(response.body).to.deep.equal(expectedResponseBody)
  })
})
