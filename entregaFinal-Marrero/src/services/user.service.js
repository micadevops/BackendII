import { userModel } from "../db/models/user.model.js";
import { createHash } from "../utils/hash.js";

export class UserService {
    constructor() {
        this.model = userModel;
    }

    async getAll() {
        try {
            const users = await this.model.find().lean();
            return users;
        } catch (error) {
            throw new Error(`Error getting all users: ${error.message}`);
        }
    }

    async getById(id) {
        try {
            const user = await this.model.findById(id).lean();
            return user;
        } catch (error) {
            throw new Error(`Error getting user by id: ${error.message}`);
        }
    }

    async getByEmail(email) {
        try {
            const user = await this.model.findOne({ email }).lean();
            return user;
        } catch (error) {
            throw new Error(`Error getting user by email: ${error.message}`);
        }
    }

    async create(userData) {
        try {
            const existingUser = await this.getByEmail(userData.email);
            if (existingUser) {
                throw new Error('Email already registered');
            }

            if (userData.password) {
                userData.password = await createHash(userData.password);
            }

            const user = await this.model.create(userData);
            return user;
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    async update({ id, ...updateData }) {
        try {
            if (updateData.password) {
                updateData.password = await createHash(updateData.password);
            }

            if (updateData.email) {
                const existingUser = await this.getByEmail(updateData.email);
                if (existingUser && existingUser._id.toString() !== id) {
                    throw new Error('Email already registered');
                }
            }

            const updatedUser = await this.model.findByIdAndUpdate(
                id,
                { $set: updateData },
                { new: true }
            ).lean();

            return updatedUser;
        } catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            const deletedUser = await this.model.findByIdAndDelete(id).lean();
            return deletedUser;
        } catch (error) {
            throw new Error(`Error deleting user: ${error.message}`);
        }
    }

    async updateUserCart(userId, cartId) {
        try {
            const updatedUser = await this.model.findByIdAndUpdate(
                userId,
                { $set: { cartId: cartId } },
                { new: true }
            ).lean();
            return updatedUser;
        } catch (error) {
            throw new Error(`Error updating user cart: ${error.message}`);
        }
    }

    async getUserWithCart(id) {
        try {
            const user = await this.model.findById(id).populate('cartId').lean();
            return user;
        } catch (error) {
            throw new Error(`Error getting user with cart: ${error.message}`);
        }
    }
}