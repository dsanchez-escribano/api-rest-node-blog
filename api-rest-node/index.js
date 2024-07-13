const { conexion } = require("./basedatos/conexion");
const express = require("express");
const cors = require("cors");
//INICIALIZAR
console.log("app de node arrancada")

//CONECTAR BD
conexion();

// SERVIDOR NODE
const app = express();
const puerto = 3900;
//CONFIGURAR CORS
app.use(cors());

//CONVERTIR BODY A OBJ JS
app.use(express.json()); //recibir datos con content-type app/json
app.use(express.urlencoded({ extended: true })); //recibir datos con content-type app/x-www

//CREAR RUTAS
const rutas_articulo = require("./rutas/articuloRoutes");

//Cargo las rutas
app.use("/api/articulo", rutas_articulo);

//Rutas prueba primeras clases hardcodeadas
app.get("/probando", (req, res) =>{

    console.log("Se ejecuto el endpoint probando");

    return res.status(200).json([{
        mensaje: "Probando el endpoint",
        autor: "Diego",
        fecha: new Date()
        },
        {
            mensaje: "Probando el endpoint",
            autor: "Diego",
            fecha: new Date()
            }
        ]);
});

app.get("/",(req, res) => {

    return res.status(200).send(`
        <div>
            <h1>Probando</h1>
            <p>Creando api rest con Node</p>
            <ul>
            <li>Node</li>
            <li>Express</li>
            <li>Postgres</li>
            </ul>
        </div>`
    );
});
        
       
        
        

//CREAR SERVIDOR Y ESCUCHAR PETICIONES
app.listen(puerto, () => {

    console.log("servidor corriendo en el puerto "+puerto);

});