import dotenv from 'dotenv' // Variables de Entorno Seguras

export default {
    host: process.env.email_host,
    port: process.env.email_port,
    user: process.env.email_user,
    pass: process.env.email_pass
  };
