import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Chef extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'nombre', serialize: value => value.charAt(0).toUpperCase() + value.slice(1), consume: value => value.toLowerCase() })
  public nombre: string

  @column({ columnName: 'ap_paterno', serialize: value => value.charAt(0).toUpperCase() + value.slice(1), consume: value => value.toLowerCase() })
  public ap_paterno: string

  @column({ columnName: 'ap_materno',  serialize: value => value.charAt(0).toUpperCase() + value.slice(1), consume: value => value.toLowerCase() })
  public ap_materno: string

  @column({ columnName: 'nacionalidad' , serialize: value => value.charAt(0).toUpperCase() + value.slice(1), consume: value => value.toLowerCase() })
  public nacionalidad: string

  @column({ columnName: 'edad' })
  public edad: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime



}
