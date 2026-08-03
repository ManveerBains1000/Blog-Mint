import nodemailer from 'nodemailer';
import { ENV } from '../utils/env.js';

const transporter = nodemailer.createTransport(
    {
        host: ENV.MAIL_HOST,
        port: Number(ENV.MAIL_PORT),
        secure: false,
        auth: {
            user: ENV.MAIL_USER,
            pass: ENV.MAIL_PASS,
        }
    }
);


transporter.verify((error)=> {
    if (error) {
        console.error("Mail Server Error:",error.message);
    }
    else {
        console.log("Mail Server Connected");
    }
});

export default transporter;