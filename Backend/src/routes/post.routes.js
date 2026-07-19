import {Router} from 'express'
import {verifyJWT} from '../middlewares/auth.middleware.js'
import upload from '../middlewares/multer.middleware.js';

import {
    createPost,
    updatePost,
    deletePost,
    getPost,
    getPosts,
    getUserPosts
} from '../controllers/post.controller.js';

const router = Router();

router.route("/").post(
    verifyJWT,
    upload.single("featuredImage"),
    createPost
).get(getPosts);


router.route("/my-posts").get(
    verifyJWT,
    getUserPosts
);


router.route("/:slug").patch(
    verifyJWT,
    upload.single("featuredImage"),
    updatePost
).delete(
    verifyJWT,
    deletePost
).get(getPost);


export default router
