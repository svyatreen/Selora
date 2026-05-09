import { useState, useEffect } from "react";
import { Link } from "wouter";
import { customFetch } from "@/api/custom-fetch";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, X, Star } from "lucide-react";
import { toast } from "sonner";
import { useCurrency } from "@/contexts/CurrencyContext";
import { HOTEL_AMENITY_CATEGORIES, HOTEL_AMENITY_LABELS, HOTEL_CATEGORY_LABELS, tCode } from "@/lib/amenity-codes";

const LEGACY_AMENITY_LABELS: Record<string, { ru: string; en: string }> = {
  'WiFi': { ru: 'Wi-Fi', en: 'WiFi' },
  'Gym': { ru: 'Тренажёрный зал', en: 'Gym' },
  'Restaurant': { ru: 'Ресторан', en: 'Restaurant' },
  'Bar': { ru: 'Бар', en: 'Bar' },
  'Concierge': { ru: 'Консьерж', en: 'Concierge' },
  'Parking': { ru: 'Парковка', en: 'Parking' },
  'Elevator': { ru: 'Лифт', en: 'Elevator' },
  'Wheelchair Access': { ru: 'Доступность для МГН', en: 'Wheelchair Access' },
  'Air Conditioning': { ru: 'Кондиционер', en: 'Air Conditioning' },
  'Non-Smoking': { ru: 'Для некурящих', en: 'Non-Smoking' },
  'Pool': { ru: 'Бассейн', en: 'Pool' },
  'Sea View': { ru: 'Вид на море', en: 'Sea View' },
  'Beach Access': { ru: 'Выход к пляжу', en: 'Beach Access' },
  'Breakfast': { ru: 'Завтрак', en: 'Breakfast' },
  'Half Board': { ru: 'Полупансион', en: 'Half Board' },
  'Full Board': { ru: 'Полный пансион', en: 'Full Board' },
  'Special Diet': { ru: 'Специальная диета', en: 'Special Diet' },
  'Spa': { ru: 'СПА', en: 'Spa' },
  'Room Service': { ru: 'Обслуживание номеров', en: 'Room Service' },
  'Airport Shuttle': { ru: 'Трансфер из аэропорта', en: 'Airport Shuttle' },
  'Pet Friendly': { ru: 'Для животных', en: 'Pet Friendly' },
  'Free Parking': { ru: 'Бесплатная парковка', en: 'Free Parking' },
  'Laundry': { ru: 'Прачечная', en: 'Laundry' },
  'Safe': { ru: 'Сейф', en: 'Safe' },
  'Sauna': { ru: 'Сауна', en: 'Sauna' },
  'Tennis Court': { ru: 'Теннисный корт', en: 'Tennis Court' },
  'Business Center': { ru: 'Бизнес-центр', en: 'Business Center' },
  'Kids Club': { ru: 'Детский клуб', en: 'Kids Club' },
};

function translateAmenity(code: string, lang: 'ru' | 'en'): string {
  return (LEGACY_AMENITY_LABELS[code] ?? HOTEL_AMENITY_LABELS[code])?.[lang] ?? code;
}

const PAGE_SIZE = 11;


type ParkingForm = { available: boolean; price: string; type: string };
type AccessibilityForm = {
  wheelchairAccessible: boolean;
  elevator: boolean;
  adaptedRooms: boolean;
  hearingAssistance: boolean;
};
type PetForm = { allowed: boolean; fee: string; conditions: string };
type ChildForm = { allowed: boolean; freeUnder: string; notes: string };

type HotelForm = {
  name: string;
  stars: string;
  city: string;
  address: string;
  latitude: string;
  longitude: string;
  checkInTime: string;
  checkOutTime: string;
  description_ru: string;
  description_en: string;
  images: string[];
  popularAmenities: string[];
  amenitiesExtended: Record<string, string[]>;
  languages: string[];
  paymentMethods: string[];
  includedInPrice: string[];
  notIncluded: string[];
  parking: ParkingForm;
  accessibility: AccessibilityForm;
  petPolicy: PetForm;
  childPolicy: ChildForm;
};

const emptyParking = (): ParkingForm => ({ available: false, price: "", type: "" });
const emptyAccessibility = (): AccessibilityForm => ({
  wheelchairAccessible: false,
  elevator: false,
  adaptedRooms: false,
  hearingAssistance: false,
});
const emptyPetPolicy = (): PetForm => ({ allowed: false, fee: "", conditions: "" });
const emptyChildPolicy = (): ChildForm => ({ allowed: false, freeUnder: "0", notes: "" });

