export class AuthController {

  static async login(req, res) {
    res.json("BIENVENIDOOOOOO" + " " + req.user.email);
  }

  static async register(req, res) {
    res.json(req.user);
  }

  
}