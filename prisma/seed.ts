// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create a sample Hospital
  const hospital = await prisma.hospital.create({
    data: {
      name: 'City General Hospital',
      address: '123 Health St, Medville',
    },
  });
  console.log(`Created hospital: ${hospital.name} (ID: ${hospital.id})`);

  // Create a sample User (Agent)
  // In a real app, this ID would come from Clerk. For testing, we create one.
  const agent = await prisma.user.create({
    data: {
      id: 'user_2fKkXqV6mJ8bN7pL9cR3aW4sY5z', // A realistic-looking mock Clerk ID
      email: 'agent-test@example.com',
      name: 'Test Agent',
    },
  });
  console.log(`Created agent: ${agent.name} (ID: ${agent.id})`);

  console.log('Seeding finished.');
  console.log('---');
  console.log('You can use these IDs to test the API endpoints:');
  console.log(`Hospital ID: ${hospital.id}`);
  console.log(`Agent ID: ${agent.id}`);
  console.log('---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
