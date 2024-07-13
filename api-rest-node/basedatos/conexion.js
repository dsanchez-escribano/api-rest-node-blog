const mongoose = require("mongoose");

const conexion = async() => {

    try{
        await mongoose.connect("mongodb://localhost:27017/MI_BLOG");

        console.log("Conectado correctamente a MI_BLOG");
    }catch{
        console.log("error");
        throw new Error("No se pudo conectar a la BD");
    }

}

module.exports = {
    conexion
}