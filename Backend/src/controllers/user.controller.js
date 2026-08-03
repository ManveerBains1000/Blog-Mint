import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import  jwt  from "jsonwebtoken";
import { ENV } from "../utils/env.js";
import OTPService from "../services/otp.service.js";
import EmailService from "../services/email.service.js";
import otpService from "../services/otp.service.js";

const generateAccessAndRefreshToken = async (userId) => {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({validateBeforeSave:false})

    return {accessToken,refreshToken}
}

const options = {
  httpOnly:true,
  secure:true,
  sameSite: "none"
}

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const normalizedUsername = username.trim().toLowerCase();

    if ([normalizedUsername, password, email].some((field) => typeof field !== "string" || field.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
      $or: [{ username:normalizedUsername }, { email }],
    });

    if (existedUser) {
      if (!existedUser.isVerified) {
        const otp = await OTPService.saveOTP(
          existedUser.email,
          "EMAIL_VERIFICATION"
        );
        await EmailService.sendVerificationEmail(
          existedUser.email,
          existedUser.username,
          otp
        );

        return res.status(200).json(
          new ApiResponse(
            200,
            existedUser,
            "Account already exists but is not verified. A new OTP has been sent."
          )
        );
      }
      throw new ApiError(409,"User already exists");
    }

    const user = await User.create({
      username: username.toLowerCase(),
      email: email,
      password: password,
    });


    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );

    if (!createdUser)
      throw new ApiError(500, "Something went wrong while registering a user");


    const otp = await OTPService.saveOTP(
      createdUser.email,
      "EMAIL_VERIFICATION"
    );

    await EmailService.sendVerificationEmail(
      user.email,
      user.username,
      otp
    );

    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "Registration successful. Please verify your email using the OTP sent to your inbox."));
  } catch (error) {
    console.log('Error :: RegisterUser :',error.message);
    next(error);
  }
};

const loginUser = async (req,res,next) => {
    try {
        const {username,email,password} = req.body;
        
        if (!username  && !email) {
            throw new ApiError(400,"username or email is required")
        }

        const user = await User.findOne({$or: [{username},{email}]})

        if (!user) {
            throw new ApiError(404,"User does not exist")
        }

        const isValidPassword = await user.isPasswordCorrect(password);

        if (!isValidPassword) throw new ApiError(401,"Invalid Credentials");
        
        if (!user.isVerified) {
            const otp = await OTPService.saveOTP(
                user.email,
                "EMAIL_VERIFICATION"
            );
            

        }

        const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")


        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User loggedin successfully"
            )   
        )

    } catch (error) {
        console.log('Error :: LoginUser :', error.message);
        next(error);
    }
};

const logoutUser = async (req,res,next) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set:{
          refreshToken:undefined
        }
      },
      {
        new:true
      }
    );

    res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User Successfully Logout"));

  } catch (error) {
    console.log('Error :: LogoutUser :', error.message);
    next(error);
  }
}

const refreshAccessToken = async (req,res,next) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401,"Unauthorizzed Request");
    }

    const decodedToken = jwt.verify(incomingRefreshToken,ENV.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401,"Invalid Refresh Token");
    }

    if (user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401,"Refresh Token is expired");
    }    

    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user?._id);

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
      new ApiResponse(
        200,
        {

        },
        "Access Token is generated successfully"
      )
    )

  } catch (error) {
    console.log('Error :: RefreshAccessToken :',error.message);
    next(error);
  }
}

const getCurrentUser = async (req,res,next) => {
  try {
    return res
    .status(200)
    .json(new ApiResponse(200,req.user,"Current user is successfully fetched"))
  } catch (error) {
    console.log("Error :: getCurrentUser: ",error.message);
    next(error);
  }
}

