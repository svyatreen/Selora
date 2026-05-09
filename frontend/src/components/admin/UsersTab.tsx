import { useState, useEffect } from "react";
import { customFetch } from "@/api/custom-fetch";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { ru as ruLocale } from "date-fns/locale";
import { toast } from "sonner";
import { ShieldCheck, User } from "lucide-react";

const PAGE_SIZE = 11;

export default function UsersTab({ lang }: { lang: "ru" | "en" }) {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const dateLocale = lang === "ru" ? ruLocale : undefined;
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPage(1); }, [debouncedSearch, roleFilter]);

  const usersQueryKey = ["admin-users", page, PAGE_SIZE, debouncedSearch, roleFilter];
  const { data: usersPage, isLoading } = useQuery<{ data: any[]; total: number; page: number; totalPages: number }>({
    queryKey: usersQueryKey,
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (roleFilter !== "all") params.set("role", roleFilter);
      return customFetch(`/api/admin/users?${params}`);
    },
    staleTime: 15_000,
    placeholderData: (prev) => prev,
  });

  const paged = usersPage?.data ?? [];
  const totalPages = usersPage?.totalPages ?? 1;
  const totalCount = usersPage?.total ?? 0;

  async function handleRoleChange(userId: number, newRole: string) {
    if (currentUser?.id === userId) {
      toast.error(lang === "ru" ? "Нельзя изменить свою роль" : "Cannot change your own role");
      return;
    }
    setUpdatingUserId(userId);
    try {
      await customFetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole }),
        headers: { "Content-Type": "application/json" },
      });
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(lang === "ru" ? "Роль обновлена" : "Role updated");
    } catch (e: any) {
      toast.error(e?.message || (lang === "ru" ? "Ошибка обновления" : "Update failed"));
    } finally {
      setUpdatingUserId(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{lang === "ru" ? "Пользователи" : "Users"}</CardTitle>
          <CardDescription>{lang === "ru" ? "Управление пользователями и их ролями." : "Manage users and their roles."}</CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Input
            placeholder={lang === "ru" ? "Поиск по имени или email..." : "Search by name or email..."}
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="max-w-sm"
          />
          <Select value={roleFilter} onValueChange={v => { setRoleFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{lang === "ru" ? "Все роли" : "All roles"}</SelectItem>
              <SelectItem value="USER">{lang === "ru" ? "Пользователи" : "Users"}</SelectItem>
              <SelectItem value="ADMIN">{lang === "ru" ? "Администраторы" : "Admins"}</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground self-center">{lang === "ru" ? `Всего: ${totalCount}` : `Total: ${totalCount}`}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{lang === "ru" ? "Пользователь" : "User"}</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>{lang === "ru" ? "Роль" : "Role"}</TableHead>
                <TableHead>{lang === "ru" ? "Дата регистрации" : "Joined"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">{lang === "ru" ? "Загрузка..." : "Loading..."}</TableCell></TableRow>
              ) : paged.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">{lang === "ru" ? "Нет пользователей" : "No users"}</TableCell></TableRow>
              ) : paged.map((u: any) => {
                const isSelf = currentUser?.id === u.id;
                return (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          {u.role === "ADMIN"
                            ? <ShieldCheck className="h-4 w-4 text-primary" />
                            : <User className="h-4 w-4 text-muted-foreground" />}
                        </div>
                        <div>
                          <div className="font-medium">{u.name}</div>
                          {isSelf && <Badge variant="outline" className="text-xs mt-0.5">{lang === "ru" ? "Вы" : "You"}</Badge>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <Select
                        value={u.role}
                        disabled={isSelf || updatingUserId === u.id}
                        onValueChange={v => handleRoleChange(u.id, v)}
                      >
                        <SelectTrigger className="h-8 w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER">USER</SelectItem>
                          <SelectItem value="ADMIN">ADMIN</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(u.createdAt), "d MMM yyyy", { locale: dateLocale })}
                    </TableCell>
                  </TableRow>
                );
              })}
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
  );
}
