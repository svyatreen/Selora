# Selora — Платформа для бронирования отелей

Современная веб-платформа для бронирования отелей с полной функциональностью для пользователей и администраторов.

---

## 1. О проекте

**Selora** — современная веб-платформа для бронирования отелей. Пользователи могут искать отели, просматривать номера, читать отзывы, добавлять отели в избранное и оформлять бронирования с онлайн-оплатой. Администраторы получают доступ к панели управления с полной статистикой и управлением контентом.

### Ключевые возможности

- 🔍 **Поиск и фильтрация** отелей по городам, цене, рейтингу, удобствам
- 🏨 **Детальные страницы** отелей с фото, описанием, картой, отзывами
- 🛏️ **Просмотр номеров** с тарифами, удобствами, доступностью
- ❤️ **Избранное** — сохранение понравившихся отелей
- 📅 **Бронирование** с выбором дат и дополнительных услуг
- 💳 **Онлайн-оплата** через Stripe
- ⭐ **Отзывы и рейтинги** от пользователей
- 👁️ **Недавно просмотренные** отели
- 🌙 **Тёмная/светлая тема** оформления
- 🌐 **Мультиязычность** (русский/английский)
- 💱 **Мультивалютность** (RUB/USD/EUR)
- 👤 **Личный кабинет** с историей бронирований
- 🛡️ **Админ-панель** для управления отелями, номерами, бронированиями и пользователями
- 📧 **Контактная форма** для связи с поддержкой

---

## 2. Технологический стек

### 2.1 Инфраструктура

| Технология | Версия | Назначение |
| ---------- | ------ | ---------- |
| **TypeScript** | 5.9 | Строгая типизация всего кода |
| **pnpm** | latest | Менеджер пакетов, монорепозиторий |
| **ES Modules** | — | Формат модулей |

### 2.2 Бэкенд (`backend/`)

| Технология | Версия | Назначение |
| ---------- | ------ | ---------- |
| **Node.js** | 20+ | Runtime среда |
| **Express** | 5 | HTTP API сервер |
| **PostgreSQL** | 16 | Реляционная база данных |
| **Drizzle ORM** | 0.45 | ORM для работы с БД |
| **JWT** | 9 | Аутентификация |
| **bcryptjs** | 3 | Хеширование паролей |
| **Zod** | 3.25 | Валидация данных |
| **Pino** | 9 | Логирование |
| **esbuild** | 0.27 | Сборка для продакшена |
| **Stripe** | 22 | Платёжная система |
| **Nodemailer** | 8 | Отправка email |

### 2.3 Фронтенд (`frontend/`)

| Технология | Версия | Назначение |
| ---------- | ------ | ---------- |
| **React** | 19.1 | UI библиотека |
| **Vite** | 7.3 | Сборка и дев-сервер |
| **Tailwind CSS** | 4.1 | Стилизация |
| **Radix UI** | latest | Доступные UI-компоненты |
| **TanStack Query** | 5.90 | Управление серверным состоянием |
| **Wouter** | 3.3 | Маршрутизация |
| **React Hook Form** | 7.55 | Работа с формами |
| **Framer Motion** | 12 | Анимации |
| **Recharts** | 2.15 | Графики и диаграммы |
| **MapLibre GL** | 5.24 | Интерактивные карты |
| **i18next** | 26 | Интернационализация |
| **Lucide React** | 0.545 | Иконки |
| **date-fns** | 3.6 | Работа с датами |
| **Sonner** | 2.0 | Toast-уведомления |
| **Stripe.js** | 9 | Клиентская часть оплаты |

---

## 3. Структура проекта

