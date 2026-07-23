import {Router} from 'express'
import { loginUser,logoutUser,registerUser,refreshAccessToken,getCurrentUser,updateCurrentUser } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();



router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(verifyJWT,logoutUser);
router.route('/refresh-token').post(refreshAccessToken);
router.route('/get-user').post(verifyJWT,getCurrentUser);
router.route('/update-account').patch(verifyJWT,updateCurrentUser);

export default router;