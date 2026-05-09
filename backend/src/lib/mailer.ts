import { BrevoClient } from "@getbrevo/brevo";
import { logger } from "./logger";

const BREVO_API_KEY = process.env.BREVO_API_KEY;

const brevoClient = new BrevoClient({ apiKey: BREVO_API_KEY || "" });

const CURRENCY_SYMBOLS: Record<string, { symbol: string; position: "before" | "after"; decimals: number }> = {
  USD: { symbol: "$", position: "before", decimals: 2 },
  EUR: { symbol: "€", position: "before", decimals: 2 },
  GBP: { symbol: "£", position: "before", decimals: 2 },
  JPY: { symbol: "¥", position: "before", decimals: 0 },
  CNY: { symbol: "¥", position: "before", decimals: 2 },
  RUB: { symbol: "₽", position: "after", decimals: 2 },
  KZT: { symbol: "₸", position: "after", decimals: 2 },
  UAH: { symbol: "₴", position: "after", decimals: 2 },
  BYN: { symbol: "Br", position: "after", decimals: 2 },
  INR: { symbol: "₹", position: "before", decimals: 2 },
  BRL: { symbol: "R$", position: "before", decimals: 2 },
  AUD: { symbol: "A$", position: "before", decimals: 2 },
  CAD: { symbol: "C$", position: "before", decimals: 2 },
  CHF: { symbol: "CHF", position: "before", decimals: 2 },
  KRW: { symbol: "₩", position: "before", decimals: 0 },
  AED: { symbol: "د.إ", position: "before", decimals: 2 },
  TRY: { symbol: "₺", position: "before", decimals: 2 },
  MXN: { symbol: "MX$", position: "before", decimals: 2 },
  SEK: { symbol: "kr", position: "after", decimals: 2 },
  NOK: { symbol: "kr", position: "after", decimals: 2 },
  PLN: { symbol: "zł", position: "after", decimals: 2 },
  SGD: { symbol: "S$", position: "before", decimals: 2 },
  HKD: { symbol: "HK$", position: "before", decimals: 2 },
  NZD: { symbol: "NZ$", position: "before", decimals: 2 },
  THB: { symbol: "฿", position: "before", decimals: 2 },
  IDR: { symbol: "Rp", position: "before", decimals: 0 },
  SAR: { symbol: "﷼", position: "before", decimals: 2 },
  ILS: { symbol: "₪", position: "before", decimals: 2 },
  QAR: { symbol: "QR", position: "before", decimals: 2 },
};

const EXCHANGE_RATES: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, JPY: 155, CNY: 7.25, RUB: 92, KZT: 470, UAH: 41,
  BYN: 3.27, INR: 83.5, BRL: 5.05, AUD: 1.52, CAD: 1.36, CHF: 0.88, KRW: 1370,
  AED: 3.67, TRY: 32.5, MXN: 17.2, SEK: 10.6, NOK: 10.8, PLN: 3.97,
  SGD: 1.35, HKD: 7.82, NZD: 1.66, THB: 36.5, IDR: 16100, SAR: 3.75, ILS: 3.72,
  QAR: 3.64,
};

function formatCurrency(usdAmount: number, currencyCode: string, exchangeRate?: number | null): string {
  const code = currencyCode || "USD";
  const meta = CURRENCY_SYMBOLS[code] ?? CURRENCY_SYMBOLS["USD"];
  const rate = (exchangeRate && exchangeRate > 0) ? exchangeRate : (EXCHANGE_RATES[code] ?? 1);
  const value = usdAmount * rate;
  const formatted = value.toFixed(meta.decimals);
  return meta.position === "before"
    ? `${meta.symbol}${formatted}`
    : `${formatted} ${meta.symbol}`;
}

function formatBookingRef(id: number): string {
  return `SL-${new Date().getFullYear()}-${String(id).padStart(5, "0")}`;
}

