import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { userModel } from "../dao/models/userModel.js";
import { cartModel } from "../dao/models/cartModel.js";
import { createHash, isValidPassword  } from "../utils/hash.js";

import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";


export function initializePassport() {
    passport.use('register', new LocalStrategy(

        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },

        async (req, email, password, done) => {
            
            const { first_name, last_name, age  } = req.body;
        
            if (!email || !password || !first_name || !last_name || !age) {
                return done(null, false, {
                    message: "Todos los campos son requeridos"
                });
            }

            const hashedPassword = await createHash(password);

            const newCart = await cartModel.create({
                products: []
            });
            
            const user = await userModel.findOne({email});

            if (user) {
                return done(null, false, {
                    message: "El email ya está registrado"
                });
            }

            try {
                const user = await userModel.create({
                    first_name,
                    last_name,
                    email,
                    age,
                    password: hashedPassword,
                    cartId: newCart._id 
                })
                return done(null, user);
            }
            catch (error) {
                return done(error);
            }
    }))


    passport.use('login', 
        
        new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password' 
        },
        async (email, password, done) => {
            try {

                const user = await userModel.findOne({email});

                if (!user) return done(null, false, {message: "El usuario no existe"});
                
                const isValidPasswordVerification = await isValidPassword(password, user.password);

                if (!isValidPasswordVerification) {
                    return done(null, false, {message: "La contraseña es incorrecta"});
                }


                return done(null, user);
            } catch (error) { 
                return done(error);
            }
        }

    ))

    passport.use('current', new JWTStrategy(
        {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),

        },
        async (payload, done ) => {
            try {
                const user = await userModel.findById(payload.id);

                if (!user) {
                    return done(null, false, { message: 'Usuario no encontrado' });
                }
                return done(null, user); 
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            return done ("Hubo un error " + error);
        }
    })   

    function cookieExtractor(req) {
        let token = null;
      
        if (req && req.cookies) {
          token = req.cookies.token;
        }
      
        return token;
      }
    }