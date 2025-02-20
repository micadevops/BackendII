import { TicketController } from "../controller/ticket.controller.js";
import { Router } from "express";


export const ticketRouter = Router();
const ticketController = new TicketController();

ticketRouter.post("/", ticketController.createTicket);

ticketRouter.get("/:id", ticketController.getTicketById);

ticketRouter.get("/", ticketController.getAllTickets);

ticketRouter.delete("/:id", ticketController.deleteTicket);

