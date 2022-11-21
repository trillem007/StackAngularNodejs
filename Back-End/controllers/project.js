'use strict'

var Project = require('../models/project');
var fs = require('fs');
var path = require('path');
const bcrypt = require('bcrypt');
const { param } = require('../routes/project');
const project = require('../models/project');
const jwt=require('jsonwebtoken');
var controller = {
	home: function( req, res) {

        return res.status(200).send({
            message: 'Pagina'
        });
    },

    test: function( req, res) {
        return res.status(200).send({
            message: 'Pagina de test'
        });
    },
    verifyToken: function(req, res, next){
	if(!req.headers.authorization){
		return res.status(401).send('Unauthorized request')

	}
	let token= req.headers.authorization.split(' ')[1]
	if(token === 'null'){
		return res.status(401).send('Unauthorized request')

	}
	try{

		let payload = jwt.verify(token, 'secretKey')
		req.userId = payload.subject;
		next()
	}
	catch(err){

		return res.status(401).send('Unauthorized request')
	}
    },
    saveProject: function(req, res){
		var project = new Project();

		var params = req.body;
		project.name = params.name;
		project.password = bcrypt.hashSync(params.password, 5)
		project.email = params.email;
		project.avatar = "";
		project.tokens = params.tokens;

		Project.findOne({ email: project.email }, (err, projectStored) => {
			if(err) {
				//console.log(err);
				return res.status(500).send({message: 'Error al desar el document'});
			 }

			if(!projectStored) {
				project.save((err, projectStored) => {
					let payload = { subject: projectStored._id };
					let token = jwt.sign(payload, 'secretKey')
					return res.status(200).send({
						project: projectStored,
					});

			});

			} else {
				return res.status(404).send({message: " Conta Existeix "});
			}

		})

	},


    loginProject: function(req, res) {
        Project.findOne({ email: req.body.email }, (err, projectStored) => {
            if (err) {
                return res.status(500).send({message: 'Error'});
            }

            if (!projectStored) {
                return res.status(404).send({message: 'Usuari Incorrecte'});
            } 

            if (!bcrypt.compareSync(req.body.password, projectStored.password)) {

                return res.status(404).send({message: 'Constrasenya Incorrecta'})
            }
	    let payload= { subject: projectStored._id }
	    let token = jwt.sign(payload, 'secretKey')
            return res.status(200).send({
				project: projectStored,
				token:token,
            });
        })
    },


	getUser: function (req, res) {
		Project.findOne({ email: req.body.email }, (err, projectStored) => {
            if (err) {
                return res.status(500).send({message: 'Error al desar el document'});
            }

            if (!projectStored) {
                return res.status(404).send({message: 'Document no desat'});
            } 

            return res.status(200).send({
				project,
				message: projectStored
            });
        })
	},

	getProject: function (req, res) {
		var projectId = req.params.id;
		console.log(projectId);



		if (projectId == null ) return res.status(500).send({message: 'no has especificat cap projecte '})
		
		else {

			Project.findById(projectId, (err,project) => {

				if(err) {
					console.log(err);
					return res.status(500).send({message: 'Error al retornar les dades'});
			 	}	

				if(!project) return res.status(404).send({message: 'El projecte no existeix'});

				return res.status(200).send({
					project
				});
			} );
		} 
	},

	getProjects: function(req, res) {
		Project.find({}).exec((err, projects) => {
			if (err) return res.status(500).send({message: 'Error al retornar les dades'});
			if (!projects) return res.status(404).send({message: 'No hi ha projectes'});
			return res.status(200).send({
				projects
			});


	
		});
	},

	deleteProject: function (req,res) {
		// el valor de la id arriba per la URL
		var projectId = req.params.id;
		Project.findByIdAndDelete(projectId, (err, projectRemoved) => {

			if (err) {
				//console.log(err);
				return res.status(500).send({message: 'Error: no s\'ha pogut borrar el projecte'});
			}
			if (!projectRemoved) return res.status(404).send({message: 'No existeix el projecte a borrar'});
			return res.status(200).send({
				project: projectRemoved
			})
		});
	},


	

	updateTokens: function (req, res) {
		//console.log('aaa')
		//console.log(req.body.email)
		//console.log(req.params.tokens)

		Project.updateOne({email: req.body.email}, {$set : {tokens: req.params.tokens}}, (err, projectUpdated) => {

			if (err) {
				//console.log(err);
				return res.status(500).send({message: 'Error actualitzant les dades'});
			}
			if (!projectUpdated) return res.status(404).send({message: 'No existeix el projecte'});
			return res.status(200).send({
				project: projectUpdated,
				message: ""
			});

		})

	},

	updateProject: function (req,res) {
		// el valor de la id arriba per la URL
		var projectId = req.params.id;
		// les dades de l'objecte per body
		var update =req.body;

		// si entrem a la funció de callBack és que s'ha executat el mètode
		// new:true fa que retorni l'objecte nou (no l'antic)

		var password = bcrypt.hashSync(update.password, 5)


		Project.findByIdAndUpdate(projectId, update, {new:true} ,(err,projectUpdated) => {
			if (err) {
				//console.log(err);
				return res.status(500).send({message: 'Error actualitzant les dades'});
			}
			if (!projectUpdated)  {
				return res.status(404).send({message: 'No existeix el projecte'});
			} else {
				Project.updateOne({email: update.email}, {$set : {password: password}}, (err, projectUpdated) => {
					console.log('asdasd')
					if (err) {
						//console.log(err);
						return res.status(500).send({message: 'Error actualitzant les dades'});
					}
					
					if (!projectUpdated) {
						return res.status(404).send({message: 'No existeix el projecte'});
					}
					
					return res.status(200).send({
						project: projectUpdated,
						message: " OK "
					});
		
				})
			}

		})

		
		
	},

	uploadImage: function (req, res) {
		var projectId = req.params.id;
		var fileName = "Imatge no pujada";

		if (req.files) {
			
			var filePath = req.files.avatar.path;
			var fileSplit = filePath.split('/');
			var fileName = fileSplit[1];

			Project.findByIdAndUpdate(projectId, {avatar: fileName} , {new:true}, (err, projectUpdated) => {
				
				if (err) {
					return res.status(500).send({message: 'Error actualitzant la imatge'});
				}
				if (!projectUpdated) return res.status(404).send({message: 'No existeix el projecte'});
				return res.status(200).send({
					project: projectUpdated
				});
			});
		} else {
			return res.status(500).send({
				message: fileName
			})
		}
	},

	getImage: function (req, res) {
		var file = req.params.image;
		var path_file = './uploads/'+ file;
		console.log(path_file)

		fs.exists(path_file, (exists) =>{
			if (exists) {
				return res.sendFile(path.resolve(path_file));
				
			}else{
				return res.status(200).send({
					message: "No hi ha la imatge"
				});

			}
		});


	}


};

module.exports = controller;