```
Booking/
├── frontend/                 # React SPA приложение
│   ├── src/
│   │   ├── pages/           # Страницы приложения
│   │   ├── components/      # UI компоненты
│   │   │   ├── layout/      # Layout, Navbar, Footer
│   │   │   ├── admin/       # Компоненты админ-панели
│   │   │   ├── hotel/       # Компоненты отелей
│   │   │   ├── room/        # Компоненты номеров
│   │   │   ├── maps/        # Компоненты карт
│   │   │   └── ui/          # Базовые UI компоненты
│   │   ├── api/             # API клиент (сгенерирован)
│   │   ├── hooks/           # Кастомные хуки
│   │   ├── lib/             # Утилиты
│   │   ├── i18n/            # Переводы (ru/en)
│   │   ├── contexts/        # React контексты
│   │   └── main.tsx        # Точка входа
│   ├── public/              # Статические файлы
│   └── vite.config.ts       # Конфигурация Vite
│
├── backend/                  # Express API сервер
│   ├── src/
│   │   ├── routes/          # API маршруты
│   │   ├── db/              # Схема БД и подключения
│   │   │   └── schema/      # Drizzle схемы таблиц
│   │   ├── middlewares/     # Express middleware
│   │   ├── lib/             # Утилиты (auth, logger, stripe, mailer)
│   │   ├── data/           # Данные для сидинга
│   │   └── zod/             # Zod схемы (сгенерированы)
│   ├── drizzle.config.ts    # Конфиг Drizzle
│   └── build.mjs            # Скрипт сборки
│
├── package.json              # Корневой package.json
├── pnpm-workspace.yaml       # Конфигурация workspace
├── tsconfig.base.json        # Общие настройки TypeScript
```

---

## 4. API маршруты

### Аутентификация и пользователи

| Метод | Путь | Описание |
| ----- | ---- | -------- |
| POST | `/api/auth/register` | Регистрация пользователя |
| POST | `/api/auth/login` | Вход в систему |
| GET | `/api/users/me` | Профиль текущего пользователя |
| PATCH | `/api/users/me` | Обновление профиля |
| GET | `/api/users/me/bookings` | Бронирования пользователя |

### Отели

| Метод | Путь | Описание |
| ----- | ---- | -------- |
| GET | `/api/hotels` | Список отелей с фильтрами |
| GET | `/api/hotels/stats` | Статистика по отелям |
| GET | `/api/hotels/:id` | Детали отеля |
| GET | `/api/hotels/:id/similar` | Похожие отели |
| GET | `/api/hotels/:hotelId/rooms` | Номера отеля |
| POST | `/api/admin/hotels` | Создание отеля (админ) |
| PATCH | `/api/admin/hotels/:id` | Обновление отеля (админ) |
| DELETE | `/api/admin/hotels/:id` | Удаление отеля (админ) |

### Номера

| Метод | Путь | Описание |
| ----- | ---- | -------- |
| GET | `/api/rooms/:id` | Детали номера |
| POST | `/api/admin/rooms` | Создание номера (админ) |
| PATCH | `/api/admin/rooms/:id` | Обновление номера (админ) |
| DELETE | `/api/admin/rooms/:id` | Удаление номера (админ) |

### Бронирования

| Метод | Путь | Описание |
| ----- | ---- | -------- |
| POST | `/api/bookings` | Создание бронирования |
| GET | `/api/bookings/:id` | Детали бронирования |
| PATCH | `/api/bookings/:id/cancel` | Отмена бронирования |
| PATCH | `/api/bookings/:id/pay` | Оплата бронирования |
| GET | `/api/admin/bookings` | Все бронирования (админ) |

### Отзывы

| Метод | Путь | Описание |
| ----- | ---- | -------- |
| GET | `/api/hotels/:hotelId/reviews` | Отзывы отеля |
| POST | `/api/reviews` | Создание отзыва |
| PATCH | `/api/reviews/:id` | Обновление отзыва |
| DELETE | `/api/reviews/:id` | Удаление отзыва |

### Избранное

| Метод | Путь | Описание |
| ----- | ---- | -------- |
| GET | `/api/favorites` | Список избранного |
| POST | `/api/favorites/:hotelId` | Добавить в избранное |
| DELETE | `/api/favorites/:hotelId` | Удалить из избранного |

### Недавно просмотренные

| Метод | Путь | Описание |
| ----- | ---- | -------- |
| GET | `/api/recently-viewed` | Список недавно просмотренных |

### Дополнения к бронированию

| Метод | Путь | Описание |
| ----- | ---- | -------- |
| GET | `/api/booking-addons` | Список доступных дополнений |

### Методы оплаты

