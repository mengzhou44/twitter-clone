const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');
const prisma = new PrismaClient();

async function seed() {
  await prisma.user.createMany({
    data: [
      {
        email: 'meng.zhou@aer.ca',
        password: await argon2.hash('password'),
        username: 'meng',
      },
      {
        email: 'kevin16@hotmail.com',
        password: await argon2.hash('password'),
        username: 'kevin',
      },
    ],
  });
}

seed()
  .catch(error => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
