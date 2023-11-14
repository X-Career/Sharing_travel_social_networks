const express = require("express");
const userRouter = require("./user_router");
const { userController } = require("../controllers");
const { authMiddleware } = require("../middlewares/auth_middleware");
const postRouter = require("./post_router")
const router = express.Router();

router.use("/user", authMiddleware, userRouter);
router.use("/newsfeed",  postRouter);


router.post("/auth/login", userController.login);
router.post("/auth/register", userController.createUser);

module.exports = router;

