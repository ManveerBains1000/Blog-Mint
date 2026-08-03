import transporter from "../config/mail.js";
import { ENV } from "../utils/env.js";
class EmailService {

    async sendVerificationEmail(email, username, otp) {

        const html = `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px">

                <h2 style="color:#2563eb;">
                    Welcome to Blog Mint 🎉
                </h2>

                <p>Hello <strong>${username}</strong>,</p>

                <p>
                    Thank you for registering.
                    Please verify your email using the OTP below.
                </p>

                <div
                    style="
                        background:#f4f4f4;
                        padding:18px;
                        font-size:32px;
                        text-align:center;
                        letter-spacing:8px;
                        font-weight:bold;
                        border-radius:8px;
                    "
                >
                    ${otp}
                </div>

                <p style="margin-top:20px;">
                    This OTP will expire in
                    <strong>5 minutes</strong>.
                </p>

                <p>
                    If you didn't create an account,
                    you can safely ignore this email.
                </p>

                <br>

                <p>
                    Regards,<br>
                    <strong>Blog Mint Team</strong>
                </p>

            </div>
        `;

        await transporter.sendMail({
            from: ENV.MAIL_FROM,
            to: email,
            subject: "Verify your Blog Mint account",
            html,
        });
    }

}

export default new EmailService();