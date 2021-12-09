const { response } = require('express');
const Hospital = require('../models/hospital');

const getHospitales = async (req, res = response) => {//res = response es para obtener el tipado en la respuesta

    //populate permite hacer referencia a documentos en otras colecciones
    const hospitales = await Hospital.find()
        .populate('usuario', 'nombre img');

    res.json({
        ok: true,
        hospitales
    });
}

const crearHospital = async (req, res = response) => {//res = response es para obtener el tipado en la respuesta

    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body//spread sintax https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Spread_syntax
    });

    try {
        const hospitalDB = await hospital.save();
        res.json({
            ok: true,
            hospital: hospitalDB
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: true,
            msg: 'Hable con el administrador'
        })
    }
}

const actualizarHospital = (req, res = response) => {//res = response es para obtener el tipado en la respuesta
    res.json({
        ok: true,
        msg: 'actualizarHospital'
    });
}

const borrarHospital = (req, res = response) => {//res = response es para obtener el tipado en la respuesta
    res.json({
        ok: true,
        msg: 'borrarHospital'
    });
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital,
}