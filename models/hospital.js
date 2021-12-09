const { Schema, model } = require('mongoose');

const HospitalSchema = Schema({
    nombre: {
        type: String,
        required: true,
    },
    img: {
        type: String
    },
    usuario: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
}, { collection: 'hospitales' });//Si no especifico "{ collection: 'hospitales' }", mongoose crea la coleccion agregandole una s al final, con lo cual quedaria como "hospitals"

//Esto es para fines visuales. No afecta la base de
HospitalSchema.method('toJSON', function () {
    //Extraigo del modelo lo que no quiero enviar
    const { __v, ...object } = this.toObject();
    return object;
})

module.exports = model('Hospital', HospitalSchema);