const emptyForm = (): HotelForm => ({
  name: "", stars: "4", city: "", address: "",
  latitude: "", longitude: "",
  checkInTime: "14:00", checkOutTime: "12:00",
  description_ru: "", description_en: "",
  images: [],
  popularAmenities: [],
  amenitiesExtended: {},
  languages: [],
  paymentMethods: [],
  includedInPrice: [],
  notIncluded: [],
  parking: emptyParking(),
  accessibility: emptyAccessibility(),
  petPolicy: emptyPetPolicy(),
  childPolicy: emptyChildPolicy(),
});

function jsonToParking(v: any): ParkingForm {
  if (!v || typeof v !== "object") return emptyParking();
  return {
    available: v.available ?? false,
    price: v.price != null ? String(v.price) : "",
    type: v.type ?? "",
  };
}
function jsonToAccessibility(v: any): AccessibilityForm {
  if (!v || typeof v !== "object") return emptyAccessibility();
  return {
    wheelchairAccessible: v.wheelchairAccessible ?? false,
    elevator: v.elevator ?? false,
    adaptedRooms: v.adaptedRooms ?? false,
    hearingAssistance: v.hearingAssistance ?? false,
  };
}
function jsonToPetPolicy(v: any): PetForm {
  if (!v || typeof v !== "object") return emptyPetPolicy();
  return { allowed: v.allowed ?? false, fee: v.fee != null ? String(v.fee) : "", conditions: v.conditions ?? "" };
}
function jsonToChildPolicy(v: any): ChildForm {
  if (!v || typeof v !== "object") return emptyChildPolicy();
  return { allowed: v.allowed ?? true, freeUnder: v.freeUnder != null ? String(v.freeUnder) : "12", notes: v.notes ?? "" };
}

function hotelToForm(h: any): HotelForm {
  const allAmenities: string[] = Array.isArray(h.amenities) ? h.amenities : [];
  const ext: Record<string, string[]> = (h.amenitiesExtended && typeof h.amenitiesExtended === "object")
    ? h.amenitiesExtended as Record<string, string[]>
    : {};
  return {
    name: h.name ?? "",
    stars: String(h.stars ?? 4),
    city: h.city ?? "",
    address: h.address ?? "",
    latitude: h.latitude != null ? String(h.latitude) : "",
    longitude: h.longitude != null ? String(h.longitude) : "",
    checkInTime: h.checkInTime ?? "14:00",
    checkOutTime: h.checkOutTime ?? "12:00",
    description_ru: h.description_ru ?? h.description ?? "",
    description_en: h.description_en ?? h.description ?? "",
    images: Array.isArray(h.images) ? h.images : [],
    popularAmenities: allAmenities,
    amenitiesExtended: ext,
    languages: Array.isArray(h.languages) ? h.languages : [],
    paymentMethods: Array.isArray(h.paymentMethods) ? h.paymentMethods : [],
    includedInPrice: Array.isArray(h.includedInPrice) ? h.includedInPrice : [],
    notIncluded: Array.isArray(h.notIncluded) ? h.notIncluded : [],
    parking: jsonToParking(h.parking),
    accessibility: jsonToAccessibility(h.accessibility),
    petPolicy: jsonToPetPolicy(h.petPolicy),
    childPolicy: jsonToChildPolicy(h.childPolicy),
  };
}

