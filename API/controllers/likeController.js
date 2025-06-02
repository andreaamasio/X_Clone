const db = require("../db/queries")

// const addLike = async (req, res) => {
//   const { postId } = req.params
//   const authorId = req.user.id
//   const addedLike = await db.addLike(postId, authorId)

//   res.json({
//     message: `The new like was created under post ${postId}`,
//     addedLike,
//   })
// }
// const removeLike = async (req, res) => {
//   const { postId } = req.params
//   const authorId = req.user.id
//   const removedLike = await db.removeLike(postId, authorId)

//   res.json({
//     message: `The new like was removed under post ${postId}`,
//     removedLike,
//   })
// }
const toggleLike = async (req, res) => {
  const { postId } = req.params
  const userId = req.user.id

  try {
    const existingLike = await db.findLike(postId, userId)

    if (existingLike) {
      await db.removeLike(postId, userId)
      return res.json({ message: "Like removed" })
    } else {
      const newLike = await db.addLike(postId, userId)
      return res.json({ message: "Like added", newLike })
    }
  } catch (error) {
    console.error("Error toggling like:", error)
    res.status(500).json({ message: "Server error during like toggle" })
  }
}

module.exports = { toggleLike }
