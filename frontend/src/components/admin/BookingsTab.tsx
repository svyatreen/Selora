import { useState, useEffect } from "react";
import { customFetch } from "@/api/custom-fetch";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { format } from "date-fns";
import { ru as ruLocale } from "date-fns/locale";
import { toast } from "sonner";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLocation } from "wouter";

const PAGE_SIZE = 15;

function formatBookingRef(id: number) {
  return `SL-${new Date().getFullYear()}-${String(id).padStart(5, "0")}`;
}

const ROOM_TYPE_LABELS: Record<string, { ru: string; en: string }> = {
  single: { ru: "Одноместный", en: "Single" },
  double: { ru: "Двухместный", en: "Double" },
  deluxe: { ru: "Делюкс", en: "Deluxe" },
  suite: { ru: "Люкс", en: "Suite" },
};

export default function BookingsTab({ lang }: { lang: "ru" | "en" }) {
  const { formatPrice } = useCurrency();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const dateLocale = lang === "ru" ? ruLocale : undefined;

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [actionDialog, setActionDialog] = useState<{ open: boolean; type: "confirm" | "cancel"; booking: any | null }>({ open: false, type: "confirm", booking: null });
  const [acting, setActing] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter]);

  const bookingsQueryKey = ["admin-bookings", page, PAGE_SIZE, debouncedSearch, statusFilter];
  const { data: bookingsPage, isLoading } = useQuery<{ data: any[]; total: number; page: number; totalPages: number }>({
    queryKey: bookingsQueryKey,
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (statusFilter !== "all") params.set("status", statusFilter);
      return customFetch(`/api/bookings?${params}`);
    },
    staleTime: 15_000,
    placeholderData: (prev) => prev,
  });

  const paged = bookingsPage?.data ?? [];
  const totalPages = bookingsPage?.totalPages ?? 1;
  const totalCount = bookingsPage?.total ?? 0;

  function statusBadge(status: string) {
    if (status === "verified") return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">{lang === "ru" ? "Подтверждено" : "Confirmed"}</Badge>;
    if (status === "confirmed") return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800">{lang === "ru" ? "Оплачено" : "Paid"}</Badge>;
    if (status === "cancelled") return <Badge variant="destructive">{lang === "ru" ? "Отменено" : "Cancelled"}</Badge>;
    return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800">{lang === "ru" ? "Ожидает оплаты" : "Awaiting Payment"}</Badge>;
  }

  async function handleAction() {
    if (!actionDialog.booking) return;
    setActing(true);
    try {
      const endpoint = actionDialog.type === "confirm"
        ? `/api/bookings/${actionDialog.booking.id}/confirm`
        : `/api/bookings/${actionDialog.booking.id}/cancel`;
      await customFetch(endpoint, { method: "POST" });
      await queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      toast.success(actionDialog.type === "confirm"
        ? (lang === "ru" ? "Бронирование подтверждено" : "Booking confirmed")
        : (lang === "ru" ? "Бронирование отменено" : "Booking cancelled"));
      setActionDialog({ open: false, type: "confirm", booking: null });
    } catch (e: any) {
      toast.error(e?.message || (lang === "ru" ? "Ошибка" : "Error"));
    } finally {
      setActing(false);
    }
  }

  const roomLabel = (room: any) => {
    if (!room) return "—";
    const t = ROOM_TYPE_LABELS[room.type];
    return t ? (lang === "ru" ? t.ru : t.en) : room.type;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div>
            <CardTitle>{lang === "ru" ? "Все бронирования" : "All Bookings"}</CardTitle>
            <CardDescription>{lang === "ru" ? "Управление и мониторинг бронирований платформы." : "Monitor and manage platform reservations."}</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Input
              placeholder={lang === "ru" ? "Поиск по гостю, отелю, номеру брони..." : "Search by guest, hotel, booking ref..."}
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{lang === "ru" ? "Все статусы" : "All statuses"}</SelectItem>
                <SelectItem value="pending">{lang === "ru" ? "Ожидает оплаты" : "Awaiting Payment"}</SelectItem>
                <SelectItem value="confirmed">{lang === "ru" ? "Оплачено" : "Paid"}</SelectItem>
                <SelectItem value="verified">{lang === "ru" ? "Подтверждено" : "Confirmed"}</SelectItem>
                <SelectItem value="cancelled">{lang === "ru" ? "Отменено" : "Cancelled"}</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground self-center">{lang === "ru" ? `Найдено: ${totalCount}` : `Found: ${totalCount}`}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{lang === "ru" ? "Номер брони" : "Booking Ref"}</TableHead>
                  <TableHead>{lang === "ru" ? "Гость" : "Guest"}</TableHead>
                  <TableHead>{lang === "ru" ? "Отель / Номер" : "Hotel / Room"}</TableHead>
                  <TableHead>{lang === "ru" ? "Даты" : "Dates"}</TableHead>
                  <TableHead>{lang === "ru" ? "Сумма" : "Amount"}</TableHead>
                  <TableHead>{lang === "ru" ? "Статус" : "Status"}</TableHead>
                  <TableHead>{lang === "ru" ? "Действия" : "Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">{lang === "ru" ? "Загрузка..." : "Loading..."}</TableCell></TableRow>
                ) : paged.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">{lang === "ru" ? "Нет бронирований" : "No bookings"}</TableCell></TableRow>
                ) : paged.map((b: any) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-mono text-sm font-medium">{formatBookingRef(b.id)}</TableCell>
                    <TableCell>
                      {b.user ? (
                        <div>
                          <div className="font-medium">{b.user.name}</div>
                          <div className="text-xs text-muted-foreground">{b.user.email}</div>
                        </div>
                      ) : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{b.hotel?.name ?? "—"}</div>
                        <div className="text-xs text-muted-foreground">{roomLabel(b.room)}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {format(new Date(b.checkIn), "d MMM", { locale: dateLocale })} — {format(new Date(b.checkOut), "d MMM yyyy", { locale: dateLocale })}
                    </TableCell>
                    <TableCell className="font-semibold whitespace-nowrap">{formatPrice(b.totalPrice)}</TableCell>
                    <TableCell>{statusBadge(b.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" title={lang === "ru" ? "Открыть" : "View"} onClick={() => setLocation(`/hotels/${b.hotel?.id}/rooms/${b.room?.id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {b.status === "confirmed" && (
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950" title={lang === "ru" ? "Подтвердить" : "Confirm"} onClick={() => setActionDialog({ open: true, type: "confirm", booking: b })}>
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {b.status !== "cancelled" && (
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10" title={lang === "ru" ? "Отменить" : "Cancel"} onClick={() => setActionDialog({ open: true, type: "cancel", booking: b })}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between gap-3">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                {lang === "ru" ? "Назад" : "Previous"}
              </Button>
              <span className="text-sm text-muted-foreground">
                {lang === "ru" ? `Страница ${page} из ${totalPages}` : `Page ${page} of ${totalPages}`}
              </span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                {lang === "ru" ? "Далее" : "Next"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={actionDialog.open} onOpenChange={open => !open && setActionDialog({ open: false, type: "confirm", booking: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.type === "confirm"
                ? (lang === "ru" ? "Подтвердить бронирование?" : "Confirm booking?")
                : (lang === "ru" ? "Отменить бронирование?" : "Cancel booking?")}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.booking && (
                lang === "ru"
                  ? `${formatBookingRef(actionDialog.booking.id)} — ${actionDialog.booking.user?.name ?? "—"}, ${actionDialog.booking.hotel?.name ?? "—"}`
                  : `${formatBookingRef(actionDialog.booking.id)} — ${actionDialog.booking.user?.name ?? "—"}, ${actionDialog.booking.hotel?.name ?? "—"}`
              )}
              {actionDialog.type === "confirm" && lang === "ru" && <><br /><span className="text-sm">Гость получит письмо с подтверждением.</span></>}
              {actionDialog.type === "confirm" && lang === "en" && <><br /><span className="text-sm">The guest will receive a confirmation email.</span></>}
              {actionDialog.type === "cancel" && lang === "ru" && <><br /><span className="text-sm">Гость получит письмо об отмене.</span></>}
              {actionDialog.type === "cancel" && lang === "en" && <><br /><span className="text-sm">The guest will receive a cancellation email.</span></>}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog({ open: false, type: "confirm", booking: null })}>{lang === "ru" ? "Отмена" : "Cancel"}</Button>
            <Button
              variant={actionDialog.type === "cancel" ? "destructive" : "default"}
              onClick={handleAction}
              disabled={acting}
            >
              {acting
                ? (lang === "ru" ? "Обработка..." : "Processing...")
                : actionDialog.type === "confirm"
                  ? (lang === "ru" ? "Подтвердить" : "Confirm")
                  : (lang === "ru" ? "Отменить бронь" : "Cancel booking")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
