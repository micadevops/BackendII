import { Router } from "express";
import passport from "passport";
import { AuthController } from "../controllers/auth.controller.js";

export const authRouter = Router();


authRouter.get("/register", (req, res) => {
  res.render("register"); 
});

authRouter.get("/login", (req, res) => {
  res.render("login"); 
});


authRouter.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/failregister",
    successRedirect: "/api/sessions/login",
    failureMessage: true
  }),
  AuthController.register
);

authRouter.get("/failregister", (req, res) => {
  const error = req.session.messages ? req.session.messages[req.session.messages.length - 1] : null;
  res.render("register", {
      message: error || "Error en el registro"
  });
});

authRouter.post(
  "/login",
  passport.authenticate("login", { session: false }),
  AuthController.login
);

authRouter.get(
  "/current",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    res.json({ mensaje: "Usuario autenticado", usuario: req.user });
  }
);

export default authRouter;