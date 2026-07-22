import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createComment, getCommentsByPost } from "../controllers/comment.controller.js";

const router = Router();

router.route("/:postId/comments").get(verifyJWT, getCommentsByPost).post(verifyJWT, createComment);

export default router;