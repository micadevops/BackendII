export const validateEmail = function (next) {
    if (this.email && this.email.includes("@") && this.email.includes(".")) {
        return next(); 

    }
    next(new Error("Email inválido")); 
};  