import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Ingredientes from 'App/Models/Ingrediente'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { Readable } from 'stream';
import Event from '@ioc:Adonis/Core/Event'
export default class IngredientesController {
  public async registrarIngrediente({ request, response }: HttpContextContract) {
    const validationSchema = schema.create({
      nombre: schema.string({ trim: true }, [
        rules.required(),
        rules.unique({ table: 'ingredientes', column: 'nombre' }),
      ]),
      tipo: schema.string({ trim: true }, [rules.required()]),
      cantidad: schema.number([rules.required()]),
    })
    const data = await request.validate({
      schema: validationSchema,
      messages: {
        'nombre.required': 'El nombre es requerido',
        'nombre.unique': 'El nombre ya existe',
        'tipo.required': 'El tipo es requerido',
        'cantidad.required': 'La cantidad es requerida',
      },
    })
    if (data) {
      const ingrediente = new Ingredientes()
      ingrediente.nombre = request.input('nombre')
      ingrediente.tipo = request.input('tipo')
      ingrediente.cantidad = request.input('cantidad')
      await ingrediente.save();
      Event.emit('new:ingrediente', ingrediente)
      const respuesta = {
        status: 200,
        message: 'Ingrediente registrado',
        data: ingrediente,
        error: false

      }
      response.send(respuesta)
    }
  }
  public async obtenerIngredientes({ response }: HttpContextContract) {
    const ingredientes = await Ingredientes.all()
    response.send(ingredientes)
  }
  public async obtenerIngrediente({ params, response }: HttpContextContract) {
    const ingrediente = await Ingredientes.find(params.id)
    response.send(ingrediente)
  }



  public async actualizarIngrediente({ params, request, response }: HttpContextContract) {
    const ingrediente = await Ingredientes.find(params.id)
    const validationSchema = schema.create({
      nombre: schema.string({ trim: true }, [
        rules.required()]),
      tipo: schema.string({ trim: true }, [rules.required()]),
      cantidad: schema.number([rules.required()]),
    })
    const data = await request.validate({
      schema: validationSchema,
      messages: {
        'nombre.required': 'El nombre es requerido',
        'tipo.required': 'El tipo es requerido',
        'cantidad.required': 'La cantidad es requerida',
      },
    })
    if (ingrediente) {
      if (data) {
        ingrediente.nombre = request.input('nombre')
        ingrediente.tipo = request.input('tipo')
        ingrediente.cantidad = request.input('cantidad')
        await ingrediente.save()
        Event.emit('update:ingrediente', ingrediente)
        response.send(ingrediente)
      }
    } else {
      response.status(404).send({ message: 'Ingrediente no encontrado' })
    }
  }

  public async eliminarIngrediente({ params, response }: HttpContextContract) {
    const ingrediente = await Ingredientes.find(params.id)
    if (ingrediente) {
      await ingrediente.delete()
      Event.emit('delete:ingrediente', ingrediente)
      response.send({ message: 'Ingrediente eliminado' })
    } else {
      response.status(404).send({ message: 'Ingrediente no encontrado' })
    }
  }

  public async streamIngredientes({response}){
    const stream = response.response;
    stream.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    })
    Event.on('new:ingrediente', (ingrediente) => {
      console.log(ingrediente)
      stream.write(`data: ${JSON.stringify("Se a agregado un nuevo campo a la tablas")}\n\n`)
    });
    Event.on('update:ingrediente', (ingrediente) => {
      console.log(ingrediente)
      stream.write(`data: ${JSON.stringify("Se a editado campo a la tablas")}\n\n`)    }
    );
    Event.on('delete:ingrediente', (ingrediente) => {
      console.log(ingrediente)
      stream.write(`data: ${JSON.stringify("Se a eliminado un campo a la tablas")}\n\n`)
    }
    );
  }
}
