import { Router } from "express";
import passport from "passport";
import { AuthController } from "../controller/auth.controller.js";
import { isAdmin } from "../middlewares/userRole.js";

export const authRouter = Router();
const authController = new AuthController();


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
);

authRouter.post(
  "/login",
  passport.authenticate("login", { 
    session: false,
    failureRedirect: "/api/sessions/faillogin",
    failureMessage: true
  }),
  async (req, res, next) => {
    try {
      await AuthController.login(req, res);
      if (!res.headersSent) {
        res.redirect("/api/sessions/current");
      }
    } catch (error) {
      next(error);
    }
  }
);

authRouter.get(
  "/current",
  passport.authenticate("current", { 
    session: false,
    failureRedirect: "/api/sessions/faillogin",
    failureMessage: true
  }),
  
  (req, res) => {
    if (!req.user) {
      return res.redirect("/api/sessions/login");
    }

    const fullName = req.user.name;

    res.render("current", {
      fullName
    });
  }
);


authRouter.get("/failregister", (req, res) => {
  const error = req.session.messages ? req.session.messages[req.session.messages.length - 1] : null;
  res.render("register", {
      message: error || "Error en el registro"
  });
});

authRouter.get("/faillogin", (req, res) => {
  const error = req.session.messages ? req.session.messages[req.session.messages.length - 1] : null;
  res.render("login", {
      message: error || "Error en el registro"
  });
});


authRouter.get("/", authController.getAll);
authRouter.get("/:uid", authController.getById);


authRouter.put("/:uid",
    passport.authenticate('current', { session: false }), 
    isAdmin, 
    authController.update
);

authRouter.delete("/:uid", 
    passport.authenticate('current', { session: false }), 
    isAdmin, 
    authController.delete
);

authRouter.get("/:uid/cart",
    passport.authenticate('current', { session: false }), 
    authController.getUserCart
);


export default authRouter;