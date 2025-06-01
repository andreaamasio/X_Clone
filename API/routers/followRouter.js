const { Router } = require("express")
const { authenticateToken } = require("../controllers/userController")
const followController = require("../controllers/followController")

const followRouter = Router()

followRouter.post("/:userId", authenticateToken, followController.followUser)
followRouter.delete(
  "/:userId",
  authenticateToken,
  followController.unfollowUser
)
followRouter.get("/followers/:userId", followController.getFollowers)
followRouter.get("/following/:userId", followController.getFollowing)

module.exports = followRouter
