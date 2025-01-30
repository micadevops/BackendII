import { Router } from "express";
import passport from "passport";
import { AuthController } from "../controllers/auth.controller.js";

export const authRouter = Router();


authRouter.post(
  "/register",
  passport.authenticate("register", { session: false }),
  AuthController.register //va al middleware donde devuelve el user creado
);


authRouter.post(
  "/login",
  passport.authenticate("login", { session: false }),
  AuthController.login
);

export default authRouter;