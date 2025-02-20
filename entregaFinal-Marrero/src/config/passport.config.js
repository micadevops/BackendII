import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { cookieExtractor } from "../utils/cookieExtractor.js";
import { UserService } from "../services/user.service.js";
import { CartService } from "../services/cart.service.js";
import {  isValidPassword } from "../utils/hash.js";
import { mapUserToDTO, UserDTO } from "../dto/user.dto.js";

const userService = new UserService();
const cartService = new CartService();

export function initializePassport() {
    // Estrategia de registro
    passport.use('register', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            try {
                const { first_name, last_name, age, role } = req.body;
                
                if (!email || !password || !first_name || !last_name || !age) {
                    return done(null, false, { message: "Todos los campos son requeridos" });
                }

                const newCart = await cartService.create();

                console.log (newCart)
                
                const userData = {
                    first_name,
                    last_name,
                    email,
                    age,
                    role,
                    password,
                    cartId: newCart
                };


                console.log (userData)

                const user = await userService.create(userData);
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    // Estrategia de login
    passport.use('login', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const user = await userService.getByEmail(email);
                if (!user) {
                    return done(null, false, { message: "El usuario no existe" });
                }

                const isValidPasswordVerification = await isValidPassword(password, user.password);
                if (!isValidPasswordVerification) {
                    return done(null, false, { message: "La contraseña es incorrecta" });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    // Estrategia JWT
    passport.use('current', new JWTStrategy(
        {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor])
        },
        async (payload, done) => {
            try {
                const user = await userService.getById(payload.id);
                if (!user) {
                    return done(null, false, { message: 'Usuario no encontrado' });
                }
    
                const userDTO = mapUserToDTO(user);
                
                return done(null, userDTO);
            } catch (error) {
                return done(error);
            }
        }
    ));

    // Serialización y deserialización
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userService.getById(id);
            done(null, user);
        } catch (error) {
            return done("Hubo un error " + error);
        }
    });
}