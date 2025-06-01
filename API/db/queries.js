const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
async function findUserByEmail(email) {
  console.log("Looking for user with email:", email)
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (user) {
      console.log(`User found: ${email}`)
    } else {
      console.log(`User not found: ${email}`)
    }

    return user
  } catch (error) {
    console.error(`Error finding user by email (${email}):`, error)
    throw error
  }
}

async function findUserById(id) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (user) {
      console.log(`User found by ID: ${id}`)
    } else {
      console.log(`User not found by ID: ${id}`)
    }

    return user
  } catch (error) {
    console.error(`Error finding user by ID (${id}):`, error)
    throw error
  }
}
async function findPostId(postId) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (post) {
      console.log(`Post found by ID: ${postId}`)
    } else {
      console.log(`Post not found by ID: ${postId}`)
    }

    return post
  } catch (error) {
    console.error(`Error finding post by ID (${postId}):`, error)
    throw error
  }
}

async function updatePost(postId, newContent) {
  try {
    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        content: newContent,
      },
    })

    if (updatedPost) {
      console.log(`post by ID: ${postId} updated with ${newContent}`)
    } else {
      console.log(`error updating post: ${postId}`)
    }

    return updatedPost
  } catch (error) {
    console.error(`Error updating post by ID (${postId}):`, error)
    throw error
  }
}
async function updateUser(userId, name, bio) {
  try {
    const updateUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: name,
        bio: bio,
      },
    })

    if (updateUser) {
      console.log(`User with ID: ${userId} updated with new name: ${name}`)
    } else {
      console.log(`error updating user: ${userId}`)
    }

    return updateUser
  } catch (error) {
    console.error(`Error updating user ID (${userId}):`, error)
    throw error
  }
}

async function getUserPosts(userId) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        authorId: userId, // their own posts
      },

      include: {
        author: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      // skip: page * pageSize,  // e.g., page = 0, pageSize = 10 for the first page
      // take: pageSize,         // how many posts to return per page
    })

    if (posts) {
      console.log(`User posts found: ${posts}`)
    } else {
      console.log(`User posts not found`)
    }

    return posts
  } catch (error) {
    console.error(`Error finding user posts`, error)
    throw error
  }
}
async function getWallPosts(userId) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            author: {
              followers: {
                some: {
                  followerId: userId, // people the user follows
                },
              },
            },
          },
          {
            authorId: userId, // their own posts
          },
        ],
      },
      include: {
        author: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      // skip: page * pageSize,  // e.g., page = 0, pageSize = 10 for the first page
      // take: pageSize,         // how many posts to return per page
    })

    if (posts) {
      console.log(`Wall posts found: ${posts}`)
    } else {
      console.log(`Wall posts not found`)
    }

    return posts
  } catch (error) {
    console.error(`Error finding wall posts`, error)
    throw error
  }
}

async function findFollowing(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        following: {
          include: {
            following: true, // this gives you the full user objects being followed
          },
        },
      },
    })

    if (user?.following?.length) {
      console.log(`Following found: ${user.following.length} users`)
    } else {
      console.log(`No following found`)
    }

    // Map just the followed users (skip the Follow model wrapper)
    const followedUsers = user.following.map((f) => f.following)
    return followedUsers
  } catch (error) {
    console.error(`Error finding following`, error)
    throw error
  }
}

async function postNewUser(email, hashedPassword, name, username) {
  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        username,
      },
    })

    console.log(`User successfully created: ${email}`)
    return newUser
  } catch (error) {
    console.error(`Error creating new user (${email}):`, error)
    throw error
  }
}

async function postNewPost(authorId, content) {
  try {
    const newPost = await prisma.post.create({
      data: {
        authorId,

        content,
      },
    })

    console.log(`Post successfully created: ${content}`)
    return newPost
  } catch (error) {
    console.error(`Error creating new post (${content}):`, error)
    throw error
  }
}

async function deletePostById(postId) {
  try {
    const deletedPost = await prisma.post.delete({
      where: {
        id: postId,
      },
    })

    console.log(`Deleted postId: ${postId}`)
    return deletedPost
  } catch (error) {
    console.error(`Error deleting post (${postId}):`, error)
    throw error
  }
}

