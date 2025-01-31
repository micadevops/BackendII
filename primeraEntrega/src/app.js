import express from 'express';
import handlebars from 'express-handlebars';
import cookieParser from "cookie-parser";
import mongoose from 'mongoose';
import passport from "passport";
import dotenv from 'dotenv';
import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import authRouter from  './routes/authRouter.js';
import { initializePassport } from "./config/passport.config.js";
import session from 'express-session';
import __dirname from './utils/constantsUtil.js';

const app = express();

dotenv.config();

//Configuracion de Mongo DB
const uri = process.env.MONGO_URL;
if (!uri) {
    console.error('ERROR: La variable de entorno MONGO_URL no está definida');
    process.exit(1);
}

mongoose.connect(uri)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error(error));



// Middleware para procesar JSON
app.use(express.json());

// Middleware para procesar datos URL encoded
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

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

//Handlebars Config
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/../views');
app.set('view engine', 'handlebars');


// Passport
initializePassport();
app.use(passport.initialize());


//Routers
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/sessions', authRouter);
app.use('/', viewsRouter);


const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Server running on port : ${PORT}`);
});