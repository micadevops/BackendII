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
      res.redirect("/api/sessions/current");
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

    const firstName = req.user.first_name;
    const lastName = req.user.last_name;

   res.render("current", {
    firstName,
    lastName
   })
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


export default authRouter;