export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  if (!BREVO_API_KEY) {
    logger.warn({ to: opts.to }, "BREVO_API_KEY not set — email not sent");
    return;
  }
  try {
    const response = await brevoClient.transactionalEmails.sendTransacEmail({
      sender: { email: "selorabooking@gmail.com", name: "Selora Hotels" },
      to: [{ email: opts.to }],
      subject: opts.subject,
      htmlContent: opts.html,
    });
    logger.info({ 
      to: opts.to, 
      subject: opts.subject,
      messageId: response.messageId 
    }, "Email sent successfully via Brevo");
  } catch (err) {
    logger.error({ err, to: opts.to, subject: opts.subject }, "Failed to send email via Brevo");
    throw err;
  }
}

export function checkMailerConfig(): { configured: boolean; message: string } {
  if (!BREVO_API_KEY) {
    return {
      configured: false,
      message: "BREVO_API_KEY environment variable is not set. Email notifications will NOT work."
    };
  }
  return {
    configured: true,
    message: "Brevo mailer is configured and ready."
  };
}

function baseTemplate(title: string, body: string): string {
  return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#c97a2a 0%,#e8943a 100%);padding:32px 40px;text-align:center;">
              <div style="font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">🏨 Selora</div>
              <div style="font-size:13px;color:rgba(255,255,255,0.85);margin-top:4px;letter-spacing:1px;text-transform:uppercase;">Hotel Booking Platform</div>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9f8f6;border-top:1px solid #ede9e3;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;color:#888;">© 2026 Selora Hotels. All rights reserved.</p>
              <p style="margin:0;font-size:12px;color:#aaa;">Это письмо отправлено автоматически, не отвечайте на него.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function h1(text: string): string {
  return `<h1 style="margin:0 0 12px;font-size:24px;font-weight:700;color:#1a1a1a;line-height:1.3;">${text}</h1>`;
}

function p(text: string): string {
  return `<p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.7;">${text}</p>`;
}

function divider(): string {
  return `<hr style="border:none;border-top:1px solid #ede9e3;margin:28px 0;" />`;
}

function infoRow(label: string, value: string): string {
  return `
  <tr>
    <td style="padding:10px 0;font-size:14px;color:#888;border-bottom:1px solid #f0ece6;white-space:nowrap;padding-right:24px;">${label}</td>
    <td style="padding:10px 0;font-size:14px;color:#1a1a1a;border-bottom:1px solid #f0ece6;font-weight:600;">${value}</td>
  </tr>`;
}

function infoTable(rows: Array<[string, string]>): string {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
    ${rows.map(([l, v]) => infoRow(l, v)).join("")}
  </table>`;
}

function badge(text: string, color: string): string {
  return `<span style="display:inline-block;padding:4px 14px;border-radius:20px;font-size:13px;font-weight:600;background:${color};color:#fff;">${text}</span>`;
}

export function emailWelcome(name: string): { subject: string; html: string } {
  return {
    subject: "Добро пожаловать в Selora! 🏨",
    html: baseTemplate(
      "Добро пожаловать в Selora",
      `
      ${h1("Добро пожаловать, " + name + "! 👋")}
      ${p("Мы рады, что вы присоединились к Selora — платформе для бронирования лучших отелей по всему миру.")}
      ${p("Теперь вам доступны:")}
      <ul style="margin:0 0 20px;padding-left:20px;color:#444;font-size:15px;line-height:2;">
        <li>Поиск и бронирование отелей в 11 городах мира</li>
        <li>Сравнение номеров и цен</li>
        <li>Личный кабинет с историей бронирований</li>
        <li>Избранное и персональные рекомендации</li>
      </ul>
      ${divider()}
      ${p("Начните поиск идеального отеля прямо сейчас!")}
      `,
    ),
  };
}

export function emailLogin(name: string, time: string): { subject: string; html: string } {
  return {
    subject: "Вход в аккаунт Selora",
    html: baseTemplate(
      "Вход в аккаунт",
      `
      ${h1("Выполнен вход в ваш аккаунт")}
      ${p("Здравствуйте, <strong>" + name + "</strong>! Мы зафиксировали вход в ваш аккаунт Selora.")}
      ${infoTable([
        ["Время входа", time],
        ["Аккаунт", name],
      ])}
      ${divider()}
      ${p("Если это были не вы — немедленно смените пароль и свяжитесь с нашей поддержкой.")}
      `,
    ),
  };
}

export function emailBookingCreated(opts: {
  name: string;
  bookingId: number;
  hotelName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  currency?: string;
  exchangeRate?: number | null;
}): { subject: string; html: string } {
  const ref = formatBookingRef(opts.bookingId);
  return {
    subject: `Бронирование ${ref} создано — ${opts.hotelName}`,
    html: baseTemplate(
      "Бронирование создано",
      `
      ${h1("Бронирование создано ✅")}
      ${p("Здравствуйте, <strong>" + opts.name + "</strong>! Ваше бронирование успешно создано и ожидает оплаты.")}
      ${badge("Статус: Ожидает оплаты", "#f59e0b")}
      ${infoTable([
        ["Номер брони", ref],
        ["Отель", opts.hotelName],
        ["Номер", opts.roomName],
        ["Дата заезда", opts.checkIn],
        ["Дата выезда", opts.checkOut],
        ["Ночей", String(opts.nights)],
        ["Итого", formatCurrency(opts.totalPrice, opts.currency ?? "USD", opts.exchangeRate)],
      ])}
      ${divider()}
      ${p("Для подтверждения бронирования, пожалуйста, перейдите к оплате в личном кабинете.")}
      `,
    ),
  };
}

export function emailBookingPaid(opts: {
  name: string;
  bookingId: number;
  hotelName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  currency?: string;
  exchangeRate?: number | null;
}): { subject: string; html: string } {
  const ref = formatBookingRef(opts.bookingId);
  return {
    subject: `Оплата получена — ${opts.hotelName} (${ref})`,
    html: baseTemplate(
      "Оплата получена",
      `
      ${h1("Оплата прошла успешно! 💳")}
      ${p("Здравствуйте, <strong>" + opts.name + "</strong>! Ваш платёж получен. Бронирование передано администратору для подтверждения.")}
      ${badge("Статус: Ожидает подтверждения", "#f59e0b")}
      ${infoTable([
        ["Номер брони", ref],
        ["Отель", opts.hotelName],
        ["Номер", opts.roomName],
        ["Дата заезда", opts.checkIn],
        ["Дата выезда", opts.checkOut],
        ["Ночей", String(opts.nights)],
        ["Оплачено", formatCurrency(opts.totalPrice, opts.currency ?? "USD", opts.exchangeRate)],
      ])}
      ${divider()}
      ${p("Как только администратор подтвердит бронирование, вы получите ещё одно письмо. Обычно это занимает не более нескольких часов.")}
      `,
    ),
  };
}

export function emailBookingConfirmed(opts: {
  name: string;
  bookingId: number;
  hotelName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  currency?: string;
  exchangeRate?: number | null;
}): { subject: string; html: string } {
  const ref = formatBookingRef(opts.bookingId);
  return {
    subject: `Бронирование ${ref} подтверждено — ${opts.hotelName} 🎉`,
    html: baseTemplate(
      "Бронирование подтверждено",
      `
      ${h1("Бронирование подтверждено! 🎉")}
      ${p("Здравствуйте, <strong>" + opts.name + "</strong>! Ваш платёж прошёл успешно. Ждём вас!")}
      ${badge("Статус: Подтверждено", "#22c55e")}
      ${infoTable([
        ["Номер брони", ref],
        ["Отель", opts.hotelName],
        ["Номер", opts.roomName],
        ["Дата заезда", opts.checkIn],
        ["Дата выезда", opts.checkOut],
        ["Ночей", String(opts.nights)],
        ["Оплачено", formatCurrency(opts.totalPrice, opts.currency ?? "USD", opts.exchangeRate)],
      ])}
      ${divider()}
      ${p("Сохраните это письмо — номер брони может понадобиться при заезде. Приятного путешествия! ✈️")}
      `,
    ),
  };
}

export function emailBookingCancelled(opts: {
  name: string;
  bookingId: number;
  hotelName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  currency?: string;
  exchangeRate?: number | null;
}): { subject: string; html: string } {
  const ref = formatBookingRef(opts.bookingId);
  return {
    subject: `Бронирование ${ref} отменено`,
    html: baseTemplate(
      "Бронирование отменено",
      `
      ${h1("Бронирование отменено")}
      ${p("Здравствуйте, <strong>" + opts.name + "</strong>. Ваше бронирование было отменено.")}
      ${badge("Статус: Отменено", "#ef4444")}
      ${infoTable([
        ["Номер брони", ref],
        ["Отель", opts.hotelName],
        ["Номер", opts.roomName],
        ["Дата заезда", opts.checkIn],
        ["Дата выезда", opts.checkOut],
        ["Ночей", String(opts.nights)],
        ["Итого", formatCurrency(opts.totalPrice, opts.currency ?? "USD", opts.exchangeRate)],
      ])}
      ${divider()}
      ${p("Если вы отменили бронирование по ошибке — создайте новое на нашем сайте. Будем рады видеть вас снова!")}
      `,
    ),
  };
}

export function emailContactReceived(opts: {
  adminEmail: string;
  fromName: string;
  fromEmail: string;
  topic: string;
  bookingRef: string;
  message: string;
}): { subject: string; html: string } {
  return {
    subject: `[Selora] Новое сообщение от ${opts.fromName} — ${opts.topic || "Без темы"}`,
    html: baseTemplate(
      "Новое сообщение",
      `
      ${h1("Новое сообщение через форму обратной связи")}
      ${infoTable([
        ["Имя", opts.fromName],
        ["Email", opts.fromEmail],
        ["Тема", opts.topic || "Не указана"],
        ["Номер брони", opts.bookingRef || "Не указан"],
      ])}
      ${divider()}
      <div style="background:#f9f8f6;border-left:4px solid #c97a2a;border-radius:4px;padding:16px 20px;margin:0 0 16px;">
        <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Текст сообщения</p>
        <p style="margin:0;font-size:15px;color:#1a1a1a;line-height:1.7;white-space:pre-wrap;">${opts.message}</p>
      </div>
      `,
    ),
  };
}

export function emailContactConfirm(opts: {
  name: string;
  topic: string;
}): { subject: string; html: string } {
  return {
    subject: "Мы получили ваше сообщение — Selora",
    html: baseTemplate(
      "Сообщение получено",
      `
      ${h1("Спасибо за обращение, " + opts.name + "!")}
      ${p("Мы получили ваше сообщение по теме <strong>«" + (opts.topic || "Общий вопрос") + "»</strong> и рассмотрим его в ближайшее время.")}
      ${p("Обычное время ответа — <strong>до 4 часов</strong> в рабочие дни.")}
      ${divider()}
      ${p("Пока вы ждёте, загляните в наш <a href=\"https://selora.app/help-center\" style=\"color:#c97a2a;\">центр помощи</a> — возможно, ответ уже там!")}
      `,
    ),
  };
}

export function emailNewsletterSubscribed(email: string): { subject: string; html: string } {
  return {
    subject: "Вы подписались на рассылку Selora 📬",
    html: baseTemplate(
      "Подписка оформлена",
      `
      ${h1("Подписка оформлена! 📬")}
      ${p("Вы успешно подписались на новостную рассылку Selora.")}
      ${p("Что вас ожидает в рассылке:")}
      <ul style="margin:0 0 20px;padding-left:20px;color:#444;font-size:15px;line-height:2;">
        <li>Эксклюзивные предложения и скидки на отели</li>
        <li>Советы по путешествиям от наших экспертов</li>
        <li>Обзоры лучших отелей мира</li>
        <li>Новости платформы и специальные акции</li>
      </ul>
      ${divider()}
      ${p("Если вы не хотите получать рассылку — просто проигнорируйте это письмо или свяжитесь с нами.")}
      `,
    ),
  };
}

export function emailNewsletterNotify(email: string): { subject: string; html: string } {
  return {
    subject: `[Selora] Новый подписчик рассылки: ${email}`,
    html: baseTemplate(
      "Новый подписчик",
      `
      ${h1("Новый подписчик рассылки")}
      ${infoTable([
        ["Email подписчика", email],
        ["Дата", new Date().toLocaleString("ru-RU")],
      ])}
      `,
    ),
  };
}
