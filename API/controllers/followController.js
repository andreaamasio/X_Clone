const db = require("../db/queries") // or prisma directly

// POST /follow/:userId
const followUser = async (req, res) => {
  const followerId = req.user.id
  const followingId = req.params.userId

  if (followerId === followingId) {
    return res.status(400).json({ message: "Cannot follow yourself" })
  }

  try {
    const follow = await db.followUser(followerId, followingId)
    res.json({ message: `Followed user ${followingId}`, follow })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to follow user" })
  }
}

// DELETE /follow/:userId
const unfollowUser = async (req, res) => {
  const followerId = req.user.id
  const followingId = req.params.userId

  try {
    const unfollow = await db.unfollowUser(followerId, followingId)
    res.json({ message: `Unfollowed user ${followingId}`, unfollow })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to unfollow user" })
  }
}

// GET /followers/:userId
const getFollowers = async (req, res) => {
  const { userId } = req.params
  try {
    const followers = await db.getFollowers(userId)
    res.json({ followers })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to get followers" })
  }
}

// GET /following/:userId
const getFollowing = async (req, res) => {
  const { userId } = req.params
  try {
    const following = await db.getFollowing(userId)
    res.json({ following })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to get following list" })
  }
}

module.exports = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
}
