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

const actualizarMedico = async (req, res = response) => {//res = response es para obtener el tipado en la respuesta
    const idMedico = req.params.id;
    const uid = req.uid;

    try {

        const medicoDB = await Medico.findById(idMedico);

        if (!medicoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'El id del medico es incorrecto'
            });
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(idMedico, cambiosMedico, { new: true });

        res.json({
            ok: true,
            medico: medicoActualizado
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const borrarMedico = async (req, res = response) => {//res = response es para obtener el tipado en la respuesta
    const idMedico = req.params.id;

    try {
        const medicoDB = await Medico.findById(idMedico);

        if (!medicoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'El id del medico es incorrecto'
            });
        }

        await Medico.findByIdAndDelete(idMedico);

        res.json({
            ok: true,
            msg: 'Medico eliminado'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
}