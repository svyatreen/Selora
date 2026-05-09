import { Router, type IRouter } from "express";
import { db, paymentMethodsTable } from "../db";
import { eq, and, sql } from "drizzle-orm";
import { z } from "zod";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

function toTitleCase(s: string): string {
  return s
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ""))
    .join(" ");
}

const CreatePaymentMethodBody = z.object({
  brand: z.string().min(1).max(40),
  last4: z.string().length(4),
  expMonth: z.number().int().min(1).max(12),
  expYear: z.number().int().min(2024).max(2099),
  cardholderName: z.string().min(2).max(80),
  isDefault: z.boolean().optional(),
});

router.get("/payment-methods", requireAuth, async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(paymentMethodsTable)
    .where(eq(paymentMethodsTable.userId, req.user!.userId))
    .orderBy(sql`${paymentMethodsTable.isDefault} desc, ${paymentMethodsTable.createdAt} desc`);
  res.json(rows);
});

router.post("/payment-methods", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreatePaymentMethodBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { brand, last4, expMonth, expYear, cardholderName } = parsed.data;

  const existing = await db
    .select({ id: paymentMethodsTable.id })
    .from(paymentMethodsTable)
    .where(eq(paymentMethodsTable.userId, req.user!.userId));

  const isDefault = parsed.data.isDefault ?? existing.length === 0;

  if (isDefault && existing.length > 0) {
    await db
      .update(paymentMethodsTable)
      .set({ isDefault: false })
      .where(eq(paymentMethodsTable.userId, req.user!.userId));
  }

  const [created] = await db
    .insert(paymentMethodsTable)
    .values({
      userId: req.user!.userId,
      brand,
      last4,
      expMonth,
      expYear,
      cardholderName: toTitleCase(cardholderName),
      isDefault,
    })
    .returning();

  res.status(201).json(created);
});

router.delete("/payment-methods/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [existing] = await db
    .select()
    .from(paymentMethodsTable)
    .where(and(eq(paymentMethodsTable.id, id), eq(paymentMethodsTable.userId, req.user!.userId)));
  if (!existing) {
    res.status(404).json({ error: "Payment method not found" });
    return;
  }
  await db.delete(paymentMethodsTable).where(eq(paymentMethodsTable.id, id));

  if (existing.isDefault) {
    const [next] = await db
      .select()
      .from(paymentMethodsTable)
      .where(eq(paymentMethodsTable.userId, req.user!.userId))
      .orderBy(sql`${paymentMethodsTable.createdAt} desc`)
      .limit(1);
    if (next) {
      await db
        .update(paymentMethodsTable)
        .set({ isDefault: true })
        .where(eq(paymentMethodsTable.id, next.id));
    }
  }
  res.json({ ok: true });
});

router.patch("/payment-methods/:id/default", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [existing] = await db
    .select()
    .from(paymentMethodsTable)
    .where(and(eq(paymentMethodsTable.id, id), eq(paymentMethodsTable.userId, req.user!.userId)));
  if (!existing) {
    res.status(404).json({ error: "Payment method not found" });
    return;
  }
  await db
    .update(paymentMethodsTable)
    .set({ isDefault: false })
    .where(eq(paymentMethodsTable.userId, req.user!.userId));
  const [updated] = await db
    .update(paymentMethodsTable)
    .set({ isDefault: true })
    .where(eq(paymentMethodsTable.id, id))
    .returning();
  res.json(updated);
});

export default router;
