import { Router } from "express";

// Main routes
import { signUpRouter } from "./main/signup";
import { verifyEmailRouter } from "./main/verify-email";
import { signinRouter } from "./main/signin";
import { currentUserRouter } from "./main/current-user";
import { signoutRouter } from "./main/signout";

// Password related routers
import { forgotPasswordRouter } from "./password/forgot-password";
import { verifyResetPasswordRouter } from "./password/verify-reset-password";
import { resetPasswordRouter } from "./password/reset-password";

// Token related routers
import { refreshRouter } from "./token/refresh";

const router = Router();

router.use(signUpRouter);
router.use(verifyEmailRouter);
router.use(signinRouter);
router.use(currentUserRouter);
router.use(signoutRouter);
router.use(forgotPasswordRouter);
router.use(verifyResetPasswordRouter);
router.use(resetPasswordRouter);
router.use(refreshRouter);

export { router as authRouter };