export default function HotelsTab({ lang }: { lang: "ru" | "en" }) {
  const { formatPrice } = useCurrency();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; hotel: any | null }>({ open: false, hotel: null });
  const [editingHotel, setEditingHotel] = useState<any | null>(null);
  const [form, setForm] = useState<HotelForm>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageInput, setImageInput] = useState("");
  const [langInput, setLangInput] = useState("");
  const [activeTab, setActiveTab] = useState("basic");
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPage(1); }, [debouncedSearch]);

  const hotelsQueryKey = ["admin-hotels", page, PAGE_SIZE, debouncedSearch];
  const { data: hotelsPage, isLoading } = useQuery<{ data: any[]; total: number; page: number; totalPages: number }>({
    queryKey: hotelsQueryKey,
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
      if (debouncedSearch) params.set("search", debouncedSearch);
      return customFetch(`/api/admin/hotels?${params}`);
    },
    staleTime: 15_000,
    placeholderData: (prev) => prev,
  });

  const paged = hotelsPage?.data ?? [];
  const totalPages = hotelsPage?.totalPages ?? 1;
  const totalCount = hotelsPage?.total ?? 0;

  function openCreate() {
    setEditingHotel(null);
    setForm(emptyForm());
    setImageInput("");
    setLangInput("");
    setActiveTab("basic");
    setFormErrors({});
    setDialogOpen(true);
  }

  function openEdit(hotel: any) {
    setEditingHotel(hotel);
    setForm(hotelToForm(hotel));
    setImageInput("");
    setLangInput("");
    setActiveTab("basic");
    setFormErrors({});
    setDialogOpen(true);
  }

  function setField<K extends keyof HotelForm>(k: K, v: HotelForm[K]) {
    setForm(f => ({ ...f, [k]: v }));
  }
  function setParking<K extends keyof ParkingForm>(k: K, v: ParkingForm[K]) {
    setForm(f => ({ ...f, parking: { ...f.parking, [k]: v } }));
  }
  function setAccess<K extends keyof AccessibilityForm>(k: K, v: AccessibilityForm[K]) {
    setForm(f => ({ ...f, accessibility: { ...f.accessibility, [k]: v } }));
  }
  function setPet<K extends keyof PetForm>(k: K, v: PetForm[K]) {
    setForm(f => ({ ...f, petPolicy: { ...f.petPolicy, [k]: v } }));
  }
  function setChild<K extends keyof ChildForm>(k: K, v: ChildForm[K]) {
    setForm(f => ({ ...f, childPolicy: { ...f.childPolicy, [k]: v } }));
  }

  function addImage() {
    const url = imageInput.trim();
    if (!url) return;
    setField("images", [...form.images, url]);
    setImageInput("");
  }
  function removeImage(i: number) {
    setField("images", form.images.filter((_, idx) => idx !== i));
  }

  function togglePopularAmenity(code: string) {
    setField("popularAmenities", form.popularAmenities.includes(code)
      ? form.popularAmenities.filter(x => x !== code)
      : [...form.popularAmenities, code]);
  }

  function toggleExtendedAmenity(catCode: string, itemCode: string) {
    const current = form.amenitiesExtended[catCode] ?? [];
    const has = current.includes(itemCode);
    setField("amenitiesExtended", {
      ...form.amenitiesExtended,
      [catCode]: has ? current.filter(x => x !== itemCode) : [...current, itemCode],
    });
  }

  function addLang() {
    const l = langInput.trim();
    if (!l || form.languages.includes(l)) return;
    setField("languages", [...form.languages, l]);
    setLangInput("");
  }
  function removeLang(l: string) {
    setField("languages", form.languages.filter(x => x !== l));
  }

  async function handleSave() {
    const errors: Record<string, boolean> = {};
    if (!form.name.trim()) errors.name = true;
    if (!form.city.trim()) errors.city = true;
    if (!form.address.trim()) errors.address = true;
    if (!form.description_ru.trim()) errors.description_ru = true;
    if (!form.description_en.trim()) errors.description_en = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      if (errors.name || errors.city || errors.address) {
        toast.error(lang === "ru" ? "Заполните обязательные поля: название, город, адрес" : "Fill required fields: name, city, address");
        if (errors.name || errors.city || errors.address) setActiveTab("basic");
      } else if (errors.description_ru && errors.description_en) {
        toast.error(lang === "ru" ? "Добавьте описание отеля на русском и английском языках" : "Add hotel description in Russian and English");
        setActiveTab("desc");
      } else if (errors.description_ru) {
        toast.error(lang === "ru" ? "Добавьте описание отеля на русском языке" : "Add hotel description in Russian");
        setActiveTab("desc");
      } else if (errors.description_en) {
        toast.error(lang === "ru" ? "Добавьте описание отеля на английском языке" : "Add hotel description in English");
        setActiveTab("desc");
      }
      return;
    }

    const hasPopular = form.popularAmenities.length > 0;
    const hasExtended = Object.values(form.amenitiesExtended).some(v => v.length > 0);
    if (!hasPopular && !hasExtended) {
      toast.error(lang === "ru" ? "Выберите хотя бы одно удобство" : "Select at least one amenity");
      setActiveTab("amenities");
      return;
    }
    setFormErrors({});
    setSaving(true);
    try {
      const payload: any = {
        name: form.name.trim(),
        stars: parseInt(form.stars),
        city: form.city.trim(),
        address: form.address.trim(),
        description: form.description_ru.trim() || form.description_en.trim(),
        description_ru: form.description_ru.trim() || null,
        description_en: form.description_en.trim() || null,
        checkInTime: form.checkInTime || null,
        checkOutTime: form.checkOutTime || null,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        images: form.images,
        amenities: form.popularAmenities,
        amenitiesExtended: Object.fromEntries(
          Object.entries(form.amenitiesExtended).filter(([, v]) => v.length > 0)
        ),
        languages: form.languages,
        paymentMethods: form.paymentMethods,
        includedInPrice: form.includedInPrice,
        notIncluded: form.notIncluded,
        parking: {
          available: form.parking.available,
          price: form.parking.price ? parseFloat(form.parking.price) : null,
          type: form.parking.type || null,
        },
        accessibility: {
          wheelchairAccessible: form.accessibility.wheelchairAccessible,
          elevator: form.accessibility.elevator,
          adaptedRooms: form.accessibility.adaptedRooms,
          hearingAssistance: form.accessibility.hearingAssistance,
        },
        petPolicy: {
          allowed: form.petPolicy.allowed,
          fee: form.petPolicy.fee ? parseFloat(form.petPolicy.fee) : null,
          conditions: form.petPolicy.conditions || null,
        },
        childPolicy: {
          allowed: form.childPolicy.allowed,
          freeUnder: form.childPolicy.freeUnder ? parseInt(form.childPolicy.freeUnder) : null,
          notes: form.childPolicy.notes || null,
        },
      };
      if (editingHotel) {
        await customFetch(`/api/hotels/${editingHotel.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        });
        toast.success(lang === "ru" ? "Отель обновлён" : "Hotel updated");
      } else {
        await customFetch("/api/hotels", {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        });
        toast.success(lang === "ru" ? "Отель добавлен" : "Hotel created");
      }
      await queryClient.invalidateQueries({ queryKey: ["admin-hotels"] });
      setDialogOpen(false);
    } catch (e: any) {
      toast.error(e?.message || (lang === "ru" ? "Ошибка сохранения" : "Save failed"));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteDialog.hotel) return;
    setDeleting(true);
    try {
      await customFetch(`/api/hotels/${deleteDialog.hotel.id}`, { method: "DELETE" });
      await queryClient.invalidateQueries({ queryKey: ["admin-hotels"] });
      toast.success(lang === "ru" ? "Отель удалён" : "Hotel deleted");
      setDeleteDialog({ open: false, hotel: null });
    } catch (e: any) {
      toast.error(e?.message || (lang === "ru" ? "Ошибка удаления" : "Delete failed"));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle>{lang === "ru" ? "Управление отелями" : "Manage Hotels"}</CardTitle>
              <CardDescription>{lang === "ru" ? "Добавляйте, редактируйте и удаляйте отели платформы." : "Add, edit and delete platform hotels."}</CardDescription>
            </div>
            <Button onClick={openCreate} className="gap-2 shrink-0">
              <Plus className="h-4 w-4" />
              {lang === "ru" ? "Добавить отель" : "Add Hotel"}
            </Button>
          </div>
          <Input
            placeholder={lang === "ru" ? "Поиск по названию или городу..." : "Search by name or city..."}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="mt-2 max-w-sm"
          />
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{lang === "ru" ? "Отель" : "Hotel"}</TableHead>
                  <TableHead>{lang === "ru" ? "Город" : "City"}</TableHead>
                  <TableHead>{lang === "ru" ? "Рейтинг" : "Rating"}</TableHead>
                  <TableHead>{lang === "ru" ? "Мин. цена" : "Min Price"}</TableHead>
                  <TableHead>{lang === "ru" ? "Действия" : "Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">{lang === "ru" ? "Загрузка..." : "Loading..."}</TableCell></TableRow>
                ) : paged.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">{lang === "ru" ? "Нет отелей" : "No hotels"}</TableCell></TableRow>
                ) : paged.map((hotel: any) => (
                  <TableRow key={hotel.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                          {hotel.stars}<Star className="h-3 w-3 inline ml-0.5" />
                        </Badge>
                        <Link href={`/hotels/${hotel.id}`} className="font-medium hover:underline hover:text-primary transition-colors">
                          {hotel.name}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{hotel.city}</TableCell>
                    <TableCell>
                      <span className="font-medium">{hotel.rating?.toFixed(1)}</span>
                      <span className="text-muted-foreground text-xs ml-1">({hotel.reviewCount})</span>
                    </TableCell>
                    <TableCell>{hotel.minPrice ? formatPrice(hotel.minPrice) : "—"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="gap-1" onClick={() => openEdit(hotel)}>
                          <Pencil className="h-3.5 w-3.5" />
                          {lang === "ru" ? "Изменить" : "Edit"}
                        </Button>
                        <Button size="sm" variant="destructive" className="gap-1" onClick={() => setDeleteDialog({ open: true, hotel })}>
                          <Trash2 className="h-3.5 w-3.5" />
                          {lang === "ru" ? "Удалить" : "Delete"}
                        </Button>
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

      {/* Hotel Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[95vw] max-w-5xl max-h-[90vh] flex flex-col gap-0 p-0">
          <DialogHeader className="px-8 pt-7 pb-4 shrink-0 border-b">
            <DialogTitle className="text-xl">{editingHotel ? (lang === "ru" ? "Редактировать отель" : "Edit Hotel") : (lang === "ru" ? "Добавить отель" : "Add Hotel")}</DialogTitle>
            <DialogDescription>{lang === "ru" ? "Заполните информацию об отеле." : "Fill in the hotel information."}</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
              <div className="px-8 pt-4 shrink-0 border-b">
                <TabsList className="flex gap-1 flex-wrap h-auto bg-transparent p-0">
                  {[
                    ["basic", lang === "ru" ? "Основное" : "Basic", formErrors.name || formErrors.city || formErrors.address],
                    ["desc", lang === "ru" ? "Описание" : "Description", formErrors.description_ru || formErrors.description_en],
                    ["photos", lang === "ru" ? "Фото" : "Photos", false],
                    ["amenities", lang === "ru" ? "Удобства" : "Amenities", false],
                    ["policies", lang === "ru" ? "Условия" : "Conditions", false],
                  ].map(([val, label, hasError]) => (
                    <TabsTrigger
                      key={val as string}
                      value={val as string}
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 pb-3 text-sm relative"
                    >
                      {label}
                      {hasError && <span className="absolute top-1.5 right-0.5 w-1.5 h-1.5 rounded-full bg-destructive" />}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto px-8 py-6">

                {/* BASIC TAB */}
                <TabsContent value="basic" className="mt-0 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-1.5 sm:col-span-3">
                      <Label className={formErrors.name ? "text-destructive" : ""}>{lang === "ru" ? "Название *" : "Name *"}</Label>
                      <Input
                        value={form.name}
                        onChange={e => { setField("name", e.target.value); if (e.target.value.trim()) setFormErrors(f => ({ ...f, name: false })); }}
                        placeholder="Grand Hotel Paris"
                        className={formErrors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                      />
                      {formErrors.name && <p className="text-xs text-destructive">{lang === "ru" ? "Обязательное поле" : "Required field"}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label>{lang === "ru" ? "Звёзды" : "Stars"}</Label>
                      <Select value={form.stars} onValueChange={v => setField("stars", v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {[1,2,3,4,5].map(s => <SelectItem key={s} value={String(s)}>{s} ★</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className={formErrors.city ? "text-destructive" : ""}>{lang === "ru" ? "Город *" : "City *"}</Label>
                      <Input
                        value={form.city}
                        onChange={e => { setField("city", e.target.value); if (e.target.value.trim()) setFormErrors(f => ({ ...f, city: false })); }}
                        placeholder="Paris"
                        className={formErrors.city ? "border-destructive focus-visible:ring-destructive" : ""}
                      />
                      {formErrors.city && <p className="text-xs text-destructive">{lang === "ru" ? "Обязательное поле" : "Required field"}</p>}
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className={formErrors.address ? "text-destructive" : ""}>{lang === "ru" ? "Адрес *" : "Address *"}</Label>
                      <Input
                        value={form.address}
                        onChange={e => { setField("address", e.target.value); if (e.target.value.trim()) setFormErrors(f => ({ ...f, address: false })); }}
                        placeholder="12 Rue de Rivoli, 75001"
                        className={formErrors.address ? "border-destructive focus-visible:ring-destructive" : ""}
                      />
                      {formErrors.address && <p className="text-xs text-destructive">{lang === "ru" ? "Обязательное поле" : "Required field"}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label>{lang === "ru" ? "Широта" : "Latitude"}</Label>
                      <Input type="number" value={form.latitude} onChange={e => setField("latitude", e.target.value)} placeholder="48.8566" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>{lang === "ru" ? "Долгота" : "Longitude"}</Label>
                      <Input type="number" value={form.longitude} onChange={e => setField("longitude", e.target.value)} placeholder="2.3522" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>{lang === "ru" ? "Время заезда" : "Check-in"}</Label>
                      <Input value={form.checkInTime} onChange={e => setField("checkInTime", e.target.value)} placeholder="14:00" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>{lang === "ru" ? "Время выезда" : "Check-out"}</Label>
                      <Input value={form.checkOutTime} onChange={e => setField("checkOutTime", e.target.value)} placeholder="12:00" />
                    </div>
                  </div>
                </TabsContent>

                {/* DESCRIPTION TAB */}
                <TabsContent value="desc" className="mt-0 space-y-3">
                  <h4 className="font-medium text-sm">{lang === "ru" ? "Описание" : "Description"}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className={formErrors.description_ru ? "text-destructive" : ""}>
                        🇷🇺 {lang === "ru" ? "Описание на русском" : "Description (Russian)"}
                        {formErrors.description_ru && <span className="ml-1 text-destructive">*</span>}
                      </Label>
                      <Textarea
                        value={form.description_ru}
                        onChange={e => { setField("description_ru", e.target.value); if (e.target.value.trim()) setFormErrors(f => ({ ...f, description_ru: false })); }}
                        rows={10}
                        placeholder={lang === "ru" ? "Роскошный отель в центре города..." : "Luxury hotel in the city center..."}
                        className={formErrors.description_ru ? "border-destructive focus-visible:ring-destructive" : ""}
                      />
                      {formErrors.description_ru && (
                        <p className="text-xs text-destructive">{lang === "ru" ? "Обязательное поле" : "Required field"}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label className={formErrors.description_en ? "text-destructive" : ""}>
                        🇬🇧 {lang === "ru" ? "Описание на английском" : "Description (English)"}
                        {formErrors.description_en && <span className="ml-1 text-destructive">*</span>}
                      </Label>
                      <Textarea
                        value={form.description_en}
                        onChange={e => { setField("description_en", e.target.value); if (e.target.value.trim()) setFormErrors(f => ({ ...f, description_en: false })); }}
                        rows={10}
                        placeholder="Luxury hotel in the city center..."
                        className={formErrors.description_en ? "border-destructive focus-visible:ring-destructive" : ""}
                      />
                      {formErrors.description_en && (
                        <p className="text-xs text-destructive">{lang === "ru" ? "Обязательное поле" : "Required field"}</p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* PHOTOS TAB */}
                <TabsContent value="photos" className="mt-0 space-y-3">
                  <h4 className="font-medium text-sm">{lang === "ru" ? "Фотографии" : "Photos"}</h4>
                  <div className="flex gap-2">
                    <Input
                      value={imageInput}
                      onChange={e => setImageInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addImage())}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" onClick={addImage}>{lang === "ru" ? "Добавить" : "Add"}</Button>
                  </div>
                  {form.images.length === 0 && <p className="text-sm text-muted-foreground">{lang === "ru" ? "Нет фотографий" : "No photos added"}</p>}
                  {form.images.length > 0 && (
                    <div className="space-y-2">
                      {form.images.map((url, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/40">
                          <img src={url} alt="" className="h-10 w-16 object-cover rounded shrink-0 bg-muted" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          <span className="flex-1 text-xs text-muted-foreground truncate">{url}</span>
                          {i === 0 && <Badge variant="secondary" className="text-xs shrink-0">{lang === "ru" ? "Главная" : "Main"}</Badge>}
                          <Button type="button" size="sm" variant="ghost" className="h-7 w-7 p-0 shrink-0" onClick={() => removeImage(i)}>
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* AMENITIES TAB */}
                <TabsContent value="amenities" className="mt-0 space-y-5">

                  {/* Popular amenities */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      {lang === "ru" ? "Популярные удобства" : "Popular Amenities"}
                    </h5>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1 border rounded-lg p-3 bg-muted/10">
                      {HOTEL_AMENITY_CATEGORIES.map(cat => {
                        const catMeta = HOTEL_CATEGORY_LABELS[cat.category];
                        return (
                          <div key={cat.category} className="space-y-1.5">
                            <p className="text-xs font-medium text-muted-foreground">
                              {catMeta ? (lang === "ru" ? catMeta.ru : catMeta.en) : cat.category}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {cat.items.map(code => {
                                const selected = form.popularAmenities.includes(code);
                                return (
                                  <button
                                    key={code}
                                    type="button"
                                    onClick={() => togglePopularAmenity(code)}
                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border transition-colors cursor-pointer ${
                                      selected
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-background border-border hover:bg-muted"
                                    }`}
                                  >
                                    {selected && <span>✓</span>}
                                    {tCode(HOTEL_AMENITY_LABELS, code, lang)}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Separator />

                  {/* All amenities by category */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      {lang === "ru" ? "Все удобства" : "All Amenities"}
                    </h5>
                    <div className="space-y-3">
                      {HOTEL_AMENITY_CATEGORIES.map(cat => {
                        const catMeta = HOTEL_CATEGORY_LABELS[cat.category];
                        const selectedCount = (form.amenitiesExtended[cat.category] ?? []).length;
                        return (
                          <div key={cat.category} className="border rounded-lg p-4 space-y-3 bg-muted/10">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">
                                {catMeta ? (lang === "ru" ? catMeta.ru : catMeta.en) : cat.category}
                              </span>
                              {selectedCount > 0 && (
                                <Badge variant="secondary" className="text-xs">{selectedCount}</Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {cat.items.map(code => {
                                const selected = (form.amenitiesExtended[cat.category] ?? []).includes(code);
                                return (
                                  <button
                                    key={code}
                                    type="button"
                                    onClick={() => toggleExtendedAmenity(cat.category, code)}
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border transition-colors cursor-pointer ${
                                      selected
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-background border-border hover:bg-muted"
                                    }`}
                                  >
                                    {selected && <span>✓</span>}
                                    {tCode(HOTEL_AMENITY_LABELS, code, lang)}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </TabsContent>

                {/* CONDITIONS TAB (formerly Policies) */}
                <TabsContent value="policies" className="mt-0 space-y-6">

                  {/* Parking */}
                  <div className="space-y-3">
                    <h5 className="font-medium text-sm">{lang === "ru" ? "Парковка" : "Parking"}</h5>
                    <div className="flex items-center gap-2 mb-2">
                      <Checkbox id="parking-avail" checked={form.parking.available} onCheckedChange={v => setParking("available", !!v)} />
                      <Label htmlFor="parking-avail" className="cursor-pointer">{lang === "ru" ? "Парковка доступна" : "Parking available"}</Label>
                    </div>
                    {form.parking.available && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs">{lang === "ru" ? "Цена/сутки (USD, 0 = бесплатно)" : "Price/day (USD, 0 = free)"}</Label>
                          <Input type="number" value={form.parking.price} onChange={e => setParking("price", e.target.value)} placeholder="0" min="0" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">{lang === "ru" ? "Тип" : "Type"}</Label>
                          <Input value={form.parking.type} onChange={e => setParking("type", e.target.value)} placeholder={lang === "ru" ? "Подземная, охраняемая..." : "Underground, guarded..."} />
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Accessibility */}
                  <div className="space-y-3">
                    <h5 className="font-medium text-sm">{lang === "ru" ? "Доступность" : "Accessibility"}</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Checkbox id="wheelchair" checked={form.accessibility.wheelchairAccessible} onCheckedChange={v => setAccess("wheelchairAccessible", !!v)} />
                        <Label htmlFor="wheelchair" className="cursor-pointer text-sm">{lang === "ru" ? "Для инвалидных колясок" : "Wheelchair accessible"}</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="elevator" checked={form.accessibility.elevator} onCheckedChange={v => setAccess("elevator", !!v)} />
                        <Label htmlFor="elevator" className="cursor-pointer text-sm">{lang === "ru" ? "Лифт" : "Elevator"}</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="adaptedRooms" checked={form.accessibility.adaptedRooms} onCheckedChange={v => setAccess("adaptedRooms", !!v)} />
                        <Label htmlFor="adaptedRooms" className="cursor-pointer text-sm">{lang === "ru" ? "Адаптированные номера" : "Adapted rooms"}</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="hearingAssistance" checked={form.accessibility.hearingAssistance} onCheckedChange={v => setAccess("hearingAssistance", !!v)} />
                        <Label htmlFor="hearingAssistance" className="cursor-pointer text-sm">{lang === "ru" ? "Помощь слабослышащим" : "Hearing assistance"}</Label>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Pets */}
                  <div className="space-y-3">
                    <h5 className="font-medium text-sm">{lang === "ru" ? "Политика размещения с животными" : "Pet Policy"}</h5>
                    <div className="flex items-center gap-2">
                      <Checkbox id="pets-allowed" checked={form.petPolicy.allowed} onCheckedChange={v => setPet("allowed", !!v)} />
                      <Label htmlFor="pets-allowed" className="cursor-pointer text-sm">{lang === "ru" ? "Животные разрешены" : "Pets allowed"}</Label>
                    </div>
                    {form.petPolicy.allowed && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs">{lang === "ru" ? "Сбор за животное (USD/ночь, 0 = бесплатно)" : "Pet fee (USD/night, 0 = free)"}</Label>
                          <Input type="number" value={form.petPolicy.fee} onChange={e => setPet("fee", e.target.value)} placeholder="0" min="0" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">{lang === "ru" ? "Условия" : "Conditions"}</Label>
                          <Input value={form.petPolicy.conditions} onChange={e => setPet("conditions", e.target.value)} placeholder={lang === "ru" ? "Только мелкие животные до 5 кг" : "Small pets under 5 kg only"} />
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Children */}
                  <div className="space-y-3">
                    <h5 className="font-medium text-sm">{lang === "ru" ? "Политика размещения детей" : "Children Policy"}</h5>
                    <div className="flex items-center gap-2">
                      <Checkbox id="child-allowed" checked={form.childPolicy.allowed} onCheckedChange={v => setChild("allowed", !!v)} />
                      <Label htmlFor="child-allowed" className="cursor-pointer text-sm">{lang === "ru" ? "Дети допускаются" : "Children welcome"}</Label>
                    </div>
                    {form.childPolicy.allowed && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs">{lang === "ru" ? "Бесплатно до (лет)" : "Free up to age"}</Label>
                          <Input type="number" value={form.childPolicy.freeUnder} onChange={e => setChild("freeUnder", e.target.value)} placeholder="12" min="0" max="18" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">{lang === "ru" ? "Примечания" : "Notes"}</Label>
                          <Input value={form.childPolicy.notes} onChange={e => setChild("notes", e.target.value)} placeholder={lang === "ru" ? "Детская кроватка по запросу" : "Cot available on request"} />
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Languages */}
                  <div className="space-y-3">
                    <h5 className="font-medium text-sm">{lang === "ru" ? "Языки персонала" : "Staff Languages"}</h5>
                    <div className="flex gap-2">
                      <Input
                        value={langInput}
                        onChange={e => setLangInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addLang())}
                        placeholder={lang === "ru" ? "Русский, English, Deutsch..." : "English, Russian, Deutsch..."}
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" onClick={addLang}>{lang === "ru" ? "Добавить" : "Add"}</Button>
                    </div>
                    {form.languages.length === 0 ? (
                      <p className="text-sm text-muted-foreground">{lang === "ru" ? "Нет добавленных языков" : "No languages added"}</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {form.languages.map(l => (
                          <Badge key={l} variant="secondary" className="gap-1 pr-1 text-xs">
                            {l}
                            <button type="button" onClick={() => removeLang(l)} className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                </TabsContent>

              </div>
            </Tabs>
          </div>

          <DialogFooter className="px-8 py-5 border-t shrink-0 bg-muted/30">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>{lang === "ru" ? "Отмена" : "Cancel"}</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (lang === "ru" ? "Сохранение..." : "Saving...") : (lang === "ru" ? "Сохранить" : "Save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialog.open} onOpenChange={open => !open && setDeleteDialog({ open: false, hotel: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{lang === "ru" ? "Удалить отель?" : "Delete Hotel?"}</DialogTitle>
            <DialogDescription>
              {lang === "ru"
                ? `«${deleteDialog.hotel?.name}» будет удалён вместе со всеми номерами. Это действие нельзя отменить.`
                : `"${deleteDialog.hotel?.name}" and all its rooms will be permanently deleted.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, hotel: null })}>{lang === "ru" ? "Отмена" : "Cancel"}</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? (lang === "ru" ? "Удаление..." : "Deleting...") : (lang === "ru" ? "Удалить" : "Delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
