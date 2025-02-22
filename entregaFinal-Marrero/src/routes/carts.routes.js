import { Router } from "express";
import { CartsController } from "../controller/carts.controller.js";
import { isUser } from "../middlewares/userRole.js";
import passport from 'passport';

export const cartRouter = Router();
const cartsController = new CartsController();

cartRouter.get("/", cartsController.getAll);


cartRouter.get("/:cid", cartsController.getById);
cartRouter.post("/", cartsController.create);
cartRouter.delete("/:cid", cartsController.deleteAllProductsFromCart);
cartRouter.delete("/:cid/product/:pid", cartsController.deleteProductFromCart);
cartRouter.put("/:cid/product/:pid", cartsController.updateQuantityProduct);

cartRouter.post("/:cid/purchase",
    passport.authenticate('current', { session: false }), 
    cartsController.purchaseCart
);

//PROTECTED ROUTES - Solo para user roles.

cartRouter.post("/:cid/product/:pid", 
    passport.authenticate('current', { session: false }), 
    isUser, 
    cartsController.addProductToCart
);

