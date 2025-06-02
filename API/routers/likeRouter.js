const { Router } = require("express")

const likeController = require("../controllers/likeController")
const userController = require("../controllers/userController")
const { authorizeLikeRemoval } = require("../middleware/authorizeOwnership")
const likeRouter = Router()

// likeRouter.post(
//   "/:postId",
//   userController.authenticateToken,
//   likeController.addLike
// )
// likeRouter.delete(
//   "/remove/:postId",
//   userController.authenticateToken,
//   authorizeLikeRemoval,
//   likeController.removeLike
// )
likeRouter.post(
  "/:postId",
  userController.authenticateToken,
  likeController.toggleLike
)
module.exports = likeRouter
