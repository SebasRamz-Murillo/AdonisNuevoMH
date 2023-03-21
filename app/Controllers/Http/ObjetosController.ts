import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Objetos from 'App/Models/Objeto'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Ws from 'App/Services/Ws'
export default class ObjetosController {
  public async registrarObjeto({ request, response }: HttpContextContract) {
    const objetoSchema = schema.create({
      nombre: schema.string({ trim: true }, [
        rules.required(),
        rules.unique({ table: 'objetos', column: 'nombre' }),
      ]),
      descripcion: schema.string({ trim: true }, [rules.required()]),
      rareza: schema.number([rules.required()]),
      valor: schema.number([rules.required()]),
      limiteBolsa: schema.number([rules.required()]),
    })
    const data = await request.validate({
      schema: objetoSchema,
      messages: {
        'nombre.required': 'El nombre es requerido',
        'nombre.unique': 'El nombre ya existe',
        'descripcion.required': 'La descripcion es requerida',
        'rareza.required': 'La rareza es requerida',
        'valor.required': 'El valor es requerido',
        'limiteBolsa.required': 'El limite de bolsa es requerido',
      },
    })
    if (data) {
      const objeto = new Objetos()
      objeto.nombre = request.input('nombre')
      objeto.descripcion = request.input('descripcion')
      objeto.rareza = request.input('rareza')
      objeto.valor = request.input('valor')
      objeto.limiteBolsa = request.input('limiteBolsa')

      await objeto.save()
      const respuesta = {
        status: 200,
        message: 'Objeto registrado',
        data: objeto,
        error: false

      }
      response.send(respuesta)
    }
  }
  public async obtenerObjetos({ response }: HttpContextContract) {
    const objeto = await Objetos.all()
    //Socket
    console.log(objeto)
    Ws.io.emit('objetos', objeto)
    //Respuesta
    response.send(objeto)
  }




  public async obtenerObjeto({ params, response }: HttpContextContract) {
    const objeto = await Objetos.find(params.id)
    response.send(objeto)
  }
  public async actualizarObjeto({ params, request, response }: HttpContextContract) {
    const objeto = await Objetos.find(params.id)
    const objetoSchema = schema.create({
      nombre: schema.string({ trim: true }, [
        rules.required()]),
      descripcion: schema.string({ trim: true }, [rules.required()]),
      rareza: schema.number([rules.required()]),
      valor: schema.number([rules.required()]),
      limiteBolsa: schema.number([rules.required()]),
    })
    const data = await request.validate({
      schema: objetoSchema,
      messages: {
        'nombre.required': 'El nombre es requerido',
        'descripcion.required': 'La descripcion es requerida',
        'rareza.required': 'La rareza es requerida',
        'valor.required': 'El valor es requerido',
        'limiteBolsa.required': 'El limite de bolsa es requerido',
      },
    })
    if (objeto) {
      if (data) {
        objeto.nombre = request.input('nombre')
        objeto.descripcion = request.input('descripcion')
        objeto.rareza = request.input('rareza')
        objeto.valor = request.input('valor')
        objeto.limiteBolsa = request.input('limiteBolsa')
        await objeto.save()
        response.send(objeto)
      }
    } else {
      response.status(404).send({ message: 'Objeto no encontrado' })
    }
  }
  public async eliminarObjeto({ params, response }: HttpContextContract) {
    const objeto = await Objetos.find(params.id)
    if (objeto) {
      await objeto.delete()
      response.send({ message: 'Objeto eliminado' })
    } else {
      response.status(404).send({ message: 'Objeto no encontrado' })
    }
  }

}
