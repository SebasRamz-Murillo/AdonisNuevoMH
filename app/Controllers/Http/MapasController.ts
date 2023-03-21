import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Event from '@ioc:Adonis/Core/Event';
import Mapa from 'App/Models/Mapa'
export default class MapasController {
  public async registrarMapa({ request, response }: HttpContextContract) {
    const validationSchema = schema.create({
      nombre: schema.string({ trim: true }, [rules.required(), rules.unique({ table: 'mapas', column: 'nombre' })]),
      descripcion: schema.string({ trim: true }, [rules.required()]),
      totalZonas: schema.number([rules.required(), rules.range(1, 10)]),
    })
    const data = await request.validate({
      schema: validationSchema,
      messages: {
        'nombre.required': 'El nombre es requerido',
        'nombre.unique': 'El nombre ya existe',
        'descripcion.required': 'La descripción es requerida',
        'totalZonas.required': 'El total de zonas es requerido',
        'totalZonas.range': 'El total de zonas debe estar entre 1 y 10',
      },
    })
    if (data) {
    const mapa = new Mapa()
    mapa.nombre = request.input('nombre')
    mapa.descripcion = request.input('descripcion')
    mapa.totalZonas = request.input('totalZonas')
    await mapa.save()
    Event.emit('new::mapa', mapa);
    const respuesta = {
      Event: 'new::mapa',
      status : 200,
      message: 'Mapa registrado',
      data: mapa,
      error: false
    }
    response.send(respuesta)
  }
  }
  public async obtenerMapas({ response }: HttpContextContract) {
    const mapas = await Mapa.all()
    response.send(mapas)
  }
  public async obtenerMapa({ params, response }: HttpContextContract) {
    const mapa = await Mapa.find(params.id)
    response.send(mapa)
  }
  public async actualizarMapa({ params, request, response }: HttpContextContract) {
    const mapa = await Mapa.find(params.id)
    const validationSchema = schema.create({
      nombre: schema.string({ trim: true }, [rules.required()]),
      descripcion: schema.string({ trim: true }, [rules.required()]),
      totalZonas: schema.number([rules.required(), rules.range(1, 10)]),
    })
    const data = await request.validate({
      schema: validationSchema,
      messages: {
        'nombre.required': 'El nombre es requerido',
        'descripcion.required': 'La descripción es requerida',
        'totalZonas.required': 'El total de zonas es requerido',
        'totalZonas.range': 'El total de zonas debe estar entre 1 y 10',
      },
    })
    if (mapa) {
      if (data) {
      mapa.nombre = request.input('nombre')
      mapa.descripcion = request.input('descripcion')
      mapa.totalZonas = request.input('totalZonas')
      await mapa.save()
      await Event.emit('update::mapa', mapa);
      response.send(mapa)}
    } else {
      response.status(404).send({ message: 'Mapa no encontrado' })
    }
  }
  public async eliminarMapa({ params, response }: HttpContextContract) {
    const mapa = await Mapa.find(params.id)
    const stream = response.response;

    if (mapa) {
      await mapa.delete()
      Event.emit('delete::mapa', mapa);
      stream.writeHead(200, {
        "Access-Control-Allow-Origin":"*",
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      });
      stream.write(`event: deleteMapa\ndata: ${JSON.stringify(mapa)}\n\n`);
      response.send({ message: 'Mapa eliminado' })
    } else {
      response.status(404).send({ message: 'Mapa no encontrado' })
    }
  }

  public async streamMapas({ response }){
    const stream = response.response;
    stream.writeHead(200, {
      "Access-Control-Allow-Origin":"*",
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    });

    Event.on("new::mapa", (mapa) => {
      stream.write(`Evento: newMapa\ndata: ${JSON.stringify(mapa)}\n\n`);
      console.log('Se recibió un nuevo mapa:', mapa);
    });
  }
}