const updateCurrentUser = async (req, res, next) => {
  try {
    const {
      username,
      currentPassword,
      newPassword,
      confirmPassword,
      profileImage,
    } = req.body;

    const hasUsernameUpdate = typeof username === "string" && username.trim() !== "";
    const hasPasswordUpdate = typeof newPassword === "string" && newPassword.trim() !== "";
    const hasProfileImageUpdate = profileImage !== undefined;

    if (!hasUsernameUpdate && !hasPasswordUpdate && !hasProfileImageUpdate) {
      throw new ApiError(400, "At least one account field must be updated");
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (hasUsernameUpdate) {
      const normalizedUsername = username.trim().toLowerCase();

      if (normalizedUsername !== user.username) {
        const existingUser = await User.findOne({
          username: normalizedUsername,
          _id: { $ne: user._id },
        });

        if (existingUser) {
          throw new ApiError(409, "Username is already taken");
        }

        user.username = normalizedUsername;
      }
    }

    if (hasProfileImageUpdate) {
      user.profileImage = typeof profileImage === "string" && profileImage.trim() !== "" ? profileImage.trim() : null;
    }

    if (hasPasswordUpdate) {
      if (!currentPassword || typeof currentPassword !== "string") {
        throw new ApiError(400, "Current password is required to change password");
      }

      if (newPassword !== confirmPassword) {
        throw new ApiError(400, "New password and confirm password do not match");
      }

      const isCurrentPasswordValid = await user.isPasswordCorrect(currentPassword);

      if (!isCurrentPasswordValid) {
        throw new ApiError(401, "Current password is incorrect");
      }

      user.password = newPassword;
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password -refreshToken");

    return res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "Account updated successfully"));
  } catch (error) {
    console.log("Error :: updateCurrentUser:", error.message);
    next(error);
  }
};

const verifyEmail = async(req,res,next) => {
  try {
    
    const {email,otp} = req.body;

    if (!email?.trim() || !otp?.trim()) {
      throw new ApiError(400,"Email and OTP are required");
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (!user) {
      throw new ApiError(404,"User not found");
    }

    if (user.isVerified) {
      throw new ApiError(400,"Email is already verified");
    }

    const result = await OTPService.verifyOTP(
      user.email,
      "EMAIL_VERIFICATION",
      otp
    );

    if (!result.success) {
      switch(result.code) {
        case "OTP_EXPIRED":
          throw new ApiError(410,result.message);

        case "MAX_ATTEMPTS":
          throw new ApiError(429,result.message);

        default:
          throw new ApiError(400,result.message);
      }
    }

    user.isVerified = true;

    await user.save({validateBeforeSave:false});

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          username:user.username,
          email: user.email,
          isVerified: user.isVerified,
        },
        "Email verified successfully."
      )
    );


  } catch (error) {
    console.log("Error :: verifyEmail:", error.message);
    next(error);
  }
};

const resendVerificationOTP = async (req,res,next) => {
  try {
    const {email} = req.body;

    if (!email?.trim()) {
      throw new ApiError(400,"Email is required");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail
    });

    if (!user) {
      throw new ApiError(404,"User not found");
    }

    if (user.isVerified) {
      throw new ApiError(400,"Email is already verified");
    }

    const cooldown = await OTPService.isCooldownActive(
      user.email,
      "EMAIL_VERIFICATION"
    );

    if (cooldown) {
      throw new ApiError(429,`Please wait ${cooldown} seconds before requesting another OTP`);
    }

    const otp = await OTPService.saveOTP(
      user.email,
      "EMAIL_VERIFICATION"
    );

    await EmailService.sendVerificationEmail(
      user.email,
      user.username,
      otp
    )

    await OTPService.startCooldown(
      user.email,
      "EMAIL_VERIFICATION"
    );
    
    return res.status(200).json(
      new ApiResponse(
        200,
        null,
        "A new verification OTP has been sent to your email."
      )
    );
    
  } catch (error) {
    console.log("Error :: resendVerificationOTP:", error.message);
    next(error);
  }
};

export {
  getCurrentUser,
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updateCurrentUser,
  verifyEmail,
  resendVerificationOTP
};

