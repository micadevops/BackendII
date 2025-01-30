//npm init -y; npm i express express-session cookie-parser session-file-store; npm i -D nodemon

import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import fileStore from "session-file-store";

const app = express();
const PORT = 8080;

//llamar a fileStore y pasarle la sesion de express
const FileStore = fileStore(session);
const SECRET = "secreto"


app.use(cookieParser());

app.use(session({
    secret: SECRET,
    store: new FileStore({
            path: "./sessions",
            ttl: 120,  //tiempo de vida en segundos
            retries: 0 //reintentos
    }),
    resave: false,
    saveUninitialized: false
}))

app.get("/", (req, res) => {

    console.log(req.session);

    if (req.session.counter) {
        req.session.counter++;
        res.send(`Visitas: ${req.session.counter}`);    
    } else { 
        res.send("Bienvenido")
    }

})



app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});