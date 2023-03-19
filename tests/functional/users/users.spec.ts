import { UserFactory } from './../../../database/factories/index'
// @ts-ignore
import test from 'japa'
import supertest from 'supertest'
import Database from '@ioc:Adonis/Lucid/Database'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`
const userPayload = {
  email: 'testa@test.com',
  username: 'testa',
  password: 'testa',
  avatar: 'https://images.com/image/id/1',
}

test.group('User', (group) => {
  // @ts-ignore
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    return () => Database.rollbackGlobalTransaction()
  })

  test('it should create an user', async (assert) => {
    // faz requisição no endpoint /users do tipo post e envia o body
    const res = await supertest(BASE_URL).post('/api/users').send(userPayload).expect(201)

    // valida o payload enviado pelo usuário com o payload do reseponse.body da api
    assert.exists(res.body.user, 'User undefined')
    assert.exists(res.body.user.id, 'Id undefined')
    assert.equal(res.body.user.email, userPayload.email)
    assert.equal(res.body.user.username, userPayload.username)
    assert.equal(res.body.user.password, userPayload.password)
    assert.equal(res.body.user.avatar, userPayload.avatar)
  })

  test.only('it should get all users', async (assert) => {
    const { body } = await supertest(BASE_URL).get('/api/users').expect(201)
    body.forEach((user) => {
      assert.equal(user.username, userPayload.username)
    })
  })

  test('it should return 409 when email si already in use', async (assert) => {
    const { email } = await UserFactory.create()
    const { body } = await supertest(BASE_URL)
      .post('/api/users')
      .send({
        email,
        username: 'test',
        password: 'test',
      })
      .expect(409)
  })
})
