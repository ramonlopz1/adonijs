import { test } from '@japa/runner'

test('display welcome page', async ({ client }) => {
  const response = await client.get('/')
  const hworld = {
    nome: 'world',
  }

  response.assertStatus(200)
  response.assertTextIncludes(hworld.nome)
  response.assert
})
