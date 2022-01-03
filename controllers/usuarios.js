const { response } = require('express'); //seccion 10, video 109
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res) => {

    const desde = Number(req.query.desde) || 0;//desde el cliente se envia el parametro asi localhost:3005/api/usuarios?desde=5

    /*Se podria obtener los usuarios y el total de registros como esta aca abajo. En este caso se esta ejecutando una consulta a continuacion de la otra. Pero se puede dar el caso de
    que ambas tarden mucho y esto no es conveniente*/

    // const usuarios = await Usuario
    //     .find({}, 'nombre email role google')
    //     .skip(desde) //se salta todos los registros que estan antes de 'desde'
    //     .limit(5);

    // const total = await Usuario.count();//total de registros en la DB

    //esto hace que ambas consultas se ejecuten simultaneamente y cuando obtengamos el resultado de ambas las recuperamos en las respectivas posiciones del arreglo
    //Se hace uso de la desestructuracion en javascript
    const [usuarios, total] = await Promise.all([
        Usuario
            .find({}, 'nombre email role google img')
            .skip(desde) //se salta todos los registros que estan antes de 'desde'
            .limit(5),
        Usuario.countDocuments()//total de registros en la DB
    ]);

    res.json({
        ok: true,
        usuarios,
        total
    });
}

const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        const existeEmail = await Usuario.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            });
        }

        const usuario = new Usuario(req.body);

        //Encriptar password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        //Guardar usuario
        await usuario.save();

        //Generar el TOKEN - JWT
        //https://jwt.io/
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs'
        });
    }
}

const actualizarUsuario = async (req, res = response) => {
    //TODO: Validar token y comprobar si es el usuario correcto
    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        //Actualizaciones
        const { password, google, email, ...campos } = req.body;

        console.log('campos inicio', campos);

        if (usuarioDB.email !== email) {//El usuario no esta actualizando el email
            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                })
            }
        }

        if (!usuarioDB.google) {
            campos.email = email;
        }
        else if (usuarioDB.email !== email) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario de Google no puede cambiar su correo'
            })
        }

        console.log('campos fin', campos);
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });//Si no pongo { new: true }, mongoose me regresa el usuario tal cual estaba antes de la actualizacion

        res.json({
            ok: true,
            usuario: usuarioActualizado
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const borrarUsuario = async (req, res = response) => {
    const uid = req.params.id;
    
    try {

        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
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
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario,
}