import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { Queue, Worker } from 'bullmq'
import Mail from '@ioc:Adonis/Addons/Mail'
import Route from '@ioc:Adonis/Core/Route'
import Hash from '@ioc:Adonis/Core/Hash'
import Logger from '@ioc:Adonis/Core/Logger'
import axios from 'axios'
const frontend = 'http://192.168.120.87:4200/registro/'
const backend = 'http://192.168.120.87:3333'

export default class UsersController {
  public async registrarUsuario({ request }: HttpContextContract) {
    const newPostSchema = schema.create({
      name: schema.string([rules.required()]),
      email: schema.string(),
      password: schema.string(),
      ap_materno: schema.string(),
      ap_paterno: schema.string(),
      telefono: schema.string(),
    })
    const payload = await request.validate({ schema: newPostSchema })
    if (!payload) {
      return 'Error'
    }
    const user = new User()
    user.name = request.input('name')
    user.email = request.input('email')
    user.password = await Hash.make(request.input('password'))
    user.ap_materno = request.input('ap_materno')
    user.ap_paterno = request.input('ap_paterno')
    user.telefono = request.input('telefono')
    user.activo = false
    user.rol_id = 2

    if (await user.save()) {
      const url = backend + Route.makeSignedUrl('verify', { id: user.id },
        { expiresIn: '1 day' })

      /*const queue= new Queue('email')
        const job = await queue.add('send-email',  { email:user.email , name: user.name, url:url })*/


      await Mail.send((message) => {
        message
          .from('sebastian.rmz.manuel@outlook.com')
          .to(user.email)
          .subject('Welcome Onboard!')
          .htmlView('emails/welcome', { name: user.name, url: url })
      })
      return 'ok'
    }

  }

  public async verify({ request, params, response }: HttpContextContract) {
    if (!request.hasValidSignature()) {
      response.abort('Invalid signature', 401)
    }
    const user = await User.findOrFail(params.id)
    const nRandom = Math.floor(Math.random() * 9000) + 1000

    user.codigo = nRandom
    if (await user.save()) {

      const urlSigned = Route.makeSignedUrl('codigo', { id: user.id },
        { expiresIn: '1 day' })
      const url = backend + urlSigned

      axios.post('https://rest.nexmo.com/sms/json', {
        from: 'Nexmo',
        to: "52" + user.telefono,
        text: 'Tu codigo de verificacion es: ' + nRandom,
        api_key: '22bd2a4a',
        api_secret: 'KPOZLO3r34vSCZGw'
      })

      await Mail.send((message) => {
        message
          .from('sebastian.rmz.manuel@outlook.com')
          .to(user.email)
          .subject('Welcome Onboard!')
          .htmlView('emails/correo_enviado', { name: user.name, nRandom: nRandom, url: url })
      })
      response.redirect(frontend + encodeURIComponent(urlSigned));
    }
  }

  public async codigo({ request, params }: HttpContextContract) {
    Logger.info(params.id)
    const user = await User.findOrFail(params.id)
    const codigoUsuario = user.codigo
    if (codigoUsuario == request.input('codigo')) {
      user.activo = true
      if (await user.save()) {
        return [{
          "status": 200,
          "mensaje": "Usuario activado correctamente.",
          "error": [],
          "data": []
        }, 200]
      } else {
        return [{
          "status": 400,
          "mensaje": "Error al activar usuario.",
          "error": [],
          "data": []
        }, 400]
      }
    }
  }


  public async login({ auth, request, response }) {
    const validarLogin = schema.create({
      email: schema.string(),
      password: schema.string(),
    })
    Logger.info(request.body())
    const email = request.body().email
    const password = request.body().password
    const payload = await request.validate({ schema: validarLogin })

    if (!payload) {
      return response.badRequest('Invalido')
    }
    const user = await User.query().where('email', request.input('email')).where('activo', '1').first()
    if (!user) {
      return response.badRequest({
        'status': 400,
        'mensaje': 'No existe ningún usuario con este correo o su cuenta está desactivada.',
        'error': [],
        'data': [],
      })
    }

    if (!await Hash.verify(user.password, request.input('password'))) {
      return response.badRequest({
        'status': 400,
        'mensaje': 'Credenciales de usuario incorrectas.',
        'error': [],
        'data': [],
      })
    }
    const token = await auth.use('api').attempt(email, password, {
      expiresIn: '1 days',
    })
    return { 'token': token.token }
  }