async function findCommentById(commentId) {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    })

    if (comment) {
      console.log(`Comment found by ID: ${commentId}`)
    } else {
      console.log(`Comment not found by ID: ${commentId}`)
    }

    return comment
  } catch (error) {
    console.error(`Error finding comment by ID (${commentId}):`, error)
    throw error
  }
}

async function deleteCommentById(commentId) {
  try {
    const deletedPost = await prisma.comment.delete({
      where: {
        id: commentId,
      },
    })

    console.log(`Deleted commentedId: ${commentId}`)
    return deletedPost
  } catch (error) {
    console.error(`Error deleting comment (${commentId}):`, error)
    throw error
  }
}

async function updateCommentById(commentId, content) {
  try {
    const updatedComment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content: content,
      },
    })

    if (updatedComment) {
      console.log(`post by ID: ${commentId} updated with ${content}`)
    } else {
      console.log(`error updating post: ${commentId}`)
    }

    return updateCommentById
  } catch (error) {
    console.error(`Error updating post by ID (${commentId}):`, error)
    throw error
  }
}

async function findCommentsByUserId(userId) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        authorId: userId, // their own posts
      },

      include: {
        author: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      // skip: page * pageSize,  // e.g., page = 0, pageSize = 10 for the first page
      // take: pageSize,         // how many posts to return per page
    })

    if (comments) {
      console.log(`User comments found: ${comments}`)
    } else {
      console.log(`User comments not found`)
    }

    return comments
  } catch (error) {
    console.error(`Error finding comments`, error)
    throw error
  }
}

async function findCommentsByPostId(postId) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId,
      },

      include: {
        author: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      // skip: page * pageSize,  // e.g., page = 0, pageSize = 10 for the first page
      // take: pageSize,         // how many posts to return per page
    })

    if (comments) {
      console.log(`Post comments found: ${comments.length}`)
    } else {
      console.log(`Post comments not found`)
    }

    return comments
  } catch (error) {
    console.error(`Error finding user posts`, error)
    throw error
  }
}

async function postComment(authorId, postId, content) {
  try {
    const newComment = await prisma.comment.create({
      data: {
        authorId,
        postId,
        content,
      },
    })

    console.log(`Comment successfully created: ${content}`)
    return newComment
  } catch (error) {
    console.error(`Error creating new comment (${content}):`, error)
    throw error
  }
}
async function findLike(postId, userId) {
  try {
    const like = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    })

    if (like) {
      console.log(`Like found for post ID: ${postId}`)
    } else {
      console.log(`Like not found for post ID: ${postId}`)
    }

    return like
  } catch (error) {
    console.error(`Error finding like by post ID (${postId}):`, error)
    throw error
  }
}
const addLike = async (postId, userId) => {
  try {
    return await prisma.like.create({
      data: {
        postId,
        userId,
      },
    })
  } catch (err) {
    if (err.code === "P2002") {
      throw new Error("You already liked this post.")
    }
    throw err
  }
}
const removeLike = async (postId, userId) => {
  return await prisma.like.deleteMany({
    where: {
      postId,
      userId,
    },
  })
}
async function followUser(followerId, followingId) {
  return await prisma.follow.create({
    data: {
      followerId,
      followingId,
    },
  })
}

async function unfollowUser(followerId, followingId) {
  return await prisma.follow.deleteMany({
    where: { followerId, followingId },
  })
}

async function getFollowers(userId) {
  return await prisma.follow.findMany({
    where: { followingId: userId },
    include: { follower: true },
  })
}

async function getFollowing(userId) {
  return await prisma.follow.findMany({
    where: { followerId: userId },
    include: { following: true },
  })
}

module.exports = {
  findUserByEmail,
  findUserById,
  postNewUser,
  updateUser,
  deletePostById,
  findPostId,
  postNewPost,
  getUserPosts,
  getWallPosts,
  updatePost,
  findFollowing,
  updatePost,
  findCommentById,
  deleteCommentById,
  updateCommentById,
  findCommentsByPostId,
  findCommentsByUserId,
  postComment,
  addLike,
  removeLike,
  findLike,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
}
