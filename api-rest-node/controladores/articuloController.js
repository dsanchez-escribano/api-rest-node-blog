const Articulo = require("../modelos/Articulo");
const { validarArticulo } = require("../helpers/validar");
const fs = require("fs");
const path = require("path");
const { error } = require("console");

const test = (req, res) => {

    return res.status(200).json({
        message: 'Soy un accion de prueba'
    })

}

const crear = (req, res) => {

    //Recoger los parametros del post a guardar
    let params = req.body;


    //Validar los datos con la libreria VALIDATOR
    try {
        validarArticulo(params);
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar"
        })
    }


    //Crear el objeto a guardar
    const articulo = new Articulo(params);

    //Guardar el articulo en BD
    articulo.save()
        .then((articuloGuardado) => {
            return res.status(200).json({
                status: 'success',
                Articulo: articuloGuardado,
                mensaje: 'Articulo creado con exito'
            });
        })
        .catch((error) => {
            return res.status(400).json({
                status: 'error',
                mensaje: 'No se ha guardado el articulo: ' + error.message
            });
        });


};

// controllers/articuloController.js

const listar = (req, res) => {

    let consulta = Articulo.find({});

    if (req.params.ultimos == "ultimos") {
        consulta.limit(3);
    }



    consulta.sort({ fecha: -1 }) //Orden descendente
        .then((articulos) => {
            if (!articulos || articulos.length === 0) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se han encontrado articulos",
                });
            }

            return res.status(200).send({
                status: "success",
                contador: articulos.length,
                articulos,
            });
        })
        .catch((error) => {
            return res.status(500).json({
                status: "error",
                mensaje: "Ha ocurrido un error al listar los articulos",
                error: error.message,
            });
        });
};

const uno = (req, res) => {
    //recoger id por url
    let id = req.params['id'];
    //Buscar el articulo
    Articulo.findById(id)
        .then((articulo) => {
            //GESTIONAR
            if (!articulo) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se ha encontrado el articulo"
                });
            }

            return res.status(200).json({
                status: "success",
                articulo
            });
        })
        .catch((error) => {
            return res.status(500).json({
                status: "error",
                mensaje: "Ha ocurrido un error al mostrar el articulo",
                error: error.message,
            });
        });
};

const borrar = (req, res) => {
    //recoger id por url
    let articulo_id = req.params.id;
    //Buscar el articulo
    Articulo.findByIdAndDelete({ _id: articulo_id })
        //GESTIONAR
        .then((articulo) => {
            if (!articulo) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se ha encontrado el articulo"
                });
            }
            return res.status(200).json({
                status: "success",
                mensaje: "Se ha borrado el articulo:",
                articulo
            });

        })
        .catch((error) => {
            return res.status(500).json({
                status: "error",
                mensaje: "Ha ocurrido un error al borrar el articulo",
            });
        })
};

const editar = (req, res) => {
    //recoger id por url
    let articulo_id = req.params.id;
    //Recoger datos body
    let parametros = req.body;
    //Validar datos
    try {
        validarArticulo(parametros);
    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Error en los datos enviados",
        });
    }
    //Buscar el articulo
    Articulo.findByIdAndUpdate({ _id: articulo_id }, parametros, { new: true })
        .then((articulo) => {
            if (!articulo) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se ha encontrado el articulo"
                });
            }
            return res.status(200).json({
                status: "success",
                mensaje: "Se ha editado el articulo:",
                articulo
            });
        })
        .catch((error) => {
            return res.status(500).json({
                status: "error",
                mensaje: "Ha ocurrido un error al editar el articulo",
            });
        })
}

const subir = (req, res) => {
    //Configurar multer

    //Recoger elfichero de imagen subido
    if (!req.file && !req.files) {
        return res.status(400).json({
            status: "error",
            message: "peticion invalida"
        });
    }
    console.log(req.file);
    //Nombre del archivo
    let nombreArchivo = req.file.originalname;
    //extension
    let nombreArchivoSplit = nombreArchivo.split(".");
    let extension = nombreArchivoSplit[nombreArchivoSplit.length - 1];

    //comprobar extension
    if (extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif") {
        //BORRAR ARCHIVO + RESPUESTS
        fs.unlink(req.file.path, (error) => {
            return res.status(400).json({
                status: "error",
                message: "archivo invalido"
            });
        })
    } else {
        //recoger id por url
        let articulo_id = req.params.id;

        //Buscar el articulo
        Articulo.findByIdAndUpdate({ _id: articulo_id }, { imagen: req.file.filename }, { new: true })
            .then((articulo) => {
                if (!articulo) {
                    return res.status(404).json({
                        status: "error",
                        mensaje: "No se ha encontrado el articulo"
                    });
                }
                return res.status(200).json({
                    status: "success",
                    mensaje: "Se ha editado el articulo:",
                    articulo,
                    fichero: req.file
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    status: "error",
                    mensaje: "Ha ocurrido un error al editar el articulo",
                });
            })

    }
}

const imagen = (req, res) => {

    let fichero = req.params.fichero
    let ruta_fisica = "./imagenes/articulos/" + fichero;

    fs.stat(ruta_fisica, (error, existe) => {
        if (existe) {
            res.sendFile(path.resolve(ruta_fisica));
        } else {
            res.status(404).json({
                status: "error",
                mensaje: "No se ha encontrado el fichero"
            });
        }
    })

}

const buscador = (req, res) => {
    //sacar el string de busqueda
    let busqueda = req.params.busqueda;
    //find OR 
    Articulo.find({
        "$or": [
            { "titulo": { "$regex": busqueda, "$options": "i" } },
            { "contenido": { "$regex": busqueda, "$options": "i" } }
        ]
    })
        .sort({ fecha: -1 })
        .then((articulosEncontrados) => {
                return res.status(200).json({
                    status: "success",
                    total: articulosEncontrados.length,
                    articulosEncontrados
                    
                })
            })
        .catch((error) => {

            return res.status(404).json({
                status: "error",
                mensaje: "no se ha encontrado el articulo",
            });

        })
}

module.exports = {
    test,
    crear,
    listar,
    uno,
    borrar,
    editar,
    subir,
    imagen,
    buscador

}