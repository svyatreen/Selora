import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import usersRouter from "./users";
import hotelsRouter from "./hotels";
import roomsRouter from "./rooms";
import bookingsRouter from "./bookings";
import reviewsRouter from "./reviews";
import favoritesRouter from "./favorites";
import recentlyViewedRouter from "./recently-viewed";
import paymentMethodsRouter from "./payment-methods";
import bookingAddonsRouter from "./booking-addons";
import contactRouter from "./contact";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(hotelsRouter);
router.use(roomsRouter);
router.use(bookingsRouter);
router.use(reviewsRouter);
router.use(favoritesRouter);
router.use(recentlyViewedRouter);
router.use(paymentMethodsRouter);
router.use(bookingAddonsRouter);
router.use(contactRouter);

export default router;
