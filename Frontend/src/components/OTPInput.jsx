import React, { useRef } from "react";

function OTPInput({ length = 6, value, onChange }) {

    const inputRefs = useRef([]);

    const handleChange = (index, e) => {

        const inputValue = e.target.value.replace(/\D/g, "");

        if (!inputValue) {
            const otp = [...value];
            otp[index] = "";
            onChange(otp);
            return;
        }

        const otp = [...value];
        otp[index] = inputValue[0];

        onChange(otp);

        if (index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {

        if (
            e.key === "Backspace" &&
            !value[index] &&
            index > 0
        ) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {

        e.preventDefault();

        const pasted = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, length);

        if (!pasted) return;

        const otp = Array(length).fill("");

        pasted.split("").forEach((digit, index) => {
            otp[index] = digit;
        });

        onChange(otp);

        const lastIndex = Math.min(
            pasted.length,
            length
        ) - 1;

        inputRefs.current[lastIndex]?.focus();
    };

    return (
        <div className="flex justify-center gap-3">

            {Array.from({ length }).map((_, index) => (

                <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value[index]}
                    onChange={(e) => handleChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="
                        h-14
                        w-12
                        rounded-lg
                        border
                        border-gray-300
                        text-center
                        text-xl
                        font-semibold
                        outline-none
                        focus:border-blue-500
                    "
                />

            ))}

        </div>
    );
}

export default OTPInput;