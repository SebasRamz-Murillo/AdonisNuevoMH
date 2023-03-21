import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Role {
  public async handle ({ auth, response }: HttpContextContract, next: () => Promise<void>, allowedRoles: number[]) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const user = await auth.authenticate()
    const role = user.rol_id.toString()
    if (allowedRoles.includes(role)) {
      await next()
    } else {
      const respuesta = {
        status: 401,
        message: 'No tienes permisos para realizar esta acción',
        role: user.rol_id,
        permitidos: allowedRoles,
        error: true

      }
      response.send(respuesta)
    }
  }

}
