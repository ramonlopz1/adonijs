import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    // seleciona apenas os campos informados (vindos no payload)
    const userPayload = request.only(['email', 'username', 'password', 'avatar']) // request.all()
    const user = await User.create(userPayload)

    return response.created({ user })
  }

  public async readAll({ request, response }: HttpContextContract) {
    const userList = await User.all()

    return response.created(userList)
  }
}
