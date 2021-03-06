/*
    Medicos
    ruta: '/api/medicos'
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getMedicos, crearMedico, actualizarMedico, borrarMedico, getMedicoById } = require('../controllers/medicos');

const router = Router();

router.get('/', validarJWT, getMedicos);
router.post('/',
    [
        validarJWT,
        check('nombre', 'el nombre del medico es requerido').not().isEmpty(),
        check('hospital', 'El ID del hospital debe ser valido').isMongoId(),//Se valida que el ID que viene, sea un ID de mongoDB valido. No valida que el ID exista! Solo valida la estructura
        validarCampos
    ],
    crearMedico);

router.put('/:id',
    [
        validarJWT,
        check('nombre', 'el nombre del medico es requerido').not().isEmpty(),
        check('hospital', 'El ID del hospital debe ser valido').isMongoId(),//Se valida que el ID que viene, sea un ID de mongoDB valido. No valida que el ID exista! Solo valida la estructura
        validarCampos
    ],
    actualizarMedico);

router.delete('/:id', validarJWT, borrarMedico);

router.get('/:id', validarJWT, getMedicoById);

module.exports = router;