import prisma from "../../../lib/prisma";
import { verify } from "jsonwebtoken";

export default async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { userId } = verify(token, process.env.JWT_SECRET);
    const { id } = req.body;

    if (req.method === "GET") {
      if (!id) {
        return res.status(400).json({ error: "Favorite movie ID required" });
      }

      const favorite = await prisma.favoriteMovie.findFirst({
        where: {
          id: parseInt(id, 10),
          userId,
        },
      });

      if (!favorite) {
        return res.status(404).json({ error: "Favorite movie not found" });
      }

      res.status(200).json(favorite);
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
