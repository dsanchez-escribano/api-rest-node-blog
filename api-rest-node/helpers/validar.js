const validator = require("validator");


const validarArticulo = (body) =>{
    let validar_titulo = !validator.isEmpty(body.titulo) &&
                        validator.isLength(body.titulo, {min: 5, max: undefined});
    let validar_contenido = !validator.isEmpty(body.contenido);

    if(!validar_titulo || !validar_contenido){
        throw new Error("No se ha validado la informacion");
    }
}

module.exports={
    validarArticulo
}