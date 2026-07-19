import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

export const createPost = async (req, res, next) => {
  try {
    const { title, slug, content, status } = req.body;

    if ([title, slug, content].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }

    const existingPost = await Post.findOne({ slug });

    if (existingPost) {
      throw new ApiError(409, "Post already exists");
    }

    let imageUrl = "";

    if (req.file?.path) {
      const uploadedImage = await uploadOnCloudinary(req.file.path);

      imageUrl = uploadedImage?.secure_url;
    }

    const post = await Post.create({
      title,
      slug: slug.toLowerCase(),
      content,
      featuredImage: imageUrl,
      status,
      owner: req.user._id,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, post, "Post created successfully"));
  } catch (error) {
    console.log("Error :: createPost Api: ", error.message);
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    if (post.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Unauthorized");
    }

    let imageUrl = post.featuredImage;

    if (req.file?.path) {
      const uploadedImage = await uploadOnCloudinary(req.file.path);

      imageUrl = uploadedImage?.secure_url || imageUrl;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $set: {
          ...req.body,
          featuredImage: imageUrl,
        },
      },
      {
        new: true,
      },
    );

    return res
      .status(200)
      .json(new ApiResponse(200, updatePost, "Post updated successfully"));
  } catch (error) {
    console.log("Error :: updatePost Api: ", error.message);
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    if (post.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Unauthorized");
    }

    await Post.findByIdAndDelete(postId);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Post deleted successfully"));
  } catch (error) {
    console.log("Error :: deletePost Api: ", error.message);
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOne({slug}).populate(
      "owner",
      "username email",
    );

    if (!post) {
      throw new ApiError(404, "Post not found");
    }
    
    return res
      .status(200)
      .json(new ApiResponse(200, post, "Post fetech successfully"));
  } catch (error) {
    console.log("Error :: getPost Api: ", error.message);
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ status: "active" })
      .populate("owner", "username email")
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json(new ApiResponse(200, posts, "Posts fetched successfully "));
  } catch (error) {
    console.log("Error :: getPosts Api: ", error.message);
    next(error);
  }
};

export const getUserPosts = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const posts = await Post.find({
      owner: userId,
    })
      .sort({
        createdAt: -1,
      })
      .populate("owner", "username email");

    return res
      .status(200)
      .json(new ApiResponse(200, posts, "User posts fetched successfully"));
  } catch (error) {
    console.log("Error :: getUserPosts Api: ", error.message);
    next(error);
  }
};
