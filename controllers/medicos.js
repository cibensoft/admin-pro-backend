const { response } = require('express');
const Medico = require('../models/medico');

const getMedicos = async (req, res = response) => {//res = response es para obtener el tipado en la respuesta

    //populate permite hacer referencia a documentos en otras colecciones
    const medicos = await Medico.find()
        .populate('usuario', 'nombre img')
        .populate('hospital');

    res.json({
        ok: true,
        medicos
    });
}

const crearMedico = async (req, res = response) => {
    /*res = response es para obtener el tipado en la respuesta. 
    Seria analogo a hacer lo siguiente:
    var a;
    a=5;
    Al asignarle a 'a' el valor de 5 js entiende que 'a' es una variable numerica*/

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body//spread sintax https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Spread_syntax
    });

    try {
        const medicoDB = await medico.save();
        res.json({
            ok: true,
            medico: medicoDB
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
    res.json({
        ok: true,
        msg: 'crearMedico'
    });
}

const actualizarMedico = (req, res = response) => {//res = response es para obtener el tipado en la respuesta
    res.json({
        ok: true,
        msg: 'actualizarMedico'
    });
}

const borrarMedico = (req, res = response) => {//res = response es para obtener el tipado en la respuesta
    res.json({
        ok: true,
        msg: 'borrarMedico'
    });
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
}