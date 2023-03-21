/**
 * Contract source: https://git.io/JvgAT
 *
 * Feel free to let us know via PR, if you find something broken in this contract
 * file.
 */

import { InferMailersFromConfig } from '@adonisjs/mail/build/config'
import mailConfig from '../config/mail'
//import { MailDrivers } from '@ioc:Adonis/Addons/Mail'


declare module '@ioc:Adonis/Addons/Mail' {
  interface MailersList extends InferMailersFromConfig<typeof mailConfig> {}
}
declare module '@ioc:Adonis/Addons/Mail' {

  interface MailersList {
    smtp: MailDrivers['smtp'],
    ses: MailDrivers['ses'],
    mailgun: MailDrivers['mailgun'],
    sparkpost: MailDrivers['sparkpost'],
  }
}
