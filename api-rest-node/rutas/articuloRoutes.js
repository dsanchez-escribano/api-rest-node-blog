

const  express = require("express");
const router = express.Router();
const ArticuloController = require("../controladores/articuloController");


const multer = require("multer");
const almacenamiento = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./imagenes/articulos/");
    },
    filename: function(req, file, cb) {
        cb(null, "articulo"+ Date.now()+ file.originalname);
    }
})

const subidas = multer({storage: almacenamiento});



//Rutas de prueba
router.get("/ruta-de-prueba" , ArticuloController.test);

//Ruta util
router.post("/crear", ArticuloController.crear);
router.get("/listar/:ultimos?", ArticuloController.listar);
router.get("/uno/:id", ArticuloController.uno);
router.delete("/borrar/:id", ArticuloController.borrar);
router.put("/editar/:id", ArticuloController.editar);
router.post("/subir-imagen/:id",[subidas.single("file0")],ArticuloController.subir);
router.get("/buscar/:busqueda", ArticuloController.buscador);

module.exports = router;