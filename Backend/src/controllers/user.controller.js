import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import  jwt  from "jsonwebtoken";
import { ENV } from "../utils/env.js";

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

    if ([username, password, email].some((field) => field.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      throw new ApiError(409, "User is already existed");
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

    return res
      .status(201)
      .json(new ApiResponse(user, 201, "user registered successfully"));
  } catch (error) {
    console.log('Error :: RegisterUser :',error.message);
    error(error);
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

export {
  getCurrentUser,
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken
};

