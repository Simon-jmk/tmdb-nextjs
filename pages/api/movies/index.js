import prisma from '../../../lib/prisma';
import { verify } from 'jsonwebtoken';

export default async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authorization.split(' ')[1];

  try {
    const { userId } = verify(token, process.env.JWT_SECRET);

    if (req.method === 'GET') {
      const favorites = await prisma.favoriteMovie.findMany({ where: { userId } });
      res.status(200).json(favorites);
    } else if (req.method === 'POST') {
      const { tmdbId } = req.body;
      const existingFavorite = await prisma.favoriteMovie.findFirst({
        where: { userId, tmdbId },
      });
      if (existingFavorite) {
        return res.status(400).json({ error: 'Movie already favorited' });
      }
      const favorite = await prisma.favoriteMovie.create({
        data: {
          tmdbId,
          userId,
        },
      });
      res.status(201).json(favorite);
    } else if (req.method === 'DELETE') {
      const { tmdbId } = req.body;
      await prisma.favoriteMovie.deleteMany({
        where: {
          userId,
          tmdbId,
        },
      });
      res.status(204).end();
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
