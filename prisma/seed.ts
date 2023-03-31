import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  const user = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      displayName: 'Ahsan Ayaz',
    },
  });

  const game1 = await prisma.session.upsert({
    where: { pin: 'Basic Game' },
    update: {},
    create: {
      name: 'Basic Game',
      pin: '123',
      userId: 1
    },
  });

  console.log({ game1 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });