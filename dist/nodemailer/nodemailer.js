"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
class email {
    async emailTo(to, subject, text) {
        // create reusable transporter object using the default SMTP transport
        const transport = nodemailer_1.default.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            auth: {
                //specify the email and password
                user: "ccbuilder.go3@gmail.com",
                pass: process.env.email_password,
            },
        });
        //an object to be sent that has from, to subject and text
        let mailOptions = {
            from: '"Computer Componnt Builder" ccbuilder.go3@gmail.com',
            to: to,
            subject: subject,
            text: text,
        };
        //send email with the transport object (mailOptions)
        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                return error;
            }
            else {
                return console.log("An email was sent");
            }
        });
    }
}
exports.default = email;
