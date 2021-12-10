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

const actualizarHospital = async (req, res = response) => {//res = response es para obtener el tipado en la respuesta
    const id = req.params.id;//id del hospital
    const uid = req.uid;//id del usuario que hace la actualizacion

    try {
        const hospital = await Hospital.findById(id);

        if (!hospital) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado'
            });
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, { new: true });

        res.json({
            ok: true,
            hospital: hospitalActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const borrarHospital = async (req, res = response) => {//res = response es para obtener el tipado en la respuesta
    const id = req.params.id;//id del hospital
    try {
        const hospital = await Hospital.findById(id);

        if (!hospital) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado'
            });
        }

        await Hospital.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Hospital eliminado'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admministrador'
        })
    }
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital,
}