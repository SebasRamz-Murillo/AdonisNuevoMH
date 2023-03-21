import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Objeto extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'nombre', serialize: value => value.charAt(0).toUpperCase() + value.slice(1), consume: value => value.toLowerCase() })
  public nombre: string

  @column({ columnName: 'descripcion'})
  public descripcion: string

  @column({ columnName: 'rareza'})
  public rareza: string

  @column({ columnName: 'valor'})
  public valor: number

  @column({ columnName: 'limiteBolsa'})
  public limiteBolsa: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