  public async logout({ auth, response }) {
    await auth.use('api').revoke()
    return response.ok({ 'status': 200, 'mensaje': 'Sesión cerrada correctamente.', 'error': [], 'data': [] })
  }

  public async infoUserObjeto({ auth }) {
    const user = await auth.authenticate()
    const infoUser = await User.query().where('id', user.id).first()
    return infoUser
  }

  public async infoUser({ auth, response }) {
    if (auth.user) {
      const user = await auth.authenticate()
      const infoUser = await User.query().where('id', user.id).first()
      return infoUser
    } else {
      return response.badRequest({
        'status': 401,
        'mensaje': 'No existe ningún usuario con este correo o su cuenta está desactivada.',
        'error': [],
        'data': [],
      })
    }
  }

  public async infoUsuario({ }) {
    const user = await User.all()
    return user
  }

  public async recuperarCuenta({ request, response }) {
    const recuperarCuenta = schema.create({

      email: schema.string(),
    })
    const payload = await request.validate({ schema: recuperarCuenta })
    if (!payload) {
      return response.badRequest('Invalido')
    }
    const user = await User.query().where('email', request.input('email')).first()
    if (!user) {
      return response.badRequest({
        'status': 401,
        'mensaje': 'No existe ningún usuario con este correo.',
        'error': [],
        'data': [],
      })
    }
    const url = backend + Route.makeSignedUrl('verify', { id: user.id },
      { expiresIn: '1 day' })

    await Mail.send((message) => {
      message
        .from('abelardoreyes256@gmail.com')
        .to(user.email)
        .subject('Welcome Onboard!')
        .htmlView('emails/welcome', { name: user.name, url: url })
    })
  }

  public async cambiarPassword({ request, response }) {
    const recuperarPassword = schema.create({

      email: schema.string(),
    })
    const payload = await request.validate({ schema: recuperarPassword })
    if (!payload) {
      return response.badRequest('Invalido')
    }
    const user = await User.query().where('email', request.input('email')).first()
    if (!user) {
      return response.badRequest({
        'status': 401,
        'mensaje': 'No existe ningún usuario con este correo.',
        'error': [],
        'data': [],
      })
    }
    await Mail.send((message) => {
      message
        .from('sebastian.rmz.manuel@outlook.com')
        .to(user.email)
        .subject('Welcome Onboard!')
        .htmlView('emails/cambio_password', { name: user.name })
    })
  }

  public async updateUser({ request, params }) {
    const modificar = schema.create({
      name: schema.string(),
      ap_paterno: schema.string(),
      ap_materno: schema.string(),
      activo: schema.boolean(),
    })
    const payload = await request.validate({ schema: modificar })
    if (!payload) {
      return 'Error'
    }
    const user = await User.findOrFail(params.id)
    user.name = request.input('name')
    user.ap_paterno = request.input('ap_paterno')
    user.ap_materno = request.input('ap_materno')
    user.activo = request.input('activo')
    await user.save()
  }

  public async soloRol({ params, request }) {
    const modificar = schema.create({
      rol_id: schema.number(),
    })
    const payload = await request.validate({ schema: modificar })
    if (!payload) {
      return 'Error'
    }
    const user = await User.findOrFail(params.id)
    user.rol_id = request.input('rol_id')
    await user.save()
  }

  public async desactivar({ params, request }) {
    const modificar = schema.create({
      activo: schema.boolean(),
    })
    const payload = await request.validate({ schema: modificar })
    if (!payload) {
      return 'Error'
    }
    const user = await User.findOrFail(params.id)
    user.activo = request.input('activo')
    await user.save()
  }

  public async validarToken({ auth }) {
    if (auth.user) {
      return true
    } else {
      return false
    }
  }

  public async infoIDUser({ params }) {
    const user = await User.findOrFail(params.id)
    return user
  }
}
