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
    const updatePost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        content: newContent,
      },
    })

    if (updatepost) {
      console.log(`post by ID: ${postId} updated with ${newContent}`)
    } else {
      console.log(`error updating post: ${postId}`)
    }

    return updatePost
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
        authorId: loggedInUserId, // their own posts
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
                  followerId: loggedInUserId, // people the user follows
                },
              },
            },
          },
          {
            authorId: loggedInUserId, // their own posts
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

async function postNewPost(author, content) {
  try {
    const newPost = await prisma.post.create({
      data: {
        author,

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
}
