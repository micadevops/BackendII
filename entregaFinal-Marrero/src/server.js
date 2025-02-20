import express from "express";
import { productRouter } from "./routes/products.routes.js";
import { ProductService } from "./services/product.service.js"
import { viewsRouter } from "./routes/views.routes.js";
import handlebars from "express-handlebars";
import morgan from "morgan";
import { __dirname } from "./utils/path.js";
import { Server } from "socket.io";
import { cartRouter } from "./routes/carts.routes.js";
import path from "path";
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import cookieParser from "cookie-parser";
import session from 'express-session';
import { initializePassport } from "./config/passport.config.js";
import passport from "passport";
import { authRouter } from "./routes/auth.routes.js";
import Handlebars from 'handlebars';


dotenv.config();

//Configuracion de express
const app = express();
const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static(path.resolve(__dirname, "../public")));

//Configuracion del cookie parser - nos permite leer los cookies
app.use(cookieParser());
app.use(
    session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { 
        httpOnly: true, 
        maxAge: 1000 * 60, //1 minuto
      },
    })
  );


//Configuracion de Mongo DB
const uri = process.env.MONGO_URL;
if (!uri) {
    console.error('ERROR: La variable de entorno MONGO_URL no está definida');
    process.exit(1);
}

mongoose.connect(uri)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error(error));


//Configuracion de handlebars
app.engine("hbs", handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main.hbs",
    handlebars: allowInsecurePrototypeAccess(Handlebars),

}));


// Passport
initializePassport();
app.use(passport.initialize());


app.set("view engine", "hbs");
app.set("views", path.resolve(__dirname, "./views"));


//Rutas
app.use("/", viewsRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use('/api/sessions', authRouter);


//Configuracion de websocket
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);

});

export const io = new Server(httpServer);

const productService = new ProductService();

io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado", socket.id);
    
    const products = await productService.getAll();
    
    socket.emit("init", products);
});