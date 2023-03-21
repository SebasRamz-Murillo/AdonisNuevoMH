import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Activo {
  public async handle ({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const user = await auth.authenticate()
    if (user.activo === 1) {
      await next()
    } else {
      const respuesta = {
        status: 401,
        message: 'No estas activo',
        error: true

      }
      response.send(respuesta)
    }
  }
}
