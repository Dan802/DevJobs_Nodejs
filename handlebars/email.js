import emailConfig from '../config/email.js'
import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import util from 'util'
import { fileURLToPath } from 'url'

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.post,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass
    }
});

const filePath = fileURLToPath(new URL('../views/emails', import.meta.url)) // root\views/emails

// Utilizar templates de Handlebars
transport.use('compile', hbs({
    viewEngine: {
        extName: '.handlebars',
        partialsDir: filePath,
        layoutsDir: filePath,
        // TODO: revisar como volver dinámico el dafultlayout
        defaultLayout: 'reset.handlebars',
    },
    viewPath: filePath,
    extName: '.handlebars'
}));

async function enviarEmail (opciones) {

    const opcionesEmail = {
        from: 'devJobs <noreply@devjobs.com',
        to: opciones.usuario.email,
        subject: opciones.subject,
        template: opciones.archivo,
        context: { // Vbles pa utilizar en el template
            resetUrl : opciones.resetUrl
        }
    }

    const sendMail = util.promisify(transport.sendMail, transport)
    return sendMail.call(transport, opcionesEmail)
}

export {
    enviarEmail
}