import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

export class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    async sendPurchaseConfirmation(userEmail, purchaseData) {

        const productsHtml = purchaseData.products.map(product => `
            <tr>
                <td>${product.title}</td>
                <td>${product.quantity}</td>
                <td>$${product.price}</td>
                <td>$${product.price * product.quantity}</td>
            </tr>
        `).join('');

        const failedProductsHtml = purchaseData.failedProducts.length > 0 ? `
            <h3>Productos no disponibles:</h3>
            <ul>
                ${purchaseData.failedProducts.map(product => `
                    <li>${product.title} - Cantidad solicitada: ${product.requestedQuantity} 
                    (Stock disponible: ${product.availableStock})</li>
                `).join('')}
            </ul>
        ` : '';

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Confirmación de Compra',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1>¡Gracias por tu compra!</h1>
                    
                    <h2>Detalles del ticket:</h2>
                    <p><strong>Código:</strong> ${purchaseData.code}</p>
                    <p><strong>Fecha:</strong> ${new Date(purchaseData.purchase_datetime).toLocaleString()}</p>
                    <p><strong>Total:</strong> $${purchaseData.amount.toFixed(2)}</p>
                    
                    <h2>Productos comprados:</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #f8f9fa;">
                                <th style="padding: 8px; border: 1px solid #dee2e6;">Producto</th>
                                <th style="padding: 8px; border: 1px solid #dee2e6;">Cantidad</th>
                                <th style="padding: 8px; border: 1px solid #dee2e6;">Precio</th>
                                <th style="padding: 8px; border: 1px solid #dee2e6;">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productsHtml}
                        </tbody>
                    </table>
                    
                    ${failedProductsHtml}
                    
                    <p style="margin-top: 20px;">
                        Si tienes alguna pregunta sobre tu compra, no dudes en contactarnos.
                    </p>
                </div>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            throw error;
        }
    }
}