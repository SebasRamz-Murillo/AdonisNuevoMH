import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
export default class extends BaseSeeder {
  public async run () {
    await User.create(
      {
        name: 'admin',
        password: await Hash.make('123456789'),
        email: 'sebas11manuel.rmz@gmail.com',
        ap_materno: 'admin',
        ap_paterno: 'admin',
        telefono: '8712117940',
        activo: true,
        rol_id: 1,
      },
    )
  }

}
