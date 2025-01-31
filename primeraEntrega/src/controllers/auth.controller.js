import { generateToken } from "../utils/jwt.js";

export class AuthController {

  static async login(req, res) {
 
    const payload = {
      id: req.user._id,
      email: req.user.email,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
    };

    const token = generateToken(payload);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 2 // 2 min,
    });

  }
  
}