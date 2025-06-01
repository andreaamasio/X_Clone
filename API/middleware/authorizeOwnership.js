const db = require("../db/queries")

const authorizeOwnership = (type) => {
  return async (req, res, next) => {
    const { postId, commentId, id } = req.params // "id" used for user routes
    const userId = req.user.id

    try {
      let resource

      if (type === "post") {
        resource = await db.findPostId(postId)
      } else if (type === "comment") {
        resource = await db.findCommentById(commentId)
      } else if (type === "user") {
        if (userId !== id) {
          return res.status(403).json({
            message: "Not authorized to access or modify this user account",
          })
        }
        return next() // No need to query DB if just checking ID match
      } else {
        return res.status(500).json({ message: "Invalid resource type" })
      }

      if (!resource) {
        return res.status(404).json({ message: `${type} not found` })
      }

      if (resource.authorId !== userId) {
        return res
          .status(403)
          .json({ message: `Not authorized to modify this ${type}` })
      }

      next()
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: "Server error during authorization" })
    }
  }
}

const authorizeLikeRemoval = async (req, res, next) => {
  const { postId } = req.params
  const userId = req.user.id

  try {
    const like = await db.findLike(postId, userId)

    if (!like) {
      return res.status(404).json({ message: "Like not found" })
    }

    if (like.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to remove this like" })
    }

    next()
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error during like authorization" })
  }
}

module.exports = {
  authorizeOwnership,
  authorizeLikeRemoval,
}
