const { PrismaClient } = require("@prisma/client")
const { faker } = require("@faker-js/faker")

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Clean up the database
  await prisma.like.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.follow.deleteMany()
  await prisma.user.deleteMany()

  // Create fake users
  const users = []
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        username: faker.internet.username(),
        name: faker.person.fullName(),
        bio: faker.lorem.sentence(),
        password: faker.internet.password(), // In real apps, passwords must be hashed
        profileImage: faker.image.avatar(),
      },
    })
    users.push(user)
  }

  // Create posts for each user
  for (const user of users) {
    for (let j = 0; j < 2; j++) {
      await prisma.post.create({
        data: {
          content: faker.lorem.sentence(),
          image: faker.image.urlPicsumPhotos(),
          authorId: user.id,
        },
      })
    }
  }

  // Create some follows
  for (const follower of users) {
    const followed = users.filter((u) => u.id !== follower.id).slice(0, 3) // follow 3 others
    for (const userToFollow of followed) {
      await prisma.follow.create({
        data: {
          followerId: follower.id,
          followingId: userToFollow.id,
        },
      })
    }
  }

  console.log("✅ Seeding complete!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
