const { Router } = require("express")

const commentController = require("../controllers/commentController")
const userController = require("../controllers/userController")
const { authorizeOwnership } = require("../middleware/authorizeOwnership")
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
  authorizeOwnership("comment"),
  commentController.updateComment
)
commentRouter.delete(
  "/:commentId",
  userController.authenticateToken,
  authorizeOwnership("comment"),
  commentController.deleteComment
)
commentRouter.post(
  "/under-post/:postId",
  userController.authenticateToken,
  commentController.postNewComment
)

module.exports = commentRouter
