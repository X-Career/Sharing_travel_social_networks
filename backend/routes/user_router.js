const express = require("express");
const { userController } = require("../controllers/index");
const fileUploader = require("../helpers/upload_file");
const {
  middlewareValidate,
  updateUserSchema,
  updatePasswordSchema,
} = require("../middlewares/valid_middleware");

const userRouter = express.Router();

userRouter.post("/upload", userController.uploadAvatar);
userRouter.post("/comment", userController.createComment);
userRouter.get("/current", userController.getCurrentUser);
userRouter.get("/name", userController.getUser);
userRouter.get("/users", userController.getUsers);
userRouter.delete("/delete", userController.deleteUser);
userRouter.post(
  "/cloudinary-upload/avatar",
  fileUploader.single("avatar"),
  userController.uploadAvatar
);
userRouter.post(
  "/cloudinary-upload/post",
  fileUploader.array("images"),
  userController.createPost
);
userRouter.patch(
  "/update",
  middlewareValidate(updateUserSchema),
  userController.updateUser
);
userRouter.patch(
  "/password",
  middlewareValidate(updatePasswordSchema),
  userController.updatePassword
);

module.exports = userRouter;
