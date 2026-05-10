import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ru as ruLocale } from "date-fns/locale";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import {
  useGetMyBookings,
  getGetMyBookingsQueryKey,
  useUpdateMe,
  getGetMeQueryKey,
  useCancelBooking,
} from "@/api";
import { customFetch } from "@/api/custom-fetch";
import {
  usePaymentMethods,
  useCreatePaymentMethod,
  useDeletePaymentMethod,
  useSetDefaultPaymentMethod,
  toTitleCase,
  type PaymentMethod,
} from "@/api/payment-methods";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  MapPin,
  Calendar,
  Building2,
  User,
  Mail,
  Shield,
  Camera,
  Phone,
  Lock,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  DollarSign,
  Compass,
  CalendarCheck,
  CreditCard,
  Star,
  Plus,
  X,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { buildCardColorMap } from "@/lib/card-colors";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const MAX_AVATAR_SIZE = 256;
const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

async function resizeImageFile(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  return new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const size = Math.min(img.width, img.height);
      const sx = (img.width - size) / 2;
      const sy = (img.height - size) / 2;
      const canvas = document.createElement("canvas");
      canvas.width = MAX_AVATAR_SIZE;
      canvas.height = MAX_AVATAR_SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context unavailable"));
        return;
      }
      ctx.drawImage(img, sx, sy, size, size, 0, 0, MAX_AVATAR_SIZE, MAX_AVATAR_SIZE);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

interface UserStats {
  totalBookings: number;
  totalSpent: number;
  citiesCount: number;
}

