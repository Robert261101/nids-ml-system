import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

const demoUsers = [
  { username: "viewer", role: "viewer" },
  { username: "analyst", role: "analyst" },
  { username: "admin", role: "admin" },
];

router.post("/login", (req, res) => {
  const { username } = req.body;
  const user = demoUsers.find((u) => u.username === username);

  if (!user) {
    return res.status(401).json({ error: "Invalid username" });
  }

  const token = jwt.sign(
    { username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token, role: user.role });
});

export default router;