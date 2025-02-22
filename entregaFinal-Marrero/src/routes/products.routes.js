import { Router } from "express";
import { ProductsController } from "../controller/products.controller.js";
import { isAdmin } from "../middlewares/userRole.js";
import passport from 'passport';
import { createProductDTO } from "../dto/product.dto.js";
import { validateDto } from "../middlewares/validDTO.middleware.js";


export const productRouter = Router();
const productController = new ProductsController();

productRouter.get("/", productController.getAll)

productRouter.get("/:pid", productController.getById)


//PROTECTED ROUTES - Solo para admin roles.
productRouter.post('/', 
    passport.authenticate('current', { session: false }), 
    isAdmin,
    validateDto(createProductDTO),
    productController.create
);

productRouter.put("/:pid",
    passport.authenticate('current', { session: false }), 
    isAdmin, 
    productController.update
)

productRouter.delete("/:pid", 
    passport.authenticate('current', { session: false }), 
    isAdmin, 
    productController.delete
)