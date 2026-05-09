import { useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { useTranslation } from "react-i18next";
import {
  useListHotels, getListHotelsQueryKey,
  useListAllBookings, getListAllBookingsQueryKey,
  useListUsers, getListUsersQueryKey,
} from "@/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, CalendarDays, DollarSign, Hotel, BarChart3 } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import HotelsTab from "@/components/admin/HotelsTab";
import RoomsTab from "@/components/admin/RoomsTab";
import BookingsTab from "@/components/admin/BookingsTab";
import UsersTab from "@/components/admin/UsersTab";

export default function Admin() {
  const { formatPrice } = useCurrency();
  const { t, i18n } = useTranslation();
  const lang: "ru" | "en" = i18n.resolvedLanguage === "ru" ? "ru" : "en";

  const { data: hotels } = useListHotels({}, {
    query: { queryKey: getListHotelsQueryKey({}) },
  });
  const { data: bookingsPage } = useListAllBookings({
    query: { queryKey: getListAllBookingsQueryKey() },
  });
  const { data: usersPage } = useListUsers({
    query: { queryKey: getListUsersQueryKey() },
  });

  const bookings: any[] = (bookingsPage as any)?.data ?? (Array.isArray(bookingsPage) ? bookingsPage : []);
  const users: any[] = (usersPage as any)?.data ?? (Array.isArray(usersPage) ? usersPage : []);
  const totalUsersCount: number = (usersPage as any)?.total ?? users.length;

  const totalRevenue = useMemo(() =>
    bookings.reduce((acc: number, b: any) =>
      b.status === "confirmed" ? acc + b.totalPrice : acc, 0
    ), [bookings]);

  const pendingCount = useMemo(() =>
    bookings.filter((b: any) => b.status === "pending").length,
    [bookings]);

  const confirmedCount = useMemo(() =>
    bookings.filter((b: any) => b.status === "confirmed").length,
    [bookings]);

  return (
    <Layout>
      <div className="bg-secondary/30 border-b py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">{t("admin.title")}</h1>
              <p className="text-muted-foreground mt-0.5">{t("admin.subtitle")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t("admin.totalRevenue")}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(totalRevenue, { decimals: 0 })}</div>
              <p className="text-xs text-muted-foreground mt-1">{t("admin.fromConfirmed")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t("admin.activeHotels")}</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hotels?.length ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">{lang === "ru" ? "На платформе" : "On platform"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t("admin.totalBookings")}</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {lang === "ru" ? `${pendingCount} ожидает · ${confirmedCount} подтверждено` : `${pendingCount} pending · ${confirmedCount} confirmed`}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t("admin.registeredUsers")}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsersCount}</div>
              <p className="text-xs text-muted-foreground mt-1">{lang === "ru" ? "Зарегистрированных" : "Registered"}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="hotels" className="w-full">
          <TabsList className="flex flex-wrap h-auto gap-1 bg-muted p-1 w-full sm:w-auto sm:inline-flex">
            <TabsTrigger value="hotels" className="gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              {lang === "ru" ? "Отели" : "Hotels"}
            </TabsTrigger>
            <TabsTrigger value="rooms" className="gap-1.5">
              <Hotel className="h-3.5 w-3.5" />
              {lang === "ru" ? "Номера" : "Rooms"}
            </TabsTrigger>
            <TabsTrigger value="bookings" className="gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {lang === "ru" ? "Бронирования" : "Bookings"}
              {pendingCount > 0 && (
                <span className="ml-1 bg-amber-500 text-white text-xs rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {lang === "ru" ? "Пользователи" : "Users"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hotels" className="mt-6">
            <HotelsTab lang={lang} />
          </TabsContent>

          <TabsContent value="rooms" className="mt-6">
            <RoomsTab lang={lang} />
          </TabsContent>

          <TabsContent value="bookings" className="mt-6">
            <BookingsTab lang={lang} />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <UsersTab lang={lang} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
