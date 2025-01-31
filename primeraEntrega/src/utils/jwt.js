import jwt from "jsonwebtoken";


export function generateToken(payload) {
    const token  = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "5m",
    })
    return token;
}

export function verifyToken(token) {
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    }
    catch (error) {
        throw new Error("Token inválido: " + error.message);
    }
}