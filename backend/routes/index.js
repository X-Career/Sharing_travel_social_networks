const express = require("express");
const userRouter = require("./user_router");
const { userController } = require("../controllers");
const { authMiddleware } = require("../middlewares/auth_middleware");
const uploadAvatar = require("../helpers/upload_avatar");
const ImageModel = require("../models/image_model")
const Image = require("../entities/image_schema")
const router = express.Router();
const fs = require('fs')

router.use("/user", authMiddleware, userRouter);

router.post("/auth/login", userController.login);
router.post("/auth/register", userController.createUser);

router.post("/uploadAvatar", uploadAvatar.single('avatar'), (req,res) => {
    console.log(req.file, 'reqqq');
    const saveImg = new Image({
        name: req.body.name,
        img: {
            data: fs.readFileSync('uploads/' + req.file.filename)
        }
    })
    saveImg.save()
    .then((res) => console.log('saved'))
    .catch((err) => console.log('err', err))
})
router.get("/getAvatar", userController.getImage)
module.exports = router;
