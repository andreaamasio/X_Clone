require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const userRouter = require("./routers/userRouter")
const postRouter = require("./routers/postRouter")
const commentRouter = require("./routers/commentRouter")
const followRouter = require("./routers/followRouter")
const likeRouter = require("./routers/likeRouter")
app.use("/like", likeRouter)
app.use("/follow", followRouter)
app.use("/user", userRouter)
app.use("/post", postRouter)
app.use("/comment", commentRouter)
app.get("/", (req, res) => res.json({ message: "Welcome to X clone API" }))

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Express app is live - listening on port ${PORT}!`)
})
