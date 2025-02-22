import { generateToken } from "../utils/jwt.js";
import { UserService } from "../services/user.service.js";


export class AuthController {

      constructor() {
          this.userService = new UserService();
      }

    static async login(req, res) {
        try {
            const payload = {
                id: req.user._id,
                email: req.user.email,
                first_name: req.user.first_name,
                last_name: req.user.last_name,
            };
    
            const token = await generateToken(payload);

            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 2 // 2 min
            });
    
            return res.status(200).json({ status: 'success'});

        } catch (error) {
            console.error('Error en login:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    getAll = async (req, res) => {
        try {
            const users = await this.userService.getAll();

            if (users.length === 0) {
                return res.status(200).json({ message: "No users in the database" });
            }

            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ message: `An error occurred while trying to get all users: ${error.message}` });
        }
    }

    getById = async (req, res) => {
        const { uid } = req.params;
        try {
            const user = await this.userService.getById(uid);

            if (!user) {
                return res.status(404).json({ message: `User not found with ID: ${uid}` });
            }

            res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: `An error occurred while trying to get the user with Id: ${uid}: ${error.message}` });
        }
    }


    update = async (req, res) => {
        const { uid } = req.params;
        const { first_name, last_name, email, age, role } = req.body;

        if (!uid) {
            return res.status(404).json({ message: "Please provide a user ID" });
        }

        try {
            const user = await this.userService.update({ 
                id: uid, 
                first_name, 
                last_name, 
                email, 
                age,
                role
            });

            if (!user) {
                return res.status(404).json({ message: `User not found with ID: ${uid}` });
            }

            res.status(200).json({
                message: `Successfully updated user with ID: ${uid}`
            });
        } catch (error) {
            return res.status(500).json({ message: `An error occurred while trying to update the user with ID: ${uid}: ${error.message}` });
        }
    }

    delete = async (req, res) => {
        const { uid } = req.params;

        if (!uid) {
            return res.status(404).json({ message: "Please provide a user ID" });
        }

        try {
            const user = await this.userService.delete(uid);

            if (!user) {
                return res.status(404).json({ message: `User not found with ID: ${uid}` });
            }

            res.status(200).json({
                message: `Successfully deleted user with ID: ${uid}`
            });
        } catch (error) {
            return res.status(500).json({ message: `An error occurred while trying to delete the user with ID: ${uid}: ${error.message}` });
        }
    }

    getUserCart = async (req, res) => {
        const { uid } = req.params;
        
        try {
            const user = await this.userService.getById(uid).populate('cartId');
            
            if (!user) {
                return res.status(404).json({ message: `User not found with ID: ${uid}` });
            }

            if (!user.cartId) {
                return res.status(404).json({ message: `No cart found for user with ID: ${uid}` });
            }

            res.status(200).json(user.cartId);
        } catch (error) {
            return res.status(500).json({ message: `An error occurred while trying to get the cart for user with ID: ${uid}: ${error.message}` });
        }
    }
    
}