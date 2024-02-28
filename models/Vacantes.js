import mongoose from 'mongoose'
import shortid from 'shortid'
import slug from 'slug'

mongoose.Promise = global.Promise
const { Schema } = mongoose;

const vacantesSchema = new Schema({
    title: {
        type: String, 
        required: 'The name of the position is required',
        trim: true
    },
    company: {
        type: String,
        trim: true
    },
    ubication: {
        type: String, 
        trime: true,
        required: 'The ubication is required'
    },
    salary: {
        type: String,
        default: 0,
        trim: true
    },
    contract: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    url: {
        type: String,
        lowercase: true
    },
    skills: [String],
    candidates : [{
        nameCandidate: String, 
        emailCandidate: String, 
        cvCandidate: String
    }]
})

vacantesSchema.pre('save', function(next){

    // Crear una url unica para cada vacante
    const url = slug(this.title); // slug: Make strings URL-safe, whitout especial charset
    this.url = `${url}-${shortid.generate()}` 

    next();
})

export default mongoose.model('Vacante', vacantesSchema)