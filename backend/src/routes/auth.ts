import { Router, type IRouter } from "express";
import { db, usersTable } from "../db";
import { eq } from "drizzle-orm";
import { RegisterBody, LoginBody } from "../zod";
import { hashPassword, comparePassword, signToken } from "../lib/auth";
import { sendMail, emailWelcome, emailLogin } from "../lib/mailer";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.post("/auth/register", async (req, res): Promise<void> => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, password, name } = parsed.data;

  const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (existing) {
    res.status(409).json({ error: "Email already in use" });
    return;
  }

  const hashedPassword = await hashPassword(password);
  const [user] = await db
    .insert(usersTable)
    .values({ email, password: hashedPassword, name })
    .returning();

  const token = signToken({ userId: user.id, email: user.email, role: user.role });

  sendMail({ to: user.email, ...emailWelcome(user.name) }).catch((err) => {
    logger.error({ err, email: user.email }, "Failed to send welcome email");
  });

  res.status(201).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      createdAt: user.createdAt,
    },
  });
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, password } = parsed.data;

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = signToken({ userId: user.id, email: user.email, role: user.role });

  const loginTime = new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" }) + " (МСК)";
  sendMail({ to: user.email, ...emailLogin(user.name, loginTime) }).catch((err) => {
    logger.error({ err, email: user.email }, "Failed to send login email");
  });

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      createdAt: user.createdAt,
    },
  });
});

export default router;
