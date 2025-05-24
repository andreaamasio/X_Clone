const { Router } = require("express")

const userController = require("../controllers/userController")
const userRouter = Router()

userRouter.get("/sign-up", userController.getSignUp)
userRouter.post("/sign-up", userController.postSignUp)
userRouter.get("/login", userController.getLogin)
userRouter.post("/login", userController.postLogin)
userRouter.put("/", userController.authenticateToken, userController.updateUser)
userRouter.get(
  "/",
  userController.authenticateToken,
  userController.getFollowed
)

module.exports = userRouter
