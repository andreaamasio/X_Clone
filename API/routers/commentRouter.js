const { Router } = require("express")

const commentController = require("../controllers/CommentController")
const userController = require("../controllers/userController")
const commentRouter = Router()

commentRouter.get(
  "/by-user/:userId",
  userController.authenticateToken,
  commentController.getUserComments
)
commentRouter.get(
  "/under-post/:postId",
  //userController.authenticateToken,
  commentController.getPostComments
)
commentRouter.get(
  "/:commentId",
  //userController.authenticateToken,
  commentController.getComment
)
commentRouter.put(
  "/:commentId",
  userController.authenticateToken,
  commentController.updateComment
)
commentRouter.delete(
  "/:commentId",
  userController.authenticateToken,
  commentController.deleteComment
)
commentRouter.post(
  "/",
  userController.authenticateToken,
  commentController.CommentNewComment
)

module.exports = commentRouter
