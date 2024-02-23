import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vacantes from '../models/Vacantes.js';

dotenv.config({path: '.env'})
// console.log('***** DESDE db.js *****')
// console.log('***** dotenv.config')
// console.log('***** Las vbles de entorno funcionan bien, la bd es ',process.env.DATABASE)

await mongoose.connect(process.env.DATABASE,)

// useNewUrlParser: deprecated option
// mongoose.connect(process.env.DATABASE, {useNewUrlParser: true })

mongoose.connection.on('error', (error) => {
    console.log(error);
})
