const { Router } = require("express")

const userController = require("../controllers/userController")
const { authorizeOwnership } = require("../middleware/authorizeOwnership")

const userRouter = Router()

userRouter.get("/sign-up", userController.getSignUp)
userRouter.post("/sign-up", userController.postSignUp)
userRouter.get("/login", userController.getLogin)
userRouter.post("/login", userController.postLogin)
userRouter.put("/", userController.authenticateToken, userController.updateUser)
userRouter.get(
  "/followed",
  userController.authenticateToken,
  userController.getFollowed
)
userRouter.get(
  "/:userId",
  userController.authenticateToken,
  authorizeOwnership("user"),
  userController.getFollowed
)
userRouter.put(
  "/:userId",
  userController.authenticateToken,
  authorizeOwnership("user"),
  userController.getFollowed
)
module.exports = userRouter
