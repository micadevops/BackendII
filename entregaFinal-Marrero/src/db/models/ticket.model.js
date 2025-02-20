import mongoose from 'mongoose'; 
import { v4 as uuidv4 } from "uuid";

const ticketCollection = "ticket";

const ticketSchema = mongoose.Schema({
    code: {
        type: String,
        unique: true,
        default: () => uuidv4(),
        required: true
    },
    purchase_datetime: {
        type: Date,
        default: Date.now,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    
    purchaser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    }
});

export const ticketModel = mongoose.model(ticketCollection, ticketSchema);
