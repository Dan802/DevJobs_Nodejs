import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vacantes from '../models/Vacantes.js';
import Usuarios from '../models/Usuarios.js';

dotenv.config({path: '.env'})

// useNewUrlParser: deprecated option
// mongoose.connect(process.env.DATABASE, {useNewUrlParser: true })
await mongoose.connect(process.env.DATABASE,)

mongoose.connection.on('error', (error) => {
    console.log(error);
})