import { createClient } from "redis";
import nodemailer from "nodemailer";

export const subScribeToMessageQueue = () => {
    (async () => {

        const client = createClient();

        const subscriber = client.duplicate();

        await subscriber.connect();

        await subscriber.subscribe('alert', (message) => {
            const value = JSON.parse(message)

            // sendMail(value.userEmail)

            // Logging the alert since the mail service is not available
            console.log(`
                    An alert was triggered for the user ${value.userEmail}
                    Symbol: ${value.coinSymbol}
                    current Price: ${value.currentPrice}
                    The price of the coin is currenty above the trigger price: ${value.price}
                `)
        });
    })();
}

async function sendMail(value: { userEmail: string, symbol: string, price: number }) {

    console.log("email", process.env.EMAIL, "password", process.env.PASSWORD);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    var mailOptions = {
        from: process.env.EMAIL,
        to: value.userEmail,
        subject: 'Krypto Alert',
        text: `An alert was triggered for the user ${value.userEmail}\n
    Symbol: ${value.symbol}
                    The price of the coin is currenty above the trigger price: ${value.price}
                `
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}