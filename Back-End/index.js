'use strict'

var mongoose = require('mongoose');
var app = require ('./app');
var port = 3000;

//mongoose.Promise = global.Promise;


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/casino')
    .then(()=> {
        console.log("Connexio a la BD establerta correctament ");

        // Creació del servidor
        app.listen(port, ()=>{
            console.log("Servidor funcionant correctament");
        } );
    })
    .catch (err => console.log(err));


