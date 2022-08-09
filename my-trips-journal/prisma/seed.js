const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  const alberto = await prisma.user.create({
    data: {
      username: 'alberto',
      // Hash for password - twixrox
      passwordHash:
        '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u',
    },
  });

  await Promise.all(
    getLocations().map((location) => {
      const data = { userId: alberto.id, ...location };
      return prisma.location.create({ data });
    })
  );
}

seed();

function getLocations() {
  return [
    {
      title: 'Berlin 2008',
      visitDate: new Date(21, 12, 2008),
      body: 'Trip to Berlin with blablaba and noseque probando info',
      img: 'https://simple.wikipedia.org/wiki/Berlin#/media/File:Nr_2_Berlin_Panorama_von_der_Siegess%C3%A4ule_2021.jpg',
      lat: 52.50697,
      lng: 13.2843075,
    },
    {
      title: 'Praga 2008',
      visitDate: new Date(2, 6, 2008),
      body: 'Visited the city for two days',
      img: 'https://simple.wikipedia.org/wiki/Prague#/media/File:Prague_Montage.jpg',
      lat: 50.0598054,
      lng: 14.3251994,
    },
  ];
}
