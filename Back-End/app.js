'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var http = require('http').Server(app)
var app = express();

//carregar rutes

var project_routes = require('./routes/project');



// SOCKET 

//middlewares
// codifiquem a json tot el que ens arriba
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


// CORS

// Configurar capçaleress y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    req.header('Access-Control-Allow-Origin', '*');
    req.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    req.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    req.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');

    next();
});

const cors = require('cors');
app.use(cors());

app.use(express.static(__dirname + '/memory'));

//rutes

app.use('/api',project_routes);

//exportar

module.exports = app;

/* app.get('/',(req,res)=>{
    res.status(200).send("<h1> Projecte M6 Angular NodeJS </h1>");
});



app.get('/test',(req,res)=>{
    res.status(200).send({
        message: "Hola món des de l'API de NodeJS"
    });
});

app.post('/testpost/:curs',(req,res)=>{
    //console.log("Mòdul:",req.param('modul'),"UF:",req.param('uf'));
    console.log("Mòdul:",req.body.modul,"UF:",req.body.uf);
    console.log("projecte:",req.query.projecte);
    console.log("projecte:",req.params.curs);
    res.status(200).send({
        message: "Ruta per POST"
    });
});
 */