export default function Profile() {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.resolvedLanguage === "ru" ? ruLocale : undefined;
  const { user, logout } = useAuth();
  const { formatPrice } = useCurrency();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [bio, setBio] = useState(user?.bio || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwSubmitting, setPwSubmitting] = useState(false);

  const [deletePassword, setDeletePassword] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cancelBookingId, setCancelBookingId] = useState<number | null>(null);
  const cancelBooking = useCancelBooking();

  const handleCancelBooking = (id: number) => {
    cancelBooking.mutate(
      { id },
      {
        onSuccess: () => {
          toast.success(t("booking.cancelSuccess"));
          queryClient.invalidateQueries({ queryKey: getGetMyBookingsQueryKey() });
          setCancelBookingId(null);
        },
        onError: (error: any) => {
          toast.error(error?.data?.error || error?.message || t("booking.cancelFailed"));
          setCancelBookingId(null);
        },
      },
    );
  };

  const updateMe = useUpdateMe();

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setBio(user.bio || "");
    }
  }, [user]);

  const { data: bookings, isLoading } = useGetMyBookings({
    query: { queryKey: getGetMyBookingsQueryKey() },
  });

  const { data: stats } = useQuery<UserStats>({
    queryKey: ["users", "me", "stats"],
    queryFn: async () => {
      return await customFetch<UserStats>("/api/users/me/stats", { method: "GET" });
    },
    enabled: !!user,
  });
  const totalSpentWithFees = Number(stats?.totalSpent ?? 0) * 1.1;

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updates: {
      name?: string;
      email?: string;
      phone?: string | null;
      bio?: string | null;
    } = {};
    if (name !== user?.name) updates.name = name;
    if (email !== user?.email) updates.email = email;
    if ((phone || "") !== (user?.phone || "")) updates.phone = phone || null;
    if ((bio || "") !== (user?.bio || "")) updates.bio = bio || null;

    if (Object.keys(updates).length === 0) {
      toast.info(t("profile.personal.noChanges"));
      return;
    }

    updateMe.mutate(
      { data: updates },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
          toast.success(t("profile.personal.saved"));
        },
        onError: (err: any) => {
          const msg = err?.payload?.error || err?.message || t("profile.personal.saveFailed");
          toast.error(msg);
        },
      }
    );
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error(t("profile.avatar.imageOnly"));
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      toast.error(t("profile.avatar.tooLarge"));
      return;
    }
    setAvatarUploading(true);
    try {
      const dataUrl = await resizeImageFile(file);
      await new Promise<void>((resolve, reject) => {
        updateMe.mutate(
          { data: { avatarUrl: dataUrl } },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
              toast.success(t("profile.avatar.updated"));
              resolve();
            },
            onError: (err: any) => {
              const msg = err?.payload?.error || err?.message || t("profile.avatar.uploadFailed");
              toast.error(msg);
              reject(err);
            },
          }
        );
      });
    } catch {
      // toast already handled
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleRemoveAvatar = () => {
    updateMe.mutate(
      { data: { avatarUrl: null } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
          toast.success(t("profile.avatar.removed"));
        },
        onError: () => toast.error(t("profile.avatar.removeFailed")),
      }
    );
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error(t("profile.password.tooShort"));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t("profile.password.noMatch"));
      return;
    }
    if (currentPassword === newPassword) {
      toast.error(t("profile.password.sameAsOld"));
      return;
    }
    setPwSubmitting(true);
    try {
      await customFetch("/api/users/me/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      toast.success(t("profile.password.changed"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPwSubmitting(false);
      logout();
      navigate("/login");
      return;
    } catch (err: any) {
      const msg =
        err?.data?.error ||
        err?.payload?.error ||
        err?.message ||
        t("profile.password.failed");
      toast.error(msg);
      setPwSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error(t("profile.delete.needPassword"));
      return;
    }
    setDeleteSubmitting(true);
    try {
      await customFetch("/api/users/me", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword }),
      });
      toast.success(t("profile.delete.deleted"));
      setDeleteOpen(false);
      setTimeout(() => {
        logout();
        navigate("/");
      }, 500);
    } catch (err: any) {
      const msg = err?.payload?.error || err?.message || t("profile.delete.failed");
      toast.error(msg);
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-white/95 backdrop-blur-sm text-emerald-700 border-emerald-300 shadow-sm";
      case "confirmed":
        return "bg-white/95 backdrop-blur-sm text-blue-700 border-blue-300 shadow-sm";
      case "pending":
        return "bg-white/95 backdrop-blur-sm text-amber-700 border-amber-300 shadow-sm";
      case "cancelled":
        return "bg-white/95 backdrop-blur-sm text-red-700 border-red-300 shadow-sm";
      default:
        return "bg-white/95 backdrop-blur-sm text-foreground shadow-sm";
    }
  };

  return (
    <Layout>
      <div className="bg-secondary/30 py-12 border-b">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative group">
              <Avatar
                key={user?.avatarUrl || "no-avatar-hero"}
                className="h-28 w-28 border-4 border-background shadow-lg"
              >
                {user?.avatarUrl ? (
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                ) : null}
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-serif font-bold">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading}
                className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:scale-105 transition-transform disabled:opacity-60"
                aria-label={t("profile.avatar.change")}
              >
                {avatarUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
                {t("profile.greeting", { name: user?.name })}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email}</span>
                </div>
                {user?.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user?.role === "ADMIN" && (
                  <Badge variant="outline" className="border-primary/50 text-primary">
                    <Shield className="h-3 w-3 mr-1" />
                    {t("profile.adminBadge")}
                  </Badge>
                )}
              </div>
              {user?.bio && (
                <p className="mt-3 text-sm text-muted-foreground max-w-xl">
                  {user.bio}
                </p>
              )}
              <div className="mt-5 grid grid-cols-3 gap-3 max-w-md mx-auto md:mx-0">
                <div className="bg-background rounded-lg p-3 border text-center">
                  <CalendarCheck className="h-4 w-4 text-primary mx-auto mb-1" />
                  <div className="text-xl font-bold">{stats?.totalBookings ?? 0}</div>
                  <div className="text-xs text-muted-foreground">{t("profile.stat.bookings")}</div>
                </div>
                <div className="bg-background rounded-lg p-3 border text-center">
                  <DollarSign className="h-4 w-4 text-primary mx-auto mb-1" />
                  <div className="text-xl font-bold">{formatPrice(totalSpentWithFees, { decimals: 0 })}</div>
                  <div className="text-xs text-muted-foreground">{t("profile.stat.spent")}</div>
                </div>
                <div className="bg-background rounded-lg p-3 border text-center">
                  <Compass className="h-4 w-4 text-primary mx-auto mb-1" />
                  <div className="text-xl font-bold">{stats?.citiesCount ?? 0}</div>
                  <div className="text-xs text-muted-foreground">{t("profile.stat.cities")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
            <TabsTrigger value="bookings">{t("profile.tabs.bookings")}</TabsTrigger>
            <TabsTrigger value="settings">{t("profile.tabs.settings")}</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="h-40"></CardContent>
                  </Card>
                ))}
              </div>
            ) : bookings?.length ? (
              <div className="space-y-6">
                {bookings.map((booking) => (
                  <Card
                    key={booking.id}
                    className="overflow-hidden border-border/50 transition-all hover:shadow-md"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-64 h-48 shrink-0 relative">
                        {booking.hotel?.images?.[0] && (
                          <img
                            src={booking.hotel.images[0]}
                            alt={booking.hotel?.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <Badge
                          className={`absolute top-3 left-3 ${getStatusColor(booking.status)} capitalize`}
                        >
                          {t(`booking.status.${booking.status}`, { defaultValue: booking.status })}
                        </Badge>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-serif text-xl font-bold mb-1">
                              <Link
                                href={`/hotels/${booking.hotel?.id}`}
                                className="hover:text-primary transition-colors"
                              >
                                {booking.hotel?.name}
                              </Link>
                            </h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="mr-1 h-3.5 w-3.5" />
                              {booking.hotel?.city}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {formatPrice(Number(booking.totalPrice) * 1.1)}
                            </div>
                            <div className="text-sm text-muted-foreground capitalize">
                              {t("profile.bookings.roomTypeLine", { type: t(`room.type.${booking.room?.type}`, { defaultValue: booking.room?.type ?? "" }) })}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6 bg-secondary/30 p-4 rounded-lg">
                          <div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                              {t("profile.bookings.checkIn")}
                            </div>
                            <div className="font-medium flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              {format(new Date(booking.checkIn), "MMM dd, yyyy", { locale: dateLocale })}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                              {t("profile.bookings.checkOut")}
                            </div>
                            <div className="font-medium flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              {format(new Date(booking.checkOut), "MMM dd, yyyy", { locale: dateLocale })}
                            </div>
                          </div>
                        </div>

                        <div className="mt-auto flex justify-between items-center pt-4 border-t border-border/50">
                          <span className="text-sm text-muted-foreground">
                            {t("profile.bookings.bookedAgo", {
                              ago: formatDistanceToNow(new Date(booking.createdAt), {
                                addSuffix: true,
                                locale: dateLocale,
                              }),
                            })}
                          </span>
                          <div className="flex items-center gap-2">
                            {booking.status === "pending" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCancelBookingId(booking.id)}
                                disabled={cancelBooking.isPending && cancelBookingId === booking.id}
                              >
                                {t("booking.cancelReservation")}
                              </Button>
                            )}
                            <Button
                              variant={booking.status === "pending" ? "default" : "outline"}
                              asChild
                            >
                              <Link href={`/booking/${booking.id}`}>
                                {booking.status === "pending"
                                  ? t("profile.bookings.completePayment")
                                  : t("profile.bookings.viewDetails")}
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-secondary/20 rounded-2xl border border-dashed border-border">
                <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t("profile.bookings.noneTitle")}</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  {t("profile.bookings.noneBody")}
                </p>
                <Button asChild>
                  <Link href="/hotels">{t("profile.bookings.findHotel")}</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <AlertDialog open={cancelBookingId !== null} onOpenChange={(open) => { if (!open) setCancelBookingId(null); }}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("booking.cancelDialog.title")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("booking.pendingCancelNote")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={cancelBooking.isPending}>{t("booking.cancelDialog.keep")}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    if (cancelBookingId !== null) handleCancelBooking(cancelBookingId);
                  }}
                  disabled={cancelBooking.isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {cancelBooking.isPending ? t("booking.cancelling") : t("booking.cancelDialog.confirm")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("profile.avatar.title")}</CardTitle>
                <CardDescription>
                  {t("profile.avatar.subtitle")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <Avatar
                    key={user?.avatarUrl || "no-avatar-card"}
                    className="h-20 w-20"
                  >
                    {user?.avatarUrl ? (
                      <AvatarImage src={user.avatarUrl} alt={user?.name} />
                    ) : null}
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-serif font-bold">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={avatarUploading}
                    >
                      {avatarUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("profile.avatar.uploading")}
                        </>
                      ) : (
                        <>
                          <Camera className="mr-2 h-4 w-4" /> {t("profile.avatar.upload")}
                        </>
                      )}
                    </Button>
                    {user?.avatarUrl && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRemoveAvatar}
                        disabled={updateMe.isPending}
                      >
                        {t("profile.avatar.remove")}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("profile.personal.title")}</CardTitle>
                <CardDescription>
                  {t("profile.personal.subtitle")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t("profile.personal.fullName")}</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10"
                          placeholder={t("profile.personal.fullNamePlaceholder")}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t("profile.personal.email")}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          placeholder={t("profile.personal.emailPlaceholder")}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="phone">{t("profile.personal.phone")}</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-10"
                          placeholder={t("profile.personal.phonePlaceholder")}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bio">{t("profile.personal.bio")}</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        maxLength={500}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder={t("profile.personal.bioPlaceholder")}
                        rows={4}
                      />
                      <div className="text-xs text-muted-foreground text-right">
                        {bio.length}/500
                      </div>
                    </div>
                  </div>
                  <Button type="submit" disabled={updateMe.isPending}>
                    {updateMe.isPending ? t("profile.personal.saving") : t("profile.personal.save")}
                  </Button>
                </form>
              </CardContent>
            </Card>


            <PaymentMethodsCard />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" /> {t("profile.password.title")}
                </CardTitle>
                <CardDescription>
                  {t("profile.password.subtitle")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">{t("profile.password.current")}</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrent ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="pr-10"
                        placeholder={t("profile.password.currentPlaceholder")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrent((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">{t("profile.password.new")}</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNew ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pr-10"
                        placeholder={t("profile.password.newPlaceholder")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t("profile.password.confirm")}</Label>
                    <Input
                      id="confirmPassword"
                      type={showNew ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t("profile.password.confirmPlaceholder")}
                    />
                  </div>
                  <Button type="submit" disabled={pwSubmitting}>
                    {pwSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("profile.password.updating")}
                      </>
                    ) : (
                      t("profile.password.update")
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-destructive/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Trash2 className="h-5 w-5" /> {t("profile.delete.title")}
                </CardTitle>
                <CardDescription>
                  {t("profile.delete.subtitle")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Separator className="mb-4" />
                <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> {t("profile.delete.button")}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t("profile.delete.dialogTitle")}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("profile.delete.dialogBody")}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-2 py-2">
                      <Label htmlFor="deletePassword">{t("profile.delete.passwordLabel")}</Label>
                      <Input
                        id="deletePassword"
                        type="password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        placeholder={t("profile.delete.passwordPlaceholder")}
                      />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => {
                          setDeletePassword("");
                        }}
                      >
                        {t("profile.delete.cancel")}
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteAccount();
                        }}
                        disabled={deleteSubmitting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {deleteSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("profile.delete.deleting")}
                          </>
                        ) : (
                          t("profile.delete.confirm")
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

function AddCardForm({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const createCard = useCreatePaymentMethod();
  const [saving, setSaving] = useState(false);

  const cardOptions: Record<string, unknown> = {
    style: {
      base: {
        fontSize: "15px",
        color: theme === "dark" ? "#e5e5e5" : "#1a1a1a",
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        backgroundColor: "transparent",
        "::placeholder": { color: theme === "dark" ? "#6b7280" : "#a0a0a0" },
        iconColor: theme === "dark" ? "#e8943a" : "#c97a2a",
      },
      invalid: { color: theme === "dark" ? "#f87171" : "#ef4444" },
    },
    hidePostalCode: true,
    disableLink: true,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSaving(true);
    try {
      const cardEl = elements.getElement(CardElement);
      if (!cardEl) throw new Error("Card element missing");
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardEl,
      });
      if (error) throw new Error(error.message);
      if (!paymentMethod?.card) throw new Error("Could not read card details");
      const { brand, last4, exp_month, exp_year } = paymentMethod.card;
      await new Promise<void>((resolve, reject) => {
        createCard.mutate(
          {
            brand: brand.charAt(0).toUpperCase() + brand.slice(1),
            last4,
            expMonth: exp_month,
            expYear: exp_year,
            cardholderName: "",
          },
          {
            onSuccess: () => { toast.success(t("profile.payments.added")); resolve(); onDone(); },
            onError: (err: any) => reject(new Error(err?.data?.error || err?.message || t("profile.payments.addFailed"))),
          }
        );
      });
    } catch (err: any) {
      toast.error(err.message || t("profile.payments.addFailed"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>{t("profile.payments.cardDetails", { defaultValue: "Card Details" })}</Label>
        <div className="rounded-lg border border-border bg-background px-4 py-3.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
          <CardElement options={cardOptions} />
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Lock className="h-3 w-3 shrink-0" />
        <span>{t("booking.stripeSecure")}</span>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
          {t("profile.payments.cancel")}
        </Button>
        <Button type="submit" disabled={saving || !stripe}>
          {saving ? t("profile.payments.saving") : t("profile.payments.save")}
        </Button>
      </div>
    </form>
  );
}

function PaymentMethodsCard() {
  const { t, i18n } = useTranslation();
  const { data: cards = [], isLoading } = usePaymentMethods(true);
  const cardColorMap = buildCardColorMap(cards);
  const deleteCard = useDeletePaymentMethod();
  const setDefault = useSetDefaultPaymentMethod();

  const [showAdd, setShowAdd] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<PaymentMethod | null>(null);

  const confirmDelete = () => {
    if (!cardToDelete) return;
    deleteCard.mutate(cardToDelete.id, {
      onSuccess: () => {
        toast.success(t("profile.payments.removed"));
        setCardToDelete(null);
      },
      onError: (err: any) => {
        toast.error(err?.data?.error || err?.message || t("profile.payments.removeFailed"));
        setCardToDelete(null);
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" /> {t("profile.payments.title")}
        </CardTitle>
        <CardDescription>
          {t("profile.payments.subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="h-20 bg-muted animate-pulse rounded-lg" />
        ) : cards.length === 0 ? (
          <div className="text-sm text-muted-foreground border border-dashed rounded-lg p-6 text-center">
            {t("profile.payments.none")}
          </div>
        ) : (
          <div className="space-y-2">
            {cards.map((card) => (
              <div
                key={card.id}
                className="flex items-center gap-4 border rounded-lg p-3"
              >
                <div className={`h-10 w-14 rounded-md text-[10px] font-bold flex items-center justify-center shadow-sm ${cardColorMap[card.id]}`}>
                  {card.brand.toUpperCase().slice(0, 4)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold flex items-center gap-2">
                    <span>{card.brand} •••• {card.last4}</span>
                    {card.isDefault && (
                      <Badge variant="outline" className="border-primary/50 text-primary text-xs">
                        <Star className="h-3 w-3 mr-1 fill-current" /> {t("profile.payments.default")}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    Exp {String(card.expMonth).padStart(2, "0")}/{String(card.expYear).slice(-2)}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!card.isDefault && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setDefault.mutate(card.id, {
                        onSuccess: () => toast.success(t("profile.payments.defaultUpdated")),
                        onError: () => toast.error(t("profile.payments.setDefaultFailed")),
                      })}
                      disabled={setDefault.isPending}
                    >
                      {t("profile.payments.setDefault")}
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setCardToDelete(card)}
                    disabled={deleteCard.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showAdd ? (
          <div className="space-y-4 border rounded-lg p-4 bg-secondary/20">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{t("profile.payments.addTitle")}</h4>
              <Button type="button" variant="ghost" size="icon" onClick={() => setShowAdd(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Elements stripe={stripePromise} options={{ locale: (i18n.language === 'ru' ? 'ru' : 'en') as any, disableLink: true } as Record<string, unknown>}>
              <AddCardForm onDone={() => setShowAdd(false)} onCancel={() => setShowAdd(false)} />
            </Elements>
          </div>
        ) : (
          <Button type="button" variant="outline" onClick={() => setShowAdd(true)}>
            <Plus className="mr-2 h-4 w-4" /> {t("profile.payments.addNew")}
          </Button>
        )}
      </CardContent>

      <AlertDialog open={!!cardToDelete} onOpenChange={(open) => !open && setCardToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("profile.payments.removeTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {cardToDelete && t("profile.payments.removeBody", { brand: cardToDelete.brand, last4: cardToDelete.last4 })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteCard.isPending}>{t("profile.payments.keep")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={deleteCard.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteCard.isPending ? t("profile.payments.removing") : t("profile.payments.yesRemove")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
