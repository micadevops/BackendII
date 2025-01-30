import express from 'express';
import handlebars from 'express-handlebars';
import {Server} from 'socket.io';
import mongoose from 'mongoose';
import passport from "passport";

import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import authRouter from  './routes/authRouter.js';
import { initializePassport } from "./config/passport.config.js";

import __dirname from './utils/constantsUtil.js';

const app = express();

const uri = 'mongodb+srv://Cluster88715:akx8W3dzRXVE@cluster88715.lvesl.mongodb.net/';
mongoose.connect(uri)
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.error(error));

  
//Handlebars Config
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/../views');
app.set('view engine', 'handlebars');

//Middlewares
// Middleware para procesar JSON
app.use(express.json());

// Middleware para procesar datos URL encoded (si es necesario)
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

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
    console.log(`Start server in PORT ${PORT}`);
});