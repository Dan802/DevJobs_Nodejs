import './config/db.js'

import express from 'express'
import { engine } from 'express-handlebars'
import * as path from 'path'
import { fileURLToPath } from 'url'
import cookieParser from 'cookie-parser'
import session from 'express-session' // Since version 1.5.0, the cookie-parser middleware no longer needs to be used for this module to work.
import MongoStore from 'connect-mongo'
import dotenv from 'dotenv'
import Handlebars from "handlebars"
import flash from 'connect-flash'
import passport from 'passport'

// ----- Archivos
import router from './routes/index.js'
import { seleccionarSkills, tipoContrato, mostrarAlertas } from './helpers/handlebarsHelper.js'

import config_passport from './config/passport.js'

const app = express()
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Variables de Entorno
dotenv.config({path: '.env'})

// Habilitar lectura de datos de formularios tipo text
app.use( express.urlencoded( {extended: true}) )

// Static files
app.use(express.static(path.join(__dirname, 'public'))) //Profe
// app.use(express.static("public/")); // express-handlebars

// Habilitar coockie parser 
app.use( cookieParser() )

// express session
app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false, //don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    // cookie: { secure: true },
    store: MongoStore.create({ 
        // client : mongoose.connection,
        mongoUrl : process.env.DATABASE,
        ttl: 14 * 24 * 60 * 60 // = expiration 14 days. Default
    })
}))

// Inicializar passport
app.use(passport.initialize())
app.use(passport.session())

// Alertas y flash messages
// Se debe usar despues de app.use(session)
app.use(flash())

// Crear nuestro middleware
// Siempre se ejecuta al cargar cualquier página
app.use((req, res, next) => {
    // req.flash is not a function: Verificar el orden en app.use (cookies => session => req.flash)
    res.locals.mensajes = req.flash()
    next()
})

// Habilitar handlebars como view template
app.engine("handlebars", engine());
app.set('view engine', 'handlebars');
app.set("views", path.resolve(__dirname, "./views"));

// Helpers handlebar
Handlebars.registerHelper('seleccionarSkills', seleccionarSkills)
Handlebars.registerHelper('tipoContrato', tipoContrato)
Handlebars.registerHelper('mostrarAlertas', mostrarAlertas)

// Rutas del proyecto
app.use('/', router)

// Definir puerto
const port = process.env.PORT

// Iniciar Server
app.listen(port, (error) => {
    if(error) { 
        console.log(error)
    }else {
        console.log(`********** El servidor esta funcionando en el puerto ${port}`)
    }
});