const { Router } = require("express")

const postController = require("../controllers/postController")
const userController = require("../controllers/userController")
const postRouter = Router()

postRouter.get(
  "/user/:userId",
  userController.authenticateToken,
  postController.getUserPosts
)
postRouter.get(
  "/user/:userId/wall",
  userController.authenticateToken,
  postController.getWallPosts
)
postRouter.get(
  "/:postId",
  //userController.authenticateToken,
  postController.getPost
)
postRouter.put(
  "/:postId",
  userController.authenticateToken,
  postController.updatePost
)
postRouter.delete(
  "/:postId",
  userController.authenticateToken,
  postController.deletePost
)
postRouter.post(
  "/",
  userController.authenticateToken,
  postController.postNewPost
)

module.exports = postRouter
