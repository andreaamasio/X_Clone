const { body, validationResult } = require("express-validator")
const db = require("../db/queries")

const emptyErr = "cannot be empty."
const validateMessage = [
  body("content").trim().notEmpty().withMessage(`Content: ${emptyErr}`),
]

// Get a single comment by ID (public)
const getComment = async (req, res) => {
  const { commentId } = req.params
  const comment = await db.findCommentById(commentId)
  res.json({ comment })
}

// Delete a comment (auth required)
const deleteComment = async (req, res) => {
  const { commentId } = req.params
  const deletedComment = await db.deleteCommentById(commentId)
  res.json({ deletedComment })
}

// Update a comment (auth + validation required)
const updateComment = [
  validateMessage,
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { commentId } = req.params
    const content = req.body.content

    const updatedComment = await db.updateCommentById(commentId, content)
    res.json({ updatedComment })
  },
]

// Get all comments made by a user (auth required)
const getUserComments = async (req, res) => {
  const { userId } = req.params
  const comments = await db.findCommentsByUserId(userId)
  res.json({ comments })
}

// Get all comments under a post (public)
const getPostComments = async (req, res) => {
  const { postId } = req.params
  const comments = await db.findCommentsByPostId(postId)
  res.json({ comments })
}

// Create a new comment (auth + validation required)
const postNewComment = [
  validateMessage,
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const authorId = req.user.id
    const { postId } = req.params
    const { content } = req.body

    const newComment = await db.postComment(authorId, postId, content)

    res.json({
      message: `User ${authorId} commented on post ${postId}`,
      newComment,
    })
  },
]

module.exports = {
  getComment,
  deleteComment,
  updateComment,
  getUserComments,
  getPostComments,
  postNewComment,
}
