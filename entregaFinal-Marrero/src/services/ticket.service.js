import { ticketModel } from "../db/models/ticket.model.js";

export class TicketService {
    async create (uid, amount) {
        try {
            const ticket = await ticketModel.create({ purchaser: uid, amount});
            return ticket;
            
        } catch (error) {
            throw new Error(`Error creating ticket: ${error.message}`);
        }
    }

    async getTicketById(id) {
        try {
            return await ticketModel.findById(id).populate("purchaser");
        } catch (error) {
            throw new Error(`Error fetching ticket: ${error.message}`);
        }
    }

    async getAllTickets() {
        try {
            return await ticketModel.find().populate("purchaser");
        } catch (error) {
            throw new Error(`Error fetching tickets: ${error.message}`);
        }
    }

    async deleteTicket(id) {
        try {
            return await ticketModel.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Error deleting ticket: ${error.message}`);
        }
    }
}
