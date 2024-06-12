import prisma from "../../../lib/prisma";
import jwt from "jsonwebtoken";

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
      }
      break;

    case "DELETE":
      try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
          return res
            .status(401)
            .json({ error: "Authorization header is required" });
        }

        const token = authorizationHeader.split(" ")[1];
        if (!token) {
          return res
            .status(401)
            .json({ error: "Authorization token is required" });
        }

        let decoded;
        try {
          decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
          console.error("Token verification failed:", err);
          return res.status(401).json({ error: "Invalid token" });
        }

        const userId = decoded.userId;
        if (!userId) {
          return res.status(400).json({ error: "User ID not found in token" });
        }

        const deletedUser = await prisma.user.delete({
          where: { id: userId },
        });

        res.status(200).json(deletedUser);
      } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Failed to delete user" });
      }
      break;
    case "PUT":
      try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
          return res
            .status(401)
            .json({ error: "Authorization header is required" });
        }

        const token = authorizationHeader.split(" ")[1];
        if (!token) {
          return res
            .status(401)
            .json({ error: "Authorization token is required" });
        }

        let decoded;
        try {
          decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
          console.error("Token verification failed:", err);
          return res.status(401).json({ error: "Invalid token" });
        }

        const userId = decoded.userId;
        if (!userId) {
          return res.status(400).json({ error: "User ID not found in token" });
        }

        const { data } = req.body;
        if (!data) {
          return res.status(400).json({ error: "Data is required" });
        }

        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: data,
        });

        res.status(200).json(updatedUser);
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Failed to update user" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "DELETE", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
};
