import mongoose from 'mongoose'
import shortid from 'shortid'
import slug from 'slug'


mongoose.Promise = global.Promise

const { Schema } = mongoose;

const vacantesSchema = new Schema({
    titulo: {
        type: String, 
        required: 'El nombre de la vacante es obligatorio',
        trim: true
    },
    empresa: {
        type: String,
        trim: true
    },
    ubicacion: {
        type: String, 
        trime: true,
        required: 'La ubicación es obligatoria'
    },
    salario: {
        type: String,
        default: 0,
        trim: true
    },
    contrato: {
        type: String,
        trim: true
    },
    descipcion: {
        type: String,
        trim: true
    },
    url: {
        type: String,
        lowercase: true
    },
    skills: [String],
    candidatos : [{
        nombre: String, 
        email: String, 
        cv: String
    }]
})

vacantesSchema.pre('save', function(next){

    // Crear la url
    const url = slug(this.titulo); // slug: Make strings URL-safe, whitout especial charset
    this.url = `${url}-${shortid.generate()} ` 

    next();
})

export default mongoose.model('Vacante', vacantesSchema)