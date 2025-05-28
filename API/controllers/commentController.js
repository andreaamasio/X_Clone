const { body, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const db = require("../db/queries")

const jwt = require("jsonwebtoken")

const emptyErr = "cannot be empty."
const validateMessage = [
  body("content").trim().notEmpty().withMessage(`Content: ${emptyErr}`),
]

const getPost = async (req, res) => {
  const { postId } = req.params
  const post = await db.findPostId(postId)
  res.json({ post })
}

const deletePost = async (req, res) => {
  const { postId } = req.params
  const deletedPost = await db.deletePostById(postId)
  res.json({ deletedPost })
}
const updatePost = [
  validateMessage,
  async (req, res) => {
    console.log("Incoming body:", req.body)
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log("errors found")
      return res.status(400).json({
        errors: errors.array(),
      })
    }
    const { postId } = req.params
    const content = req.body.content
    const newPost = await db.updatePost(postId, content)
    res.json({ newPost })
  },
]
const getUserPosts = async (req, res) => {
  const { userId } = req.params
  const senderId = req.user.id
  const posts = await db.getUserPosts(userId)

  res.json({ posts })
}
const getWallPosts = async (req, res) => {
  const { userId } = req.params
  const posts = await db.getWallPosts(userId)

  res.json({ posts })
}

const postNewPost = [
  validateMessage,

  async (req, res) => {
    console.log("Incoming body:", req.body)
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log("errors found")
      return res.status(400).json({
        errors: errors.array(),
      })
    }

    const authorId = req.user.id
    const content = req.body.content

    const newPost = await db.postNewPost(authorId, content)

    res.json({
      message: `The user ${authorId} created post with content ${content}`,
      newPost,
    })
  },
]

module.exports = {
  getPost,
  updatePost,
  deletePost,
  getUserPosts,
  getWallPosts,
  postNewPost,
}
