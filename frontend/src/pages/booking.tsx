import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { ru as ruLocale } from "date-fns/locale";
import { Layout } from "@/components/layout/Layout";

import { useGetBooking, getGetBookingQueryKey, useCancelBooking } from "@/api";
import { usePaymentMethods } from "@/api/payment-methods";
import { buildCardColorMap } from "@/lib/card-colors";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CreditCard, CalendarDays, MapPin, CheckCircle2, AlertCircle,
  Users, Plus, Check, ShieldCheck, Lock,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import { useTheme } from "@/contexts/ThemeContext";
import { customFetch } from "@/api/custom-fetch";

function formatBookingRef(id: number): string {
  return `SL-${new Date().getFullYear()}-${String(id).padStart(5, "0")}`;
}

const NEW_CARD = "__new__";

function getToken() {
  return localStorage.getItem("token") ?? sessionStorage.getItem("token") ?? "";
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  return customFetch<T>(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> | undefined),
    },
  });
}

interface PaymentIntentResult {
  clientSecret: string;
  paymentIntentId: string;
}

const CARD_ELEMENT_STYLE_LIGHT = {
  style: {
    base: {
      fontSize: "15px",
      color: "#1a1a1a",
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      "::placeholder": { color: "#a0a0a0" },
      iconColor: "#c97a2a",
    },
    invalid: { color: "#ef4444", iconColor: "#ef4444" },
  },
  hidePostalCode: true,
  disableLink: true,
};

const CARD_ELEMENT_STYLE_DARK = {
  style: {
    base: {
      fontSize: "15px",
      color: "#e5e5e5",
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      backgroundColor: "transparent",
      "::placeholder": { color: "#6b7280" },
      iconColor: "#e8943a",
    },
    invalid: { color: "#f87171", iconColor: "#f87171" },
  },
  hidePostalCode: true,
  disableLink: true,
};

