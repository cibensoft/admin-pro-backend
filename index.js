const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');
const path = require('path');

//Crear el servidor de express
const app = express();

//Configurar CORS
app.use(cors());

//Lectura y parseo del body
app.use(express.json());

//Base de datos
dbConnection();

//Directorio publico
//Middleware para servir el html cuando alguien haga una peticion al backend. Cuando entro en localhost:3005 se sirve la pagina que esta en el directorio publico
app.use(express.static('public'));

//Rutas
app.get('/', (req, res) => {
    res.json({
        ok: true,
        msg: 'Hola mundo'
    });
});



app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/upload', require('./routes/uploads'));
app.use('/api/login', require('./routes/auth'));

//cualquier otra ruta que no sean las anteriores caera por aca. Esto es para evitar que al recargar el navegador muestre el error Cannot GET /pagina
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
})

app.listen(process.env.PORT, () => {
    console.log('Server on port ' + process.env.PORT);
})