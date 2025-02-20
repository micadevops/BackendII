import { roles } from '../utils/roles.js';

export const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "No autorizado, inicia sesión" });
    }
    
    if (req.user.role !== roles.ADMIN) {
        return res.status(403).json({ message: "Acceso denegado. Se requieren permisos de administrador" });
    }
    
    next();
};

export const isUser = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "No autorizado, inicia sesión" });
    }
    
    if (req.user.role !== roles.USER) {
        return res.status(403).json({ message: "Acceso denegado. Se requieren permisos de usuario" });
    }
    
    next();
};
