import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Chef from 'App/Models/Chef'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Logger from '@ioc:Adonis/Core/Logger'

export default class ChefsController {
    public async registrarChef({ request, response }: HttpContextContract) {
      Logger.info('Registrando chef')
        const newPostSchema = schema.create({
            nombre: schema.string({ trim: true }, [
                rules.required(),
                rules.unique({ table: 'chefs', column: 'nombre' }),
            ]),
            ap_paterno: schema.string({ trim: true }, [rules.required()]),
            ap_materno: schema.string({ trim: true }, [rules.required()]),
            nacionalidad: schema.string({ trim: true }, [rules.required()]),
            edad: schema.number([rules.required()]),
        })
        const data = await request.validate({
            schema: newPostSchema,
            messages: {
                'nombre.required': 'El nombre es requerido',
                'nombre.unique': 'El nombre ya existe',
                'ap_paterno.required': 'El apellido paterno es requerido',
                'ap_materno.required': 'El apellido materno es requerido',
                'nacionalidad.required': 'La nacionalidad es requerida',
                'edad.required': 'La edad es requerida',
            },
        })
        if (data) {

        const chef = new Chef()
        chef.nombre = request.input('nombre')
        chef.ap_paterno = request.input('ap_paterno')
        chef.ap_materno = request.input('ap_materno')
        chef.nacionalidad = request.input('nacionalidad')
        chef.edad = request.input('edad')
        await chef.save()
        const respuesta = {
            status: 200,
            mgs: 'Chef registrado',
            data: chef,
            error: false
        }
        response.send(respuesta)
      }
    }
    public async obtenerChefs({ response }: HttpContextContract) {
        const chefs = await Chef.all()
        response.send(chefs)
    }
    public async obtenerChef({ params, response }: HttpContextContract) {
        const chef = await Chef.find(params.id)
        response.send(chef)
    }
    public async actualizarChef({ params, request, response }: HttpContextContract) {
        const chef = await Chef.find(params.id)
        const newPostSchema = schema.create({
            nombre: schema.string({ trim: true }, [
                rules.required()]),
            ap_paterno: schema.string({ trim: true }, [rules.required()]),
            ap_materno: schema.string({ trim: true }, [rules.required()]),
            nacionalidad: schema.string({ trim: true }, [rules.required()]),
            edad: schema.number([rules.required()]),
        })
        const data = await request.validate({

            schema: newPostSchema,
            messages: {
                'nombre.required': 'El nombre es requerido',
                'ap_paterno.required': 'El apellido paterno es requerido',
                'ap_materno.required': 'El apellido materno es requerido',
                'nacionalidad.required': 'La nacionalidad es requerida',
                'edad.required': 'La edad es requerida',
            },
        })
        if (chef) {
          if (data) {
            chef.nombre = request.input('nombre')
            chef.ap_paterno = request.input('ap_paterno')
            chef.ap_materno = request.input('ap_materno')
            chef.nacionalidad = request.input('nacionalidad')
            chef.edad = request.input('edad')
            await chef.save()
            response.send(chef)
          }
        } else {
            response.status(404).send({ message: 'Chef no encontrado' })
        }
    }
    public async eliminarChef({ params, response }: HttpContextContract) {
        const chef = await Chef.find(params.id)
        if (chef) {
            await chef.delete()
            response.send({ message: 'Chef eliminado' })
        } else {
            response.status(404).send({ message: 'Chef no encontrado' })
        }
    }


}
