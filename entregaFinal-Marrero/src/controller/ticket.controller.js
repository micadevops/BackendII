import { TicketService } from "../services/ticket.service.js";

export class  TicketController {
        constructor() {
            this.ticketService = new TicketService();
        }

    async createTicket(req, res) {
        try {
            const ticket = await ticketService.createTicket(req.body);
            res.status(201).json({ message: "Ticket created successfully", ticket });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getTicketById(req, res) {
        try {
            const ticket = await ticketService.getTicketById(req.params.id);
            if (!ticket) {
                return res.status(404).json({ message: "Ticket not found" });
            }
            res.status(200).json(ticket);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getAllTickets(req, res) {
        try {
            const tickets = await ticketService.getAllTickets();
            res.status(200).json(tickets);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteTicket(req, res) {
        try {
            const deletedTicket = await ticketService.deleteTicket(req.params.id);
            if (!deletedTicket) {
                return res.status(404).json({ message: "Ticket not found" });
            }
            res.status(200).json({ message: "Ticket deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
