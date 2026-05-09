import { Router, type IRouter } from "express";
import { z } from "zod";
import { sendMail, emailContactReceived } from "../lib/mailer";
import { logger } from "../lib/logger";

const ADMIN_EMAIL = "selorabooking@gmail.com";

const ContactBody = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  topic: z.string().max(200).optional().default(""),
  bookingRef: z.string().max(100).optional().default(""),
  message: z.string().min(1).max(5000),
});

const NewsletterBody = z.object({
  email: z.string().email(),
});

const router: IRouter = Router();

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = ContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { name, email, topic, bookingRef, message } = parsed.data;

  sendMail({
    to: ADMIN_EMAIL,
    ...emailContactReceived({ adminEmail: ADMIN_EMAIL, fromName: name, fromEmail: email, topic, bookingRef, message }),
  }).catch((err) => {
    logger.error({ err, from: email }, "Failed to send contact email");
  });

  res.json({ ok: true });
});

router.post("/newsletter/subscribe", async (req, res): Promise<void> => {
  const parsed = NewsletterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email } = parsed.data;

  const { emailNewsletterSubscribed } = await import("../lib/mailer");

  sendMail({ to: email, ...emailNewsletterSubscribed(email) }).catch((err) => {
    logger.error({ err, email }, "Failed to send newsletter subscription email");
  });

  res.json({ ok: true });
});

export default router;
