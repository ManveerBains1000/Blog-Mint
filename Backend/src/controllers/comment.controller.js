import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === "") {
      throw new ApiError(400, "Comment content is required");
    }

    const post = await Post.findById(postId);

    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    const comment = await Comment.create({
      content: content.trim(),
      post: postId,
      author: req.user._id,
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate("author", "username email")
      .populate("post", "title slug");

    return res
      .status(201)
      .json(new ApiResponse(201, populatedComment, "Comment created successfully"));
  } catch (error) {
    console.log("Error :: createComment Api: ", error.message);
    next(error);
  }
};

export const getCommentsByPost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    const comments = await Comment.find({ post: postId })
      .populate("author", "username email")
      .sort({ createdAt: 1 });

    return res
      .status(200)
      .json(new ApiResponse(200, comments, "Comments fetched successfully"));
  } catch (error) {
    console.log("Error :: getCommentsByPost Api: ", error.message);
    next(error);
  }
};