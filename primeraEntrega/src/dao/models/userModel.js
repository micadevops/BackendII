import { Schema, model } from "mongoose";
import { validateEmail } from "../../middlewares/validateEmail.js";
import { createHash, isValidPassword } from "../../utils/hash.js";
import mongoose from 'mongoose'; 

const userCollection = "users";

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        require: true
    },
    last_name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    age: {
        type: Number,
        require: true,
    },
    password: {
        type: String,
        require: true
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts"
        
    },
    role: {
        type: String,
        require: true,
        default: 'user'
    },
});

//check si es un email valido.
userSchema.pre("save", validateEmail);


// //comparar los hash de la contraseña
// userSchema.methods.isValidPassword = async function (password) {
//     return await isValidPassword(password, this.password);
// }


export const userModel = mongoose.model(userCollection, userSchema);


