import { OTP } from "../models/otp.model";

export const generateOTP = async (userId,email,purpose) => {
    const otp = Math.floor(100000+Math.random()*900000).toString();

    const expiresAt = new Date(Date.now()+5*60*1000);

    await OTP.deleteMany()
}