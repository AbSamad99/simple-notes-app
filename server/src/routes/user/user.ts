import { Router } from "express";
import { createUserRouter } from "./create-delete/create-user";
import { deleteUserRouter } from "./create-delete/delete-user";
import { updateUserStatusRouter } from "./update/update-user-status";
import { updateUserRouter } from "./update/update-user";
import { updateUserPasswordRouter } from "./update/update-user-password";
import { getAllUsersRouter } from "./get/get-all-users";
import { getUserRouter } from "./get/get-user";

const router = Router();

router.use(createUserRouter);
router.use(updateUserRouter);
router.use(updateUserPasswordRouter);
router.use(deleteUserRouter);
router.use(updateUserStatusRouter);
router.use(getAllUsersRouter);
router.use(getUserRouter);

export { router as userRouter };