function StripePaymentForm({
  bookingId,
  grandTotal,
  savedCards,
  cardColorMap,
  onSuccess,
}: {
  bookingId: number;
  grandTotal: number;
  savedCards: any[];
  cardColorMap: Record<number, string>;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { t, i18n } = useTranslation();
  const { formatPrice } = useCurrency();
  const { theme } = useTheme();

  const defaultCard = savedCards.find((c) => c.isDefault) ?? savedCards[0];
  const [selectedCardId, setSelectedCardId] = useState<string>(
    defaultCard ? String(defaultCard.id) : NEW_CARD
  );
  const [saveCard, setSaveCard] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [piLoading, setPiLoading] = useState(false);
  const [piError, setPiError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  const isNewCard = selectedCardId === NEW_CARD;

  const fetchPaymentIntent = useCallback(async () => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    setPiLoading(true);
    setPiError(null);
    try {
      const data = await apiFetch<PaymentIntentResult>(
        `/api/bookings/${bookingId}/create-payment-intent`,
        { method: "POST" }
      );
      setClientSecret(data.clientSecret);
    } catch (err: any) {
      setPiError(err.message || t("booking.paymentFailed"));
      fetchedRef.current = false;
    } finally {
      setPiLoading(false);
    }
  }, [bookingId, t]);

  useEffect(() => {
    fetchPaymentIntent();
  }, [fetchPaymentIntent]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    try {
      if (!isNewCard) {
        await apiFetch(`/api/bookings/${bookingId}/pay`, {
          method: "POST",
          body: JSON.stringify({ savedCardId: parseInt(selectedCardId, 10) }),
        });
        onSuccess();
        return;
      }

      if (!stripe || !elements) throw new Error("Stripe not ready");
      if (!clientSecret) throw new Error("Payment not initialized. Please wait.");

      const cardEl = elements.getElement(CardElement);
      if (!cardEl) throw new Error("Card element not found");

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardEl },
      });

      if (error) throw new Error(error.message || t("booking.paymentFailed"));
      if (paymentIntent?.status !== "succeeded")
        throw new Error(`Payment status: ${paymentIntent?.status}`);

      await apiFetch(`/api/bookings/${bookingId}/pay`, {
        method: "POST",
        body: JSON.stringify({ paymentIntentId: paymentIntent.id, saveCard }),
      });

      onSuccess();
    } catch (err: any) {
      toast.error(err.message || t("booking.paymentFailed"));
    } finally {
      setProcessing(false);
    }
  };

  const isDark = theme === "dark";
  const cardOptions = isDark ? CARD_ELEMENT_STYLE_DARK : CARD_ELEMENT_STYLE_LIGHT;

  return (
    <form onSubmit={handlePay} className="space-y-4">
      {savedCards.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">{t("booking.choosePayment")}</p>
          <div className="space-y-2">
            {savedCards.map((card) => {
              const isSel = selectedCardId === String(card.id);
              return (
                <button
                  type="button"
                  key={card.id}
                  onClick={() => setSelectedCardId(String(card.id))}
                  className={`w-full text-left rounded-lg border p-3 flex items-center gap-3 transition-all ${
                    isSel
                      ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <div
                    className={`h-9 w-12 rounded-md text-[10px] font-bold flex items-center justify-center shadow-sm ${cardColorMap[card.id] ?? "bg-slate-500 text-white"}`}
                  >
                    {card.brand.toUpperCase().slice(0, 4)}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="text-sm font-semibold flex items-center gap-2 whitespace-nowrap">
                      <span>{card.brand} •••• {card.last4}</span>
                      {card.isDefault && (
                        <span className="text-[11px] font-semibold text-primary">
                          {t("booking.default")}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      Exp {String(card.expMonth).padStart(2, "0")}/{String(card.expYear).slice(-2)}
                    </div>
                  </div>
                  {isSel && <Check className="h-4 w-4 text-primary shrink-0" />}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setSelectedCardId(NEW_CARD)}
              className={`w-full text-left rounded-lg border border-dashed p-3 flex items-center gap-3 transition-all ${
                isNewCard
                  ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <div className="h-9 w-12 rounded-md bg-secondary flex items-center justify-center shrink-0">
                <Plus className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 text-sm font-medium">{t("booking.useNewCard")}</div>
              {isNewCard && <Check className="h-4 w-4 text-primary shrink-0" />}
            </button>
          </div>
        </div>
      )}

      {isNewCard && (
        <div className="space-y-3 pt-1">
          {piLoading ? (
            <div className="h-12 rounded-lg bg-muted animate-pulse" />
          ) : piError ? (
            <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
              {piError}{" "}
              <button
                type="button"
                className="underline"
                onClick={() => {
                  fetchedRef.current = false;
                  fetchPaymentIntent();
                }}
              >
                {t("booking.retry", { defaultValue: "Retry" })}
              </button>
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-background px-4 py-3.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
              <CardElement options={cardOptions} />
            </div>
          )}

          <label className="flex items-center gap-2 cursor-pointer text-sm select-none">
            <Checkbox
              checked={saveCard}
              onCheckedChange={(v) => setSaveCard(v === true)}
            />
            <span className="text-muted-foreground">{t("booking.saveCard")}</span>
          </label>
        </div>
      )}

      <div className="flex items-start gap-2 pt-1">
        <ShieldCheck className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t("booking.stripeSecure")}
        </p>
      </div>

      <Button
        type="submit"
        className="w-full h-12 text-base font-semibold"
        disabled={
          processing ||
          (isNewCard && (piLoading || !!piError || !clientSecret))
        }
      >
        {processing ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            {t("booking.processing")}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            {t("booking.pay", { amount: formatPrice(grandTotal) })}
          </span>
        )}
      </Button>
    </form>
  );
}

export default function BookingDetail() {
  const { id } = useParams<{ id: string }>();
  const bookingId = parseInt(id, 10);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { formatPrice } = useCurrency();
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.resolvedLanguage === "ru" ? ruLocale : undefined;

  const [cancelOpen, setCancelOpen] = useState(false);

  const { data: booking, isLoading } = useGetBooking(bookingId, {
    query: { enabled: !!bookingId, queryKey: getGetBookingQueryKey(bookingId) },
  });
  const { data: savedCards = [] } = usePaymentMethods(
    !!booking && booking.status === "pending"
  );
  const cardColorMap = buildCardColorMap(savedCards);
  const cancelBooking = useCancelBooking();

  const handleCancel = () => {
    cancelBooking.mutate(
      { id: bookingId },
      {
        onSuccess: () => {
          toast.success(t("booking.cancelSuccess"));
          queryClient.invalidateQueries({ queryKey: getGetBookingQueryKey(bookingId) });
          setCancelOpen(false);
        },
        onError: (error: any) => {
          toast.error(error?.data?.error || error?.message || t("booking.cancelFailed"));
          setCancelOpen(false);
        },
      }
    );
  };

  const handlePaymentSuccess = () => {
    toast.success(t("booking.paymentSuccess"));
    queryClient.invalidateQueries({ queryKey: getGetBookingQueryKey(bookingId) });
    queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
  };

  const nights = booking
    ? differenceInDays(new Date(booking.checkOut), new Date(booking.checkIn))
    : 0;
  const grandTotal = useMemo(
    () => booking?.totalPrice || 0,
    [booking]
  );

  if (isLoading || !booking) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="animate-pulse space-y-8">
            <div className="h-10 w-1/3 bg-muted rounded" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 h-96 bg-muted rounded-xl" />
              <div className="h-96 bg-muted rounded-xl" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-secondary/30 border-b py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground flex items-center gap-3">
                {t("booking.reference", { ref: formatBookingRef(booking.id) })}
                {booking.status === "confirmed" && (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                )}
                {booking.status === "cancelled" && (
                  <AlertCircle className="h-6 w-6 text-red-500" />
                )}
              </h1>
              <p className="text-muted-foreground mt-1">
                {t("booking.createdOn", {
                  date: format(new Date(booking.createdAt), "MMMM dd, yyyy", {
                    locale: dateLocale,
                  }),
                })}
              </p>
            </div>
            <Badge
              variant="outline"
              className={`text-sm px-4 py-1.5 uppercase tracking-wider font-semibold ${
                booking.status === "verified"
                  ? "bg-green-500/10 text-green-700 border-green-200"
                  : booking.status === "confirmed"
                  ? "bg-blue-500/10 text-blue-700 border-blue-200"
                  : booking.status === "cancelled"
                  ? "bg-red-500/10 text-red-700 border-red-200"
                  : "bg-yellow-500/10 text-yellow-700 border-yellow-200"
              }`}
            >
              {t(`booking.status.${booking.status}`, { defaultValue: booking.status })}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-[1060px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          <div className="space-y-6">
            <Card className="overflow-hidden border-border/50">
              <div className="h-48 md:h-64 relative">
                {booking.hotel?.images?.[0] && (
                  <img
                    src={booking.hotel.images[0]}
                    alt={booking.hotel?.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <h2 className="text-2xl font-serif font-bold mb-1">
                    {booking.hotel?.name}
                  </h2>
                  <div className="flex items-center text-white/90">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span>
                      {booking.hotel?.address}, {booking.hotel?.city}
                    </span>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground uppercase tracking-wider">
                      {t("booking.checkIn")}
                    </span>
                    <p className="font-semibold">
                      {format(new Date(booking.checkIn), "MMM dd, yyyy", {
                        locale: dateLocale,
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">{t("booking.after3pm")}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground uppercase tracking-wider">
                      {t("booking.checkOut")}
                    </span>
                    <p className="font-semibold">
                      {format(new Date(booking.checkOut), "MMM dd, yyyy", {
                        locale: dateLocale,
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">{t("booking.before11am")}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground uppercase tracking-wider">
                      {t("booking.roomType")}
                    </span>
                    <p className="font-semibold">
                      {booking.room?.type
                        ? t(`room.type.${booking.room.type}`, {
                            defaultValue: booking.room.type,
                          })
                        : ""}
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="mr-1 h-3.5 w-3.5" />
                      {t("room.upToGuests", { count: booking.room?.guests || 0 })}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground uppercase tracking-wider">
                      {t("booking.duration")}
                    </span>
                    <p className="font-semibold">
                      {t("booking.nights", { count: nights })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {booking.status === "pending" && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>{t("booking.cancellationPolicy")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-4 py-3 leading-relaxed">
                  {t("booking.pendingCancelNote")}
                </p>
                <p className="mt-3 text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3">
                  {t("booking.autoExpireNote")}
                </p>
              </CardContent>
              <CardFooter className="bg-secondary/30 border-t flex justify-end p-4">
                <Button
                  variant="outline"
                  onClick={() => setCancelOpen(true)}
                  disabled={cancelBooking.isPending}
                >
                  {cancelBooking.isPending
                    ? t("booking.cancelling")
                    : t("booking.cancelReservation")}
                </Button>
              </CardFooter>
            </Card>
            )}

            {(booking.status === "confirmed" || booking.status === "verified") &&
             (booking as any).ratePlan?.refundable !== false && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>{t("booking.cancellationPolicy")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {t("booking.cancellationFull")}
                </p>
                {booking.status === "confirmed" && (
                  <p className="mt-3 text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3">
                    {t("booking.alreadyPaid")}
                  </p>
                )}
              </CardContent>
              <CardFooter className="bg-secondary/30 border-t flex justify-end p-4">
                <Button
                  variant="destructive"
                  onClick={() => setCancelOpen(true)}
                  disabled={cancelBooking.isPending}
                >
                  {cancelBooking.isPending
                    ? t("booking.cancelling")
                    : t("booking.cancelReservation")}
                </Button>
              </CardFooter>
            </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="border-border/50 bg-secondary/10">
              <CardHeader>
                <CardTitle>{t("booking.priceSummary")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const subtotalUsd = grandTotal / 1.1;
                  const taxesUsd = grandTotal - subtotalUsd;
                  return (
                    <>
                      <div className="flex justify-between text-muted-foreground">
                        <span>
                          {t("room.perNights", {
                            count: nights,
                            price: formatPrice(subtotalUsd / Math.max(nights, 1)),
                          })}
                        </span>
                        <span>{formatPrice(subtotalUsd)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>{t("booking.taxesFees")}</span>
                        <span>{formatPrice(taxesUsd)}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-bold text-lg text-foreground">
                        <span>{t("booking.total")}</span>
                        <span className="text-primary">{formatPrice(grandTotal)}</span>
                      </div>
                    </>
                  );
                })()}
              </CardContent>
            </Card>

            {booking.status === "pending" && (
              <Card className="border-primary/20 shadow-md">
                <CardHeader className="bg-primary/5 border-b pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    {t("booking.paymentDetails")}
                  </CardTitle>
                  <CardDescription>{t("booking.paymentSubtitle")}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Elements stripe={stripePromise} options={{ locale: (i18n.language === 'ru' ? 'ru' : 'en') as any, disableLink: true } as Record<string, unknown>}>
                    <StripePaymentForm
                      bookingId={bookingId}
                      grandTotal={grandTotal}
                      savedCards={savedCards}
                      cardColorMap={cardColorMap}
                      onSuccess={handlePaymentSuccess}
                    />
                  </Elements>
                </CardContent>
              </Card>
            )}

            {booking.status === "confirmed" && (
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 rounded-xl p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">{t("booking.completed")}</h3>
                <p className="text-sm opacity-90 mb-4">{t("booking.completedBody")}</p>
                <Button
                  variant="outline"
                  className="w-full bg-white dark:bg-transparent border-amber-200 text-amber-700 dark:text-amber-400 hover:bg-amber-50"
                  asChild
                >
                  <Link href="/profile">{t("booking.viewAllBookings")}</Link>
                </Button>
              </div>
            )}

            {booking.status === "verified" && (
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 rounded-xl p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">{t("booking.verifiedTitle")}</h3>
                <p className="text-sm opacity-90 mb-4">{t("booking.verifiedBody")}</p>
                <Button
                  variant="outline"
                  className="w-full bg-white dark:bg-transparent border-green-200 text-green-700 dark:text-green-400 hover:bg-green-50"
                  asChild
                >
                  <Link href="/profile">{t("booking.viewAllBookings")}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("booking.cancelDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("booking.cancelDialog.body")}
              {booking.status === "confirmed" && t("booking.cancelDialog.refundNote")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelBooking.isPending}>
              {t("booking.cancelDialog.keep")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleCancel();
              }}
              disabled={cancelBooking.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelBooking.isPending
                ? t("booking.cancelling")
                : t("booking.cancelDialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