| Метод | Путь | Описание |
| ----- | ---- | -------- |
| GET | `/api/payment-methods` | Список методов оплаты |

### Контактная форма

| Метод | Путь | Описание |
| ----- | ---- | -------- |
| POST | `/api/contact` | Отправка сообщения в поддержку |

### Администрирование

| Метод | Путь | Описание |
| ----- | ---- | -------- |
| GET | `/api/admin/users` | Список пользователей |
| PATCH | `/api/admin/users/:id` | Обновление пользователя |

### Здоровье сервера

| Метод | Путь | Описание |
| ----- | ---- | -------- |
| GET | `/api/health` | Статус сервера |

---

## 5. Страницы фронтенда

| Путь | Страница | Защита |
| ---- | -------- | ------ |
| `/` | Главная страница | — |
| `/about` | О компании | — |
| `/press` | Пресс-центр | — |
| `/blog` | Блог | — |
| `/careers` | Вакансии | — |
| `/help-center` | Центр помощи | — |
| `/contact` | Контакты | — |
| `/hotels` | Каталог отелей | — |
| `/hotels/:id` | Карточка отеля | — |
| `/hotels/:hotelId/rooms/:roomId` | Карточка номера | — |
| `/login` | Вход | — |
| `/register` | Регистрация | — |
| `/favorites` | Избранное | ✅ |
| `/compare` | Сравнение отелей | — |
| `/profile` | Личный кабинет | ✅ |
| `/booking/:id` | Детали бронирования | ✅ |
| `/admin` | Админ-панель | ✅ Admin |
| `/privacy-policy` | Политика конфиденциальности | — |
| `/terms-of-service` | Условия использования | — |
| `/cookie-policy` | Политика cookies | — |
| `/cancellation-policy` | Политика отмены | — |
| `/safety` | Безопасность | — |
| `/accessibility` | Доступность | — |

---

## 6. Модель данных

### Пользователи (users)
- `email` (unique), `password`, `name`, `phone`
- `role`: `USER` | `ADMIN`
- `created_at`

### Отели (hotels)
- `name`, `description`, `city`, `address`
- `rating`, `stars`
- `images[]`, `amenities[]`
- `coordinates` (lat, lng)
- `checkInTime`, `checkOutTime`

### Номера (rooms)
- `hotelId` (FK)
- `type`: `single` | `double` | `deluxe` | `suite`
- `price`, `guests`, `description`
- `images[]`, `amenities[]`
- `viewType`: `sea` | `city` | `garden` | `courtyard`

### Бронирования (bookings)
- `userId`, `roomId` (FK)
- `checkIn`, `checkOut`
- `totalPrice`, `status`
- `status`: `pending` | `confirmed` | `cancelled` | `paid`

### Отзывы (reviews)
- `userId`, `hotelId` (FK)
- `rating`, `comment`
- `created_at`

### Избранное (favorites)
- `userId`, `hotelId` (FK)
- `created_at`

### Недавно просмотренные (recently_viewed)
- `userId`, `hotelId` (FK)
- `viewed_at`

### Методы оплаты (payment_methods)
- `userId`, `stripePaymentMethodId`
- `last4`, `brand`, `expiryMonth`, `expiryYear`

### Дополнения к бронированию (booking_addons)
- `name`, `description`, `price`
- `isActive`

---

## 7. Запуск проекта

### Требования
- Node.js 20+
- PostgreSQL 16+
- pnpm

### Установка

```bash
# Клонирование репозитория
git clone <repo-url>
cd Booking

# Установка зависимостей
pnpm install

# Настройка переменных окружения
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Переменные окружения

#### Backend (`backend/.env`)
```env
DATABASE_URL=postgresql...
STRIPE_SECRET_KEY=sk_test_...
```

#### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8080
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Запуск в development

```bash
# Бэкенд
cd backend
pnpm db:push    # Применение схемы БД
pnpm dev         # Запуск сервера на :8080

# Фронтенд (в другом терминале)
cd frontend
pnpm dev         # Запуск на :5173
```

### Сборка для production

```bash
# Из корня проекта
pnpm build

# Или отдельно
cd backend && pnpm build
cd frontend && pnpm build
```
