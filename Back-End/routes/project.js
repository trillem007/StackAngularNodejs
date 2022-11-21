'use strict'

var express =require('express');
var ProjectController = require('../controllers/project');

var router = express.Router();

// cal configurar un middleware (que s'executarà abans que s'executi la ruta del controlador)
var multipart = require('connect-multiparty');
// li hem de passar on es desaran els arxius (cal crear la carpeta)

var multipartMiddleware = multipart({ uploadDir: './uploads' });

router.get('/home', ProjectController.home);
router.post('/test', ProjectController.test);
router.post('/save-project', ProjectController.saveProject);
router.post('/login', ProjectController.loginProject);

router.post('/getUser',ProjectController.verifyToken, ProjectController.getUser);

router.put('/updateTokens/:tokens', ProjectController.updateTokens);


// ruta per actualitzar recursos ha de ser per put
router.put('/project/:id', ProjectController.updateProject);
// ruta per borrar ha de ser per delete
// ruta per pujar una imatge cal indicar el middleware que volem que s'executi
router.post('/upload-image/:id', multipartMiddleware, ProjectController.uploadImage);
router.get('/get-image/:image', ProjectController.getImage);




module.exports = router;


