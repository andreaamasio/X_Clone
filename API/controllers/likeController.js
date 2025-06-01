const db = require("../db/queries")

const addLike = async (req, res) => {
  const { postId } = req.params
  const authorId = req.user.id
  const addedLike = await db.addLike(postId, authorId)

  res.json({
    message: `The new like was created under post ${postId}`,
    addedLike,
  })
}
const removeLike = async (req, res) => {
  const { postId } = req.params
  const authorId = req.user.id
  const removedLike = await db.removeLike(postId, authorId)

  res.json({
    message: `The new like was removed under post ${postId}`,
    removedLike,
  })
}

module.exports = { addLike, removeLike }
