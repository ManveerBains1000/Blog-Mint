import redisClient from "../config/redis.js";
import bcrypt from 'bcrypt'
class OTPService {
    

    OTP_EXPIRY = 300;
    RESEND_COOLDOWN = 30;
    MAX_ATTEMPTS = 5;

    generateOTP() {
        return Math.floor(100000+Math.random()*900000).toString();
    }

    gedRedisKey(email,purpose) {
        return `opt:${purpose}:${email}`;
    }

    getCooldownKey(email,purpose) {
        return `otp:cooldown:${purpose}:${email}`;
    }

    async saveOTP(email,purpose) {
        
        const otp = this.generateOTP();

        const hashedOTP = await bcrypt.hash(otp,10);

        const key = this.gedRedisKey(email,purpose);

        const payload = {
            otp: hashedOTP,
            attempts: 0,
            createdAt : Date.now(),
        };


        await redisClient.set(
            key,
            JSON.stringify(payload),
            {
                EX:this.OTP_EXPIRY
            }
        );

        return otp;
    }

    async verifyOTP(email,purpose,enterdOTP) {

        const key = this.gedRedisKey(email,purpose);

        const data = await redisClient.get(key);

        if (!data) {
            return {
                success:false,
                code: "OTP_EXPIRED",
                message: "OTP expired or not found",
            };
        }

        const payload = JSON.parse(data);

        if (payload.attempts >= this.MAX_ATTEMPTS) {

            await redisClient.del(key);

            return {
                success:false,
                code: "MAX_ATTEMPTS",
                message: "Maximum OTP attempts exceeded",
            };
        }

        const isMatch = await bcrypt.compare(enterdOTP,payload.otp);

        if (!isMatch) {

            payload.attempts += 1;

            const ttl = await redisClient.ttl(key);

            await redisClient.set(
                key,
                JSON.stringify(payload),
                {
                    EX:ttl
                }
            );

            return {
                success: false,
                code: "INVALID_OTP",
                message: "Invalid OTP",
                attemptsLeft: this.MAX_ATTEMPTS-payload.attempts,
            }
        }

        await redisClient.del(key);

        return {
            success:true,
        };
    }
    async isCooldownActive(email,purpose) {

        const ttl = await redisClient.ttl(
            this.getCooldownKey(email,purpose)
        )

        return ttl > 0 ? ttl : false;
    }

    async startCooldown(email,purpose) {
        
        await redisClient.set(
            this.getCooldownKey(email,purpose),
            "1",
            {
                EX: this.RESEND_COOLDOWN
            }
        )
    }
    async getOTP(email,purpose) {

        const key = `otp:${purpose}:${email}`;

        return await redisClient.get(key);
    }

    async deleteOTP(email,purpose) {

        const key = `otp:${purpose}:${email}`;

        await redisClient.del(key);
    }


}

export default new OTPService();


