import { BaseCommand } from '@adonisjs/core/build/standalone'
import Env from '@ioc:Adonis/Core/Env'
import { Job, Worker,Queue } from 'bullmq'
import Route from '@ioc:Adonis/Core/Route'
import Mail from '@ioc:Adonis/Addons/Mail'
import axios from 'axios'

export default class BullJobs extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'bull:jobs'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = ''

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest`
     * afterwards.
     */
    loadApp: false,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  }
  // aqui van las definiciones de los jobs
  public async run() {
    const emails = new Worker('email', async (job: Job) => {
      console.log(`Procesando job ${job.id}`, JSON.stringify(job.data))
      const { email, name, url } = job.data
      await Mail.send((message) => {
        message
          .from('abelardoreyes256@gmail.com')
          .to(email)
          .subject('Welcome Onboard!')
          .htmlView('emails/welcome', { name:name, url: url })
      })
    })
    emails.on('completed', (job) => {
      console.log(`Job ${job.id} completado!`)
    })
    emails.on('failed', (job, err) => {
      console.log(`Job ${job!.id} fallo en: ${err.message}`)
    })

  const sms = new Worker('sms', async (job: Job) => {
    console.log(`Procesando job ${job.id}`, JSON.stringify(job.data))
    const { telefono, nRandom} = job.data
    console.log(`Enviando sms a ${telefono}...`)
    axios.post('https://rest.nexmo.com/sms/json', {
        from: 'Nexmo',
        to: '528714733996',
        text: 'Tu codigo de verificacion es: ' + nRandom,
        api_key: '22bd2a4a',
        api_secret: 'KPOZLO3r34vSCZGw'
      })

    // aqui va el codigo para enviar el sms
  })
  sms.on('completed', async (job) => {
    console.log(`Job ${job.id} completado!`)

  })
  sms.on('failed', (job, err) => {
    console.log(`Job ${job!.id} fallo en: ${err.message}`)
  })


  const emailVerify = new Worker('verify', async (job: Job) => {
    console.log(`Procesando job ${job.id}`, JSON.stringify(job.data))
    const { email, name, url, nRandom } = job.data
    await Mail.send((message) => {
      message
        .from('abelardoreyes256@gmail.com')
        .to(email)
        .subject('Welcome Onboard!')
        .htmlView('emails/correo_enviado', { name: name, nRandom: nRandom, url: url })
      })
  })
  emailVerify.on('completed', (job) => {
    console.log(`Job ${job.id} completado!`)
  })
  emailVerify.on('failed', (job, err) => {
    console.log(`Job ${job!.id} fallo en: ${err.message}`)
  })
  }
}
