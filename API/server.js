require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const userRouter = require("./routers/userRouter")
//const postRouter = require("./routers/postRouter")
app.use("/user", userRouter)
//app.use("/post", postRouter)
app.get("/", (req, res) => res.json({ message: "Welcome to X clone API" }))

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Express app is live - listening on port ${PORT}!`)
})
