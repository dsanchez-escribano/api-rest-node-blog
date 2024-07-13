const { Schema, model } = require("mongoose");

const ArticuloSchema = Schema({
    //Mongoose schema types
    titulo: {
        type: String,
        required: true
    },
    contenido: {
        type: String,
        required: true
    },
    fecha:{
        type: Date,
        default: Date.now
    },
    imagen: {
        type: String,
        required: true,
        default: "default.png"
    }
});

module.exports = model("Articulo", ArticuloSchema, "articulos");
                        //articulo+s                //opcional nombre de la coleccion de mongoose