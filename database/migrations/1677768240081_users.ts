import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 50).notNullable()
      table.string('ap_paterno', 50).notNullable()
      table.string('ap_materno', 50).notNullable()
      table.string('password', 250).notNullable()
      table.string('telefono', 50).notNullable()
      table.integer('codigo').defaultTo(0)
      table.boolean('activo').defaultTo(false)
      table.string('email', 50).notNullable().unique()
      table.integer('rol_id').unsigned().references('id').inTable('roles').onDelete('CASCADE')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
