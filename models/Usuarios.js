import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import usuariosController from '../controllers/usuariosController.js'

mongoose.Promise = global.Promise

const UsuarioSchema = new mongoose.Schema({
    email:{
        type: String,
        unique: true,
        lowecase: true,
        trim: true
    },
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    token: String,
    expira: Date
})

// Método para hashear los passwords
UsuarioSchema.pre('save', async function(next) {
    
    // Si el password ya esta hasheado no hacemos nada
    if(!this.isModified('password')) {
        return next() //continua al siguiente middelware
    }

    const hash = await bcrypt.hash(this.password, 12)
    this.password = hash
    next()
})

// error personalizado cuando un usuario ya esta registrado
UsuarioSchema.post('save', function(error, doc, next) {

    // Si el usuario ya estaba creado entonces...
    if(error.name === 'MongoServerError' && error.code === 11000 ){
        next('That email is already registered')
    }else {
        next(error)
    }
})

// Autenticar Usuarios (Login)
UsuarioSchema.methods = {
    compararPassword: function(password) {
        return bcrypt.compareSync(password, this.password)
    }
}

export default mongoose.model('Usuarios', UsuarioSchema)