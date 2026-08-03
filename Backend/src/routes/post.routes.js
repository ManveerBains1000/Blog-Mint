import {Router} from 'express'
import {verifyJWT} from '../middlewares/auth.middleware.js'
import upload from '../middlewares/multer.middleware.js';

import {
    createPost,
    updatePost,
    deletePost,
    getPost,
    getPosts,
    getUserPosts,
    searchPosts
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

// Search route MUST be above /:slug to prevent "search" being treated as a slug
router.route("/search").get(searchPosts);

router.route("/:slug").patch(
    verifyJWT,
    upload.single("featuredImage"),
    updatePost
).delete(
    verifyJWT,
    deletePost
).get(getPost);

export default router

