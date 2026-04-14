import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../../config/env.js";

const router = Router();

const demoUser = {
  id: "u1",
  username: "dilxushbek",
  fullName: "Dilxushbek Admin",
  role: "admin",
  passwordHash: bcrypt.hashSync("2003", 10),
};

router.post("/login", async (req, res) => {
  const schema = z.object({ username: z.string(), password: z.string() });
  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Login ma'lumotlari noto'g'ri" });
  }

  const { username, password } = parsed.data;

  if (username !== demoUser.username) {
    return res.status(401).json({ message: "Foydalanuvchi topilmadi" });
  }

  const ok = await bcrypt.compare(password, demoUser.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: "Parol noto'g'ri" });
  }

  const token = jwt.sign(
    { sub: demoUser.id, username: demoUser.username, role: demoUser.role },
    env.jwtSecret,
    { expiresIn: "12h" }
  );

  return res.json({
    token,
    user: {
      id: demoUser.id,
      username: demoUser.username,
      fullName: demoUser.fullName,
      role: demoUser.role,
    },
  });
});

export default router;
