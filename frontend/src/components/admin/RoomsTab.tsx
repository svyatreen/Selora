import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { customFetch } from "@/api/custom-fetch";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useListHotels, getListHotelsQueryKey } from "@/api";
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
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";
import { toast } from "sonner";
import { useCurrency } from "@/contexts/CurrencyContext";
import { ROOM_CATEGORY_LABELS, ROOM_AMENITY_LABELS, POLICY_CODE_LABELS, tCode } from "@/lib/amenity-codes";

const PAGE_SIZE = 11;

const ROOM_TYPES = [
  { value: "single", labelRu: "Одноместный", labelEn: "Single" },
  { value: "double", labelRu: "Двухместный", labelEn: "Double" },
  { value: "deluxe", labelRu: "Делюкс", labelEn: "Deluxe" },
  { value: "suite", labelRu: "Люкс", labelEn: "Suite" },
];

const VIEW_TYPES = [
  { value: "__none", labelRu: "Не выбрано", labelEn: "None" },
  { value: "sea", labelRu: "Вид на море", labelEn: "Sea view" },
  { value: "mountain", labelRu: "Вид на горы", labelEn: "Mountain view" },
  { value: "city", labelRu: "Вид на город", labelEn: "City view" },
  { value: "garden", labelRu: "Вид на сад", labelEn: "Garden view" },
  { value: "pool", labelRu: "Вид на бассейн", labelEn: "Pool view" },
  { value: "courtyard", labelRu: "Вид во двор", labelEn: "Courtyard view" },
  { value: "forest", labelRu: "Вид на лес", labelEn: "Forest view" },
  { value: "lake", labelRu: "Вид на озеро", labelEn: "Lake view" },
];

const ADDON_CATEGORY_LABELS: Record<string, { ru: string; en: string }> = {
  "Питание": { ru: "Питание", en: "Food" },
  "Транспорт": { ru: "Транспорт", en: "Transport" },
  "Развлечения": { ru: "Развлечения", en: "Entertainment" },
  "Проживание": { ru: "Проживание", en: "Accommodation" },
  "Сервис": { ru: "Сервис", en: "Services" },
  "Велнес": { ru: "Велнес", en: "Wellness" },
  "Комфорт": { ru: "Комфорт", en: "Comfort" },
};

const CATEGORY_NORMALIZE_MAP: Record<string, string> = {
  "food": "Питание",
  "Food": "Питание",
  "transport": "Транспорт",
  "Transport": "Транспорт",
  "entertainment": "Развлечения",
  "Entertainment": "Развлечения",
  "accommodation": "Проживание",
  "Accommodation": "Проживание",
  "service": "Сервис",
  "Service": "Сервис",
  "services": "Сервис",
  "wellness": "Велнес",
  "Wellness": "Велнес",
  "spa": "Велнес",
  "comfort": "Комфорт",
  "Comfort": "Комфорт",
  "bath": "Сервис",
  "bedding": "Проживание",
  "tech": "Сервис",
  "work": "Сервис",
};

const ADDON_UNITS = [
  { value: "per_booking", labelRu: "За бронирование", labelEn: "Per booking" },
  { value: "per_night", labelRu: "За ночь", labelEn: "Per night" },
  { value: "per_guest", labelRu: "За гостя", labelEn: "Per guest" },
  { value: "per_person", labelRu: "За человека", labelEn: "Per person" },
  { value: "per_day", labelRu: "За день", labelEn: "Per day" },
  { value: "per_session", labelRu: "За сеанс", labelEn: "Per session" },
];

const RATE_PLAN_PRESETS: {
  code: string;
  nameRu: string;
  nameEn: string;
  descriptionRu: string;
  descriptionEn: string;
  refundable: boolean;
  includesBreakfast: boolean;
  includesDinner: boolean;
}[] = [
  { code: "room_only", nameRu: "Только номер", nameEn: "Room Only", descriptionRu: "Проживание без питания", descriptionEn: "Accommodation only, no meals", refundable: true, includesBreakfast: false, includesDinner: false },
  { code: "bed_breakfast", nameRu: "Завтрак включён", nameEn: "Breakfast Included", descriptionRu: "Проживание с завтраком", descriptionEn: "Accommodation with breakfast", refundable: true, includesBreakfast: true, includesDinner: false },
  { code: "half_board", nameRu: "Полупансион", nameEn: "Half Board", descriptionRu: "Проживание с завтраком и ужином", descriptionEn: "Accommodation with breakfast and dinner", refundable: true, includesBreakfast: true, includesDinner: true },
  { code: "full_board", nameRu: "Полный пансион", nameEn: "Full Board", descriptionRu: "Проживание с трёхразовым питанием", descriptionEn: "Accommodation with all meals", refundable: true, includesBreakfast: true, includesDinner: true },
  { code: "non_refundable", nameRu: "Невозвратный", nameEn: "Non-Refundable", descriptionRu: "Специальная цена без возврата", descriptionEn: "Special discounted non-refundable rate", refundable: false, includesBreakfast: false, includesDinner: false },
  { code: "flexible", nameRu: "Гибкий", nameEn: "Flexible", descriptionRu: "Бесплатная отмена в любое время", descriptionEn: "Free cancellation anytime", refundable: true, includesBreakfast: false, includesDinner: false },
  { code: "early_bird", nameRu: "Раннее бронирование", nameEn: "Early Bird", descriptionRu: "Скидка за бронирование заранее", descriptionEn: "Discount for booking in advance", refundable: false, includesBreakfast: false, includesDinner: false },
  { code: "last_minute", nameRu: "Последняя минута", nameEn: "Last Minute", descriptionRu: "Выгодная цена для спонтанных поездок", descriptionEn: "Special rate for last-minute bookings", refundable: false, includesBreakfast: false, includesDinner: false },
];

const ADDON_PRESETS: {
  code: string;
  nameRu: string;
  nameEn: string;
  descriptionRu: string;
  descriptionEn: string;
  category: string;
  unit: string;
}[] = [
  { code: "airport_transfer", nameRu: "Трансфер из аэропорта", nameEn: "Airport Transfer", descriptionRu: "Встреча и доставка из аэропорта", descriptionEn: "Pick-up and transfer from the airport", category: "Транспорт", unit: "per_booking" },
  { code: "spa", nameRu: "СПА-доступ", nameEn: "Spa Access", descriptionRu: "Доступ в СПА-центр на весь день", descriptionEn: "Full-day access to the spa center", category: "Развлечения", unit: "per_guest" },
  { code: "city_tour", nameRu: "Экскурсия по городу", nameEn: "City Tour", descriptionRu: "Обзорная экскурсия по городу с гидом", descriptionEn: "Guided city sightseeing tour", category: "Развлечения", unit: "per_booking" },
  { code: "extra_bed", nameRu: "Дополнительная кровать", nameEn: "Extra Bed", descriptionRu: "Дополнительная кровать для взрослого", descriptionEn: "Extra bed for an adult", category: "Проживание", unit: "per_night" },
  { code: "baby_cot", nameRu: "Детская кроватка", nameEn: "Baby Cot", descriptionRu: "Детская кроватка для малыша", descriptionEn: "Baby cot for an infant", category: "Проживание", unit: "per_booking" },

  { code: "late_checkout", nameRu: "Поздний выезд", nameEn: "Late Checkout", descriptionRu: "Выезд до 16:00 вместо стандартных 12:00", descriptionEn: "Checkout until 16:00 instead of standard 12:00", category: "Сервис", unit: "per_booking" },
  { code: "early_checkin", nameRu: "Ранний заезд", nameEn: "Early Check-in", descriptionRu: "Заезд с 8:00 вместо стандартных 14:00", descriptionEn: "Check-in from 8:00 instead of standard 14:00", category: "Сервис", unit: "per_booking" },
];

const FREE_ITEMS_CODES = [
  "wifi_unlimited", "breakfast_buffet", "parking_free", "transfer",
  "dinner", "lunch", "minibar_softs", "gym", "pool_access", "spa_access",
  "air_conditioning", "tv", "in_room_safe", "slippers_robes", "hair_dryer",
  "toiletries_set", "daily_housekeeping", "welcome_drink", "welcome_amenity",
  "iron_ironing_board", "umbrella_in_room",
];

const AMENITY_CATEGORIES: { category: string; items: string[] }[] = [
  { category: "bath", items: ["rainfall_shower", "walk_in_shower", "freestanding_bathtub", "jetted_tub", "heated_floors", "heated_towel_rail", "bathrobes_egyptian_cotton", "slippers_branded", "hermes_amenities", "diptyque_amenities", "bvlgari_amenities", "magnifying_mirror", "hairdryer_dyson_supersonic", "bidet", "double_vanity", "walk_in_closet"] },
  { category: "bedding", items: ["king_size_bed", "queen_size_bed", "twin_beds", "sofa_bed_extra", "egyptian_cotton_sheets_500tc", "down_duvet", "hypoallergenic_options", "pillow_menu", "mattress_topper_premium"] },
  { category: "comfort", items: ["blackout_curtains", "soundproof_windows", "climate_control_individual", "humidifier_on_request", "in_room_safe_laptop", "minibar_premium", "minibar_complimentary", "turndown_service"] },
  { category: "tech", items: ["smart_tv_55", "smart_tv_65_oled", "netflix_built_in", "apple_tv", "bluetooth_speaker_bose", "bluetooth_speaker_marshall", "usb_c_charging", "wireless_charger", "high_speed_wifi", "voice_assistant_alexa", "tablet_room_controls", "in_room_ipad"] },
  { category: "food", items: ["nespresso_machine", "espresso_machine_pro", "kettle_tea_selection_twg", "complimentary_water_glass_bottles", "fresh_fruit_basket_daily", "welcome_chocolates", "mini_fridge", "wine_glasses_riedel", "champagne_flutes"] },
  { category: "work", items: ["ergonomic_chair_herman_miller", "executive_desk", "reading_light_dual", "desk_lamp_usb", "wireless_printer_access", "webcam_lighting"] },
];

type RoomForm = {
  hotelId: string;
  type: string;
  price: string;
  totalRooms: string;
  description_ru: string;
  description_en: string;
  images: string[];
  sizeSqm: string;
  viewType: string;
  soundproofing: boolean;
  nonSmoking: boolean;
  freeItems: string[];
  amenitiesDetailed: { category: string; items: string[] }[];
};

type RatePlan = {
  id: number;
  code: string;
  nameRu: string;
  nameEn: string;
  descriptionRu: string | null;
  descriptionEn: string | null;
  priceModifier: number;
  refundable: boolean;
  includesBreakfast: boolean;
  includesDinner: boolean;
  freeCancellationHours: number | null;
};

type RatePlanForm = {
  code: string;
  nameRu: string;
  nameEn: string;
  descriptionRu: string;
  descriptionEn: string;
  priceModifier: string;
  refundable: boolean;
  includesBreakfast: boolean;
  includesDinner: boolean;
  freeCancellationHours: string;
};

type AddonRaw = {
  id: number;
  code: string;
  hotelId: number | null;
  nameRu: string;
  nameEn: string;
  descriptionRu: string | null;
  descriptionEn: string | null;
  category: string;
  price: number;
  unit: string;
  maxQuantity: number;
};

type AddonForm = {
  code: string;
  nameRu: string;
  nameEn: string;
  descriptionRu: string;
  descriptionEn: string;
  category: string;
  price: string;
  unit: string;
  maxQuantity: string;
};

const emptyForm = (hotelId = ""): RoomForm => ({
  hotelId, type: "single",
  price: "", totalRooms: "",
  description_ru: "", description_en: "",
  images: [], sizeSqm: "", viewType: "",
  soundproofing: false, nonSmoking: true,
  freeItems: [],
  amenitiesDetailed: [],
});

const emptyRatePlanForm = (): RatePlanForm => ({
  code: "", nameRu: "", nameEn: "", descriptionRu: "", descriptionEn: "",
  priceModifier: "0", refundable: true, includesBreakfast: false,
  includesDinner: false, freeCancellationHours: "",
});

const emptyAddonForm = (): AddonForm => ({
  code: "", nameRu: "", nameEn: "", descriptionRu: "", descriptionEn: "",
  category: "", price: "", unit: "per_booking", maxQuantity: "1",
});

function roomToForm(r: any): RoomForm {
  const amenitiesDetailed: { category: string; items: string[] }[] = [];
  if (r.amenitiesDetailed && typeof r.amenitiesDetailed === "object") {
    for (const [cat, items] of Object.entries(r.amenitiesDetailed)) {
      amenitiesDetailed.push({ category: cat, items: Array.isArray(items) ? items as string[] : [] });
    }
  }
  return {
    hotelId: String(r.hotelId ?? ""),
    type: r.type ?? "single",
    price: String(r.price ?? ""),
    totalRooms: String(r.totalRooms ?? 1),
    description_ru: r.description_ru ?? r.description ?? "",
    description_en: r.description_en ?? r.description ?? "",
    images: Array.isArray(r.images) ? r.images : [],
    sizeSqm: r.sizeSqm != null ? String(r.sizeSqm) : "",
    viewType: r.viewType ?? "",
    soundproofing: r.soundproofing ?? false,
    nonSmoking: r.nonSmoking ?? true,
    freeItems: Array.isArray(r.freeItems) ? r.freeItems : [],
    amenitiesDetailed,
  };
}

export default function RoomsTab({ lang }: { lang: "ru" | "en" }) {
  const { formatPrice } = useCurrency();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; room: any | null }>({ open: false, room: null });
  const [editingRoom, setEditingRoom] = useState<any | null>(null);
  const [form, setForm] = useState<RoomForm>(emptyForm());
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageInput, setImageInput] = useState("");
  const [activeTab, setActiveTab] = useState("basic");

  const [ratePlans, setRatePlans] = useState<RatePlan[]>([]);
  const [ratePlanForm, setRatePlanForm] = useState<RatePlanForm>(emptyRatePlanForm());
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null);
  const [savingPlan, setSavingPlan] = useState(false);
  const [showPlanForm, setShowPlanForm] = useState(false);

  const [addons, setAddons] = useState<AddonRaw[]>([]);
  const [addonForm, setAddonForm] = useState<AddonForm>(emptyAddonForm());
  const [editingAddonId, setEditingAddonId] = useState<number | null>(null);
  const [savingAddon, setSavingAddon] = useState(false);
  const [showAddonForm, setShowAddonForm] = useState(false);
  const savingNewRoomRef = useRef(false);
  const [hotelSearch, setHotelSearch] = useState("");
  const [hotelDropdownOpen, setHotelDropdownOpen] = useState(false);
  const [takenTypes, setTakenTypes] = useState<string[]>([]);

  async function loadTakenTypes(hotelId: string): Promise<string[]> {
    if (!hotelId) { setTakenTypes([]); return []; }
    try {
      const rooms = await customFetch<any[]>(`/api/hotels/${hotelId}/rooms`);
      const taken = rooms.map((r: any) => r.type);
      setTakenTypes(taken);
      return taken;
    } catch {
      setTakenTypes([]);
      return [];
    }
  }

  const availableTypes = ROOM_TYPES.filter(t => !takenTypes.includes(t.value));
  const allTypesTaken = availableTypes.length === 0;

  const { data: hotels, isLoading: loadingHotels } = useListHotels({ limit: 1000 } as any, {
    query: { queryKey: getListHotelsQueryKey({ limit: 1000 } as any) },
  });

  const [debouncedSearch, setDebouncedSearch] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => { setPage(1); }, [debouncedSearch]);

  const roomsQueryKey = ["admin-rooms-paged", page, PAGE_SIZE, debouncedSearch];

  const { data: roomsPage, isFetching: loadingRooms } = useQuery<{ data: any[]; total: number; page: number; totalPages: number }>({
    queryKey: roomsQueryKey,
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
      if (debouncedSearch) params.set("search", debouncedSearch);
      return customFetch(`/api/admin/rooms?${params}`);
    },
    staleTime: 15_000,
    placeholderData: (prev) => prev,
  });

  const paged = roomsPage?.data ?? [];
  const totalPages = roomsPage?.totalPages ?? 1;
  const totalRoomsCount = roomsPage?.total ?? 0;

  function invalidateRooms() {
    queryClient.invalidateQueries({ queryKey: ["admin-rooms-paged"] });
  }

  async function loadRatePlans(roomId: number) {
    try {
      const plans = await customFetch<any[]>(`/api/rooms/${roomId}/rate-plans`);
      setRatePlans(plans);
    } catch {
      setRatePlans([]);
    }
  }

  async function loadAddons(hotelId: string) {
    if (!hotelId) { setAddons([]); return; }
    try {
      const data = await customFetch<AddonRaw[]>(`/api/booking-addons?hotelId=${hotelId}`);
      setAddons(data);
    } catch {
      setAddons([]);
    }
  }

  async function ensureRoomSaved(): Promise<any | null> {
    if (editingRoom) return editingRoom;
    if (!form.hotelId || !form.type || !form.price) {
      toast.error(lang === "ru" ? "Заполните отель, тип номера и цену" : "Fill in hotel, room type and price");
      return null;
    }
    if (savingNewRoomRef.current) return null;
    savingNewRoomRef.current = true;
    try {
      const amenitiesDetailedObj: Record<string, string[]> = {};
      for (const { category, items } of form.amenitiesDetailed) {
        if (category && items.length > 0) amenitiesDetailedObj[category] = items;
      }
      const newRoom = await customFetch<any>(`/api/hotels/${form.hotelId}/rooms`, {
        method: "POST",
        body: JSON.stringify({
          type: form.type,
          price: parseFloat(form.price),
          totalRooms: parseInt(form.totalRooms) || 1,
          description_ru: form.description_ru.trim() || null,
          description_en: form.description_en.trim() || null,
          images: form.images,
          sizeSqm: form.sizeSqm ? parseInt(form.sizeSqm) : null,
          viewType: form.viewType || null,
          soundproofing: form.soundproofing,
          nonSmoking: form.nonSmoking,
          freeItems: form.freeItems,
          amenitiesDetailed: amenitiesDetailedObj,
        }),
        headers: { "Content-Type": "application/json" },
      });
      setEditingRoom(newRoom);
      invalidateRooms();
      return newRoom;
    } catch (e: any) {
      const msg = e?.message || "";
      if (msg.includes("уже существует") || msg.includes("already exists") || e?.status === 409) {
        toast.error(lang === "ru" ? "Номер такого типа уже существует для этого отеля. Смените тип номера." : "A room of this type already exists for this hotel. Change the room type.");
      } else {
        toast.error(msg || (lang === "ru" ? "Ошибка сохранения номера" : "Failed to save room"));
      }
      return null;
    } finally {
      savingNewRoomRef.current = false;
    }
  }

  function handleTabChange(newTab: string) {
    if (!editingRoom && allTypesTaken && newTab !== "basic") {
      toast.error(lang === "ru" ? "Все 4 типа номеров уже заняты для этого отеля. Выберите другой отель." : "All 4 room types are taken for this hotel. Choose a different hotel.");
      return;
    }
    setActiveTab(newTab);
  }

  function openCreate() {
    setEditingRoom(null);
    setForm(emptyForm());
    setFormErrors({});
    setHotelSearch("");
    setImageInput("");
    setRatePlans([]);
    setAddons([]);
    setTakenTypes([]);
    setRatePlanForm(emptyRatePlanForm());
    setAddonForm(emptyAddonForm());
    setEditingPlanId(null);
    setEditingAddonId(null);
    setShowPlanForm(false);
    setShowAddonForm(false);
    setActiveTab("basic");
    setDialogOpen(true);
  }

  function openEdit(room: any) {
    setEditingRoom(room);
    setForm(roomToForm(room));
    setFormErrors({});
    setImageInput("");
    setRatePlanForm(emptyRatePlanForm());
    setAddonForm(emptyAddonForm());
    setEditingPlanId(null);
    setEditingAddonId(null);
    setShowPlanForm(false);
    setShowAddonForm(false);
    setActiveTab("basic");
    setDialogOpen(true);
    loadRatePlans(room.id);
    loadAddons(String(room.hotelId));
  }

  function setField<K extends keyof RoomForm>(k: K, v: RoomForm[K]) {
    setForm(f => ({ ...f, [k]: v }));
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

  function toggleFreeItem(item: string) {
    setField("freeItems", form.freeItems.includes(item)
      ? form.freeItems.filter(x => x !== item)
      : [...form.freeItems, item]);
  }

  function toggleAmenityItem(catName: string, item: string) {
    const existing = form.amenitiesDetailed.find(a => a.category === catName);
    if (!existing) {
      setField("amenitiesDetailed", [
        ...form.amenitiesDetailed,
        { category: catName, items: [item] },
      ]);
    } else {
      const hasItem = existing.items.includes(item);
      const updated = form.amenitiesDetailed.map(a =>
        a.category === catName
          ? { ...a, items: hasItem ? a.items.filter(x => x !== item) : [...a.items, item] }
          : a
      );
      setField("amenitiesDetailed", updated);
    }
  }

  function isAmenityChecked(catName: string, item: string): boolean {
    const cat = form.amenitiesDetailed.find(a => a.category === catName);
    return cat ? cat.items.includes(item) : false;
  }

  async function handleSave() {
    const errors: Record<string, boolean> = {};
    if (!form.hotelId) errors.hotelId = true;
    if (!form.type) errors.type = true;
    if (!form.price) errors.price = true;
    if (!form.description_ru.trim()) errors.description_ru = true;
    if (!form.description_en.trim()) errors.description_en = true;
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const hasBasic = errors.hotelId || errors.type || errors.price;
      const hasDesc = errors.description_ru || errors.description_en;
      if (hasBasic) {
        setActiveTab("basic");
        toast.error(lang === "ru" ? "Заполните обязательные поля на вкладке «Основное»" : "Fill required fields in the Basic tab");
      } else if (hasDesc) {
        setActiveTab("desc");
        toast.error(lang === "ru" ? "Заполните описание на обоих языках" : "Fill description in both languages");
      }
      return;
    }
    setFormErrors({});
    const totalAmenities = form.amenitiesDetailed.reduce((acc, a) => acc + a.items.length, 0);
    if (totalAmenities === 0) {
      toast.error(lang === "ru" ? "Выберите хотя бы одно удобство во вкладке «Удобства»" : "Select at least one amenity in the Amenities tab");
      return;
    }
    setSaving(true);
    try {
      const amenitiesDetailedObj: Record<string, string[]> = {};
      for (const { category, items } of form.amenitiesDetailed) {
        if (category && items.length > 0) amenitiesDetailedObj[category] = items;
      }
      const payload: any = {
        type: form.type,
        price: parseFloat(form.price),
        totalRooms: parseInt(form.totalRooms) || 1,
        description_ru: form.description_ru.trim() || null,
        description_en: form.description_en.trim() || null,
        images: form.images,
        sizeSqm: form.sizeSqm ? parseInt(form.sizeSqm) : null,
        viewType: form.viewType || null,
        soundproofing: form.soundproofing,
        nonSmoking: form.nonSmoking,
        freeItems: form.freeItems,
        amenitiesDetailed: amenitiesDetailedObj,
      };
      if (editingRoom) {
        await customFetch(`/api/rooms/${editingRoom.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        });
        toast.success(lang === "ru" ? "Номер обновлён" : "Room updated");
      } else {
        await customFetch(`/api/hotels/${form.hotelId}/rooms`, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        });
        toast.success(lang === "ru" ? "Номер добавлен" : "Room created");
      }
      invalidateRooms();
      setDialogOpen(false);
    } catch (e: any) {
      toast.error(e?.message || (lang === "ru" ? "Ошибка сохранения" : "Save failed"));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteDialog.room) return;
    setDeleting(true);
    try {
      await customFetch(`/api/rooms/${deleteDialog.room.id}`, { method: "DELETE" });
      invalidateRooms();
      toast.success(lang === "ru" ? "Номер удалён" : "Room deleted");
      setDeleteDialog({ open: false, room: null });
    } catch (e: any) {
      toast.error(e?.message || (lang === "ru" ? "Ошибка удаления" : "Delete failed"));
    } finally {
      setDeleting(false);
    }
  }

  function startEditPlan(plan: RatePlan) {
    setEditingPlanId(plan.id);
    setRatePlanForm({
      code: plan.code,
      nameRu: plan.nameRu,
      nameEn: plan.nameEn,
      descriptionRu: plan.descriptionRu ?? "",
      descriptionEn: plan.descriptionEn ?? "",
      priceModifier: String(Math.round(plan.priceModifier * 100)),
      refundable: plan.refundable,
      includesBreakfast: plan.includesBreakfast,
      includesDinner: plan.includesDinner,
      freeCancellationHours: plan.freeCancellationHours != null ? String(plan.freeCancellationHours) : "",
    });
    setShowPlanForm(true);
  }

  function applyRatePlanPreset(code: string) {
    const preset = RATE_PLAN_PRESETS.find(p => p.code === code);
    if (!preset) return;
    setRatePlanForm(f => ({
      ...f,
      code: preset.code,
      nameRu: preset.nameRu,
      nameEn: preset.nameEn,
      descriptionRu: preset.descriptionRu,
      descriptionEn: preset.descriptionEn,
      refundable: preset.refundable,
      includesBreakfast: preset.includesBreakfast,
      includesDinner: preset.includesDinner,
    }));
  }

  async function savePlan() {
    if (!ratePlanForm.code || !ratePlanForm.nameRu.trim() || !ratePlanForm.nameEn.trim()) {
      toast.error(lang === "ru" ? "Выберите тип тарифа и заполните название" : "Select rate plan type and fill name");
      return;
    }
    setSavingPlan(true);
    try {
      const room = await ensureRoomSaved();
      if (!room) { setSavingPlan(false); return; }
      const payload = {
        code: ratePlanForm.code,
        nameRu: ratePlanForm.nameRu.trim(),
        nameEn: ratePlanForm.nameEn.trim(),
        descriptionRu: ratePlanForm.descriptionRu.trim() || null,
        descriptionEn: ratePlanForm.descriptionEn.trim() || null,
        priceModifier: parseFloat(ratePlanForm.priceModifier) / 100 || 0,
        refundable: ratePlanForm.refundable,
        includesBreakfast: ratePlanForm.includesBreakfast,
        includesDinner: ratePlanForm.includesDinner,
        freeCancellationHours: ratePlanForm.freeCancellationHours ? parseInt(ratePlanForm.freeCancellationHours) : null,
        lateCheckoutIncluded: false,
      };
      if (editingPlanId != null) {
        await customFetch(`/api/rooms/${room.id}/rate-plans/${editingPlanId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        });
        toast.success(lang === "ru" ? "Тариф обновлён" : "Rate plan updated");
      } else {
        await customFetch(`/api/rooms/${room.id}/rate-plans`, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        });
        toast.success(lang === "ru" ? "Тариф добавлен" : "Rate plan added");
      }
      setEditingPlanId(null);
      setRatePlanForm(emptyRatePlanForm());
      setShowPlanForm(false);
      await loadRatePlans(room.id);
    } catch (e: any) {
      const msg: string = e?.message || "";
      if (msg.includes("409") || msg.includes("уже существует") || msg.includes("already exists")) {
        toast.error(lang === "ru" ? "Такой тариф уже существует. Выберите другой." : "This rate plan already exists. Choose another.");
      } else {
        toast.error(msg || (lang === "ru" ? "Ошибка сохранения тарифа" : "Failed to save plan"));
      }
    } finally {
      setSavingPlan(false);
    }
  }

  async function deletePlan(planId: number) {
    if (!editingRoom) return;
    try {
      await customFetch(`/api/rooms/${editingRoom.id}/rate-plans/${planId}`, { method: "DELETE" });
      toast.success(lang === "ru" ? "Тариф удалён" : "Rate plan deleted");
      await loadRatePlans(editingRoom.id);
    } catch (e: any) {
      toast.error(e?.message || (lang === "ru" ? "Ошибка удаления" : "Delete failed"));
    }
  }

  function startEditAddon(addon: AddonRaw) {
    setEditingAddonId(addon.id);
    const normalizedCategory = CATEGORY_NORMALIZE_MAP[addon.category] ?? addon.category;
    setAddonForm({
      code: addon.code,
      nameRu: addon.nameRu,
      nameEn: addon.nameEn,
      descriptionRu: addon.descriptionRu ?? "",
      descriptionEn: addon.descriptionEn ?? "",
      category: normalizedCategory,
      price: String(addon.price),
      unit: addon.unit,
      maxQuantity: String(addon.maxQuantity),
    });
    setShowAddonForm(true);
  }

  function applyAddonPreset(code: string) {
    const preset = ADDON_PRESETS.find(p => p.code === code);
    if (!preset) return;
    setAddonForm(f => ({
      ...f,
      code: preset.code,
      nameRu: preset.nameRu,
      nameEn: preset.nameEn,
      descriptionRu: preset.descriptionRu,
      descriptionEn: preset.descriptionEn,
      category: preset.category,
      unit: preset.unit,
    }));
  }

  async function saveAddon() {
    if (!addonForm.code || !addonForm.nameRu.trim() || !addonForm.nameEn.trim() || !addonForm.price || !addonForm.category.trim()) {
      toast.error(lang === "ru" ? "Выберите тип услуги и укажите цену" : "Select service type and set price");
      return;
    }
    setSavingAddon(true);
    try {
      const payload = {
        hotelId: form.hotelId ? parseInt(form.hotelId) : null,
        code: addonForm.code,
        nameRu: addonForm.nameRu.trim(),
        nameEn: addonForm.nameEn.trim(),
        descriptionRu: addonForm.descriptionRu.trim() || null,
        descriptionEn: addonForm.descriptionEn.trim() || null,
        icon: null,
        category: addonForm.category.trim(),
        price: parseFloat(addonForm.price),
        unit: addonForm.unit,
        maxQuantity: parseInt(addonForm.maxQuantity) || 1,
      };
      if (editingAddonId != null) {
        await customFetch(`/api/booking-addons/${editingAddonId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        });
        toast.success(lang === "ru" ? "Услуга обновлена" : "Addon updated");
      } else {
        await customFetch(`/api/booking-addons`, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        });
        toast.success(lang === "ru" ? "Услуга добавлена" : "Addon added");
      }
      setEditingAddonId(null);
      setAddonForm(emptyAddonForm());
      setShowAddonForm(false);
      await loadAddons(form.hotelId);
    } catch (e: any) {
      toast.error(e?.message || (lang === "ru" ? "Ошибка сохранения услуги" : "Failed to save addon"));
    } finally {
      setSavingAddon(false);
    }
  }

  async function deleteAddon(addonId: number) {
    try {
      await customFetch(`/api/booking-addons/${addonId}`, { method: "DELETE" });
      toast.success(lang === "ru" ? "Услуга удалена" : "Addon deleted");
      await loadAddons(form.hotelId);
    } catch (e: any) {
      toast.error(e?.message || (lang === "ru" ? "Ошибка удаления" : "Delete failed"));
    }
  }

  const roomTypeLabel = (type: string) => {
    const t = ROOM_TYPES.find(r => r.value === type);
    return t ? (lang === "ru" ? t.labelRu : t.labelEn) : type;
  };

  const setPlanField = <K extends keyof RatePlanForm>(k: K, v: RatePlanForm[K]) =>
    setRatePlanForm(f => ({ ...f, [k]: v }));
  const setAddonField = <K extends keyof AddonForm>(k: K, v: AddonForm[K]) =>
    setAddonForm(f => ({ ...f, [k]: v }));

  const TABS = [
    { value: "basic", label: lang === "ru" ? "Основное" : "Basic" },
    { value: "desc", label: lang === "ru" ? "Описание" : "Description" },
    { value: "photos", label: lang === "ru" ? "Фото" : "Photos" },
    { value: "amenities", label: lang === "ru" ? "Удобства" : "Amenities" },
    { value: "rates", label: lang === "ru" ? "Тарифы" : "Rates" },
    { value: "addons", label: lang === "ru" ? "Услуги" : "Services" },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle>{lang === "ru" ? "Управление номерами" : "Manage Rooms"}</CardTitle>
              <CardDescription>{lang === "ru" ? "Добавляйте, редактируйте и удаляйте номера отелей." : "Add, edit and delete hotel rooms."}</CardDescription>
            </div>
            <Button onClick={openCreate} className="gap-2 shrink-0">
              <Plus className="h-4 w-4" />
              {lang === "ru" ? "Добавить номер" : "Add Room"}
            </Button>
          </div>
          <div className="mt-2 max-w-xs">
            <Input
              placeholder={lang === "ru" ? "Поиск по названию отеля..." : "Search by hotel name..."}
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{lang === "ru" ? "Тип" : "Type"}</TableHead>
                  <TableHead>{lang === "ru" ? "Отель" : "Hotel"}</TableHead>
                  <TableHead>{lang === "ru" ? "Цена / ночь" : "Price / night"}</TableHead>
                  <TableHead>{lang === "ru" ? "Всего" : "Total"}</TableHead>
                  <TableHead>{lang === "ru" ? "Действия" : "Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingRooms ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">{lang === "ru" ? "Загрузка..." : "Loading..."}</TableCell></TableRow>
                ) : paged.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">{lang === "ru" ? "Нет номеров" : "No rooms"}</TableCell></TableRow>
                ) : paged.map((room: any) => (
                  <TableRow key={room.id}>
                    <TableCell>
                      <Link href={`/hotels/${room.hotelId}/rooms/${room.id}`}>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">{roomTypeLabel(room.type)}</Badge>
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <Link href={`/hotels/${room.hotelId}`} className="hover:underline hover:text-primary transition-colors">
                        {room.hotelName}
                      </Link>
                    </TableCell>
                    <TableCell className="font-medium">{formatPrice(room.price)}</TableCell>
                    <TableCell>{room.totalRooms}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="gap-1" onClick={() => openEdit(room)}>
                          <Pencil className="h-3.5 w-3.5" />
                          {lang === "ru" ? "Изменить" : "Edit"}
                        </Button>
                        <Button size="sm" variant="destructive" className="gap-1" onClick={() => setDeleteDialog({ open: true, room })}>
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

      {/* Room Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[95vw] max-w-5xl max-h-[90vh] flex flex-col gap-0 p-0">
          <DialogHeader className="px-8 pt-7 pb-4 shrink-0 border-b">
            <DialogTitle className="text-xl">{editingRoom ? (lang === "ru" ? "Редактировать номер" : "Edit Room") : (lang === "ru" ? "Добавить номер" : "Add Room")}</DialogTitle>
            <DialogDescription>{lang === "ru" ? "Заполните информацию о номере." : "Fill in room details."}</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="flex flex-col h-full">
              <div className="px-8 pt-4 shrink-0 border-b">
                <TabsList className="flex gap-1 flex-wrap h-auto bg-transparent p-0">
                  {TABS.map(({ value, label }) => {
                    const hasError =
                      (value === "basic" && (formErrors.hotelId || formErrors.type || formErrors.price)) ||
                      (value === "desc" && (formErrors.description_ru || formErrors.description_en));
                    return (
                      <TabsTrigger
                        key={value}
                        value={value}
                        disabled={!editingRoom && allTypesTaken && value !== "basic"}
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 pb-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {label}
                        {hasError && <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-destructive" />}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto px-8 py-6">

                {/* BASIC TAB */}
                <TabsContent value="basic" className="mt-0 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className={formErrors.hotelId ? "text-destructive" : ""}>{lang === "ru" ? "Отель *" : "Hotel *"}</Label>
                      {editingRoom ? (
                        <Input
                          disabled
                          value={((hotels ?? []) as any[]).find((h: any) => String(h.id) === form.hotelId)?.name ?? form.hotelId}
                        />
                      ) : (
                        <div className="relative">
                          <Input
                            value={hotelSearch}
                            onChange={e => { setHotelSearch(e.target.value); setHotelDropdownOpen(true); }}
                            onFocus={() => setHotelDropdownOpen(true)}
                            onBlur={() => setTimeout(() => setHotelDropdownOpen(false), 150)}
                            placeholder={lang === "ru" ? "Начните вводить название отеля..." : "Start typing hotel name..."}
                            className={formErrors.hotelId && !form.hotelId ? "border-destructive focus-visible:ring-destructive" : ""}
                          />
                          {form.hotelId && !hotelDropdownOpen && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {lang === "ru" ? "Выбран: " : "Selected: "}
                              {((hotels ?? []) as any[]).find((h: any) => String(h.id) === form.hotelId)?.name}
                            </p>
                          )}
                          {hotelDropdownOpen && (
                            <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-md max-h-52 overflow-y-auto">
                              {((hotels ?? []) as any[])
                                .filter((h: any) => !hotelSearch || h.name.toLowerCase().includes(hotelSearch.toLowerCase()))
                                .slice(0, 12)
                                .map((h: any) => (
                                  <button
                                    key={h.id}
                                    type="button"
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                                    onMouseDown={() => {
                                      setField("hotelId", String(h.id));
                                      setHotelSearch(h.name);
                                      setHotelDropdownOpen(false);
                                      loadAddons(String(h.id));
                                      loadTakenTypes(String(h.id)).then(taken => {
                                        const avail = ROOM_TYPES.filter(t => !taken.includes(t.value));
                                        if (avail.length > 0) setField("type", avail[0].value);
                                      });
                                    }}
                                  >
                                    {h.name}
                                  </button>
                                ))}
                              {((hotels ?? []) as any[]).filter((h: any) => !hotelSearch || h.name.toLowerCase().includes(hotelSearch.toLowerCase())).length === 0 && (
                                <p className="px-3 py-2 text-sm text-muted-foreground">
                                  {lang === "ru" ? "Ничего не найдено" : "No hotels found"}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className={formErrors.type ? "text-destructive" : ""}>{lang === "ru" ? "Тип номера *" : "Room Type *"}</Label>
                      <Select
                        value={form.type}
                        onValueChange={v => { setField("type", v); setFormErrors(prev => ({ ...prev, type: false })); }}
                        disabled={!!editingRoom || (!editingRoom && allTypesTaken)}
                      >
                        <SelectTrigger className={formErrors.type && !form.type ? "border-destructive" : ""}><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {(editingRoom ? ROOM_TYPES : availableTypes).map(t => (
                            <SelectItem key={t.value} value={t.value}>
                              {lang === "ru" ? t.labelRu : t.labelEn}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {editingRoom && (
                        <p className="text-xs text-muted-foreground">{lang === "ru" ? "Тип нельзя изменить после создания" : "Type cannot be changed after creation"}</p>
                      )}
                      {!editingRoom && form.hotelId && !allTypesTaken && takenTypes.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {lang === "ru"
                            ? `Занято ${takenTypes.length} из 4 типов. Доступно: ${availableTypes.map(t => t.labelRu).join(", ")}`
                            : `${takenTypes.length} of 4 types taken. Available: ${availableTypes.map(t => t.labelEn).join(", ")}`}
                        </p>
                      )}
                      {!editingRoom && form.hotelId && allTypesTaken && (
                        <p className="text-xs text-destructive font-medium">
                          {lang === "ru"
                            ? "Все 4 типа номеров уже добавлены для этого отеля."
                            : "All 4 room types are already added for this hotel."}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label className={formErrors.price ? "text-destructive" : ""}>{lang === "ru" ? "Цена / ночь (USD) *" : "Price / night (USD) *"}</Label>
                      <Input type="number" value={form.price} onChange={e => { setField("price", e.target.value); if (e.target.value) setFormErrors(prev => ({ ...prev, price: false })); }} placeholder="250" min="1" disabled={!editingRoom && allTypesTaken} className={formErrors.price && !form.price ? "border-destructive focus-visible:ring-destructive" : ""} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>{lang === "ru" ? "Всего номеров" : "Total Rooms"}</Label>
                      <Input type="number" value={form.totalRooms} onChange={e => setField("totalRooms", e.target.value)} placeholder="5" min="1" disabled={!editingRoom && allTypesTaken} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>{lang === "ru" ? "Площадь (м²)" : "Size (sqm)"}</Label>
                      <Input type="number" value={form.sizeSqm} onChange={e => setField("sizeSqm", e.target.value)} placeholder="35" disabled={!editingRoom && allTypesTaken} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>{lang === "ru" ? "Вид из окна" : "View Type"}</Label>
                      <Select value={form.viewType || "__none"} onValueChange={v => setField("viewType", v === "__none" ? "" : v)} disabled={!editingRoom && allTypesTaken}>
                        <SelectTrigger><SelectValue placeholder={lang === "ru" ? "Не выбрано" : "None"} /></SelectTrigger>
                        <SelectContent>
                          {VIEW_TYPES.map(v => (
                            <SelectItem key={v.value} value={v.value}>
                              {lang === "ru" ? v.labelRu : v.labelEn}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <Checkbox id="soundproofing" checked={form.soundproofing} onCheckedChange={v => setField("soundproofing", !!v)} disabled={!editingRoom && allTypesTaken} />
                      <Label htmlFor="soundproofing" className={`cursor-pointer ${!editingRoom && allTypesTaken ? "opacity-50" : ""}`}>{lang === "ru" ? "Звукоизоляция" : "Soundproofing"}</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="nonSmoking" checked={form.nonSmoking} onCheckedChange={v => setField("nonSmoking", !!v)} disabled={!editingRoom && allTypesTaken} />
                      <Label htmlFor="nonSmoking" className={`cursor-pointer ${!editingRoom && allTypesTaken ? "opacity-50" : ""}`}>{lang === "ru" ? "Для некурящих" : "Non-smoking"}</Label>
                    </div>
                  </div>
                </TabsContent>

                {/* DESCRIPTION TAB */}
                <TabsContent value="desc" className="mt-0 space-y-3">
                  <h4 className="font-medium text-sm">{lang === "ru" ? "Описание" : "Description"}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className={formErrors.description_ru ? "text-destructive" : ""}>🇷🇺 {lang === "ru" ? "Описание на русском *" : "Description (Russian) *"}</Label>
                      <Textarea
                        value={form.description_ru}
                        onChange={e => { setField("description_ru", e.target.value); if (e.target.value.trim()) setFormErrors(prev => ({ ...prev, description_ru: false })); }}
                        rows={8}
                        placeholder={lang === "ru" ? "Просторный номер с видом на город..." : "Spacious room with city views..."}
                        className={formErrors.description_ru ? "border-destructive focus-visible:ring-destructive" : ""}
                      />
                      {formErrors.description_ru && <p className="text-xs text-destructive">{lang === "ru" ? "Обязательное поле" : "Required"}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label className={formErrors.description_en ? "text-destructive" : ""}>🇬🇧 {lang === "ru" ? "Описание на английском *" : "Description (English) *"}</Label>
                      <Textarea
                        value={form.description_en}
                        onChange={e => { setField("description_en", e.target.value); if (e.target.value.trim()) setFormErrors(prev => ({ ...prev, description_en: false })); }}
                        rows={8}
                        placeholder="Spacious room with city views..."
                        className={formErrors.description_en ? "border-destructive focus-visible:ring-destructive" : ""}
                      />
                      {formErrors.description_en && <p className="text-xs text-destructive">{lang === "ru" ? "Обязательное поле" : "Required"}</p>}
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
                  {form.images.length === 0 && (
                    <p className="text-sm text-muted-foreground">{lang === "ru" ? "Нет фотографий" : "No photos added"}</p>
                  )}
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
                <TabsContent value="amenities" className="mt-0 space-y-6">
                  {/* Free Items */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">{lang === "ru" ? "Включено в стоимость (бесплатно)" : "Included in Rate (Free)"}</h4>
                    <div className="flex flex-wrap gap-2">
                      {FREE_ITEMS_CODES.map(code => {
                        const checked = form.freeItems.includes(code);
                        return (
                          <button
                            key={code}
                            type="button"
                            onClick={() => toggleFreeItem(code)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors cursor-pointer ${
                              checked
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background border-border hover:bg-muted"
                            }`}
                          >
                            {checked && <span className="text-xs">✓</span>}
                            {tCode(POLICY_CODE_LABELS, code, lang)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Separator />

                  {/* Amenities by Category */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">{lang === "ru" ? "Удобства по категориям" : "Amenities by Category"}</h4>
                    <div className="space-y-4">
                      {AMENITY_CATEGORIES.map(cat => {
                        const catMeta = ROOM_CATEGORY_LABELS[cat.category];
                        const catLabel = catMeta ? (lang === "ru" ? catMeta.ru : catMeta.en) : cat.category;
                        const selectedCount = form.amenitiesDetailed.find(a => a.category === cat.category)?.items.length ?? 0;
                        return (
                          <div key={cat.category} className="border rounded-lg p-4 space-y-3 bg-muted/10">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{catLabel}</span>
                              {selectedCount > 0 && (
                                <Badge variant="secondary" className="text-xs">{selectedCount}</Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {cat.items.map(code => {
                                const checked = isAmenityChecked(cat.category, code);
                                return (
                                  <button
                                    key={code}
                                    type="button"
                                    onClick={() => toggleAmenityItem(cat.category, code)}
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border transition-colors cursor-pointer ${
                                      checked
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-background border-border hover:bg-muted"
                                    }`}
                                  >
                                    {checked && <span>✓</span>}
                                    {tCode(ROOM_AMENITY_LABELS, code, lang)}
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

                {/* RATE PLANS TAB */}
                <TabsContent value="rates" className="mt-0 space-y-4">
                  <h4 className="font-medium text-sm">{lang === "ru" ? "Тарифные планы" : "Rate Plans"}</h4>

                  <>
                      {/* Existing Plans */}
                      {ratePlans.length > 0 && (
                        <div className="space-y-2">
                          {ratePlans.map(plan => (
                            <div
                              key={plan.id}
                              className={`border rounded-lg p-3 flex items-start justify-between gap-3 ${
                                editingPlanId === plan.id ? "border-primary bg-primary/5" : "bg-muted/20"
                              }`}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-medium text-sm">{plan.nameRu}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {plan.priceModifier > 0
                                      ? `+${Math.round(plan.priceModifier * 100)}%`
                                      : plan.priceModifier < 0
                                      ? `${Math.round(plan.priceModifier * 100)}%`
                                      : lang === "ru" ? "Без наценки" : "No surcharge"}
                                  </Badge>
                                  {plan.includesBreakfast && <Badge variant="secondary" className="text-xs">{lang === "ru" ? "Завтрак" : "Breakfast"}</Badge>}
                                  {plan.includesDinner && <Badge variant="secondary" className="text-xs">{lang === "ru" ? "Ужин" : "Dinner"}</Badge>}
                                  {plan.refundable
                                    ? <Badge variant="secondary" className="text-xs text-green-700 dark:text-green-400">{lang === "ru" ? "Возвратный" : "Refundable"}</Badge>
                                    : <Badge variant="outline" className="text-xs text-destructive">{lang === "ru" ? "Невозвратный" : "Non-refundable"}</Badge>}
                                </div>
                              </div>
                              <div className="flex gap-1 shrink-0">
                                <Button
                                  size="sm" variant="ghost" className="h-7 w-7 p-0"
                                  onClick={() => startEditPlan(plan)}
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive"
                                  onClick={() => deletePlan(plan.id)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {ratePlans.length === 0 && !showPlanForm && (
                        <p className="text-sm text-muted-foreground">{lang === "ru" ? "Нет тарифов" : "No rate plans yet"}</p>
                      )}

                      {!showPlanForm && (
                        <Button
                          size="sm" variant="outline" className="gap-1.5"
                          onClick={() => { setEditingPlanId(null); setRatePlanForm(emptyRatePlanForm()); setShowPlanForm(true); }}
                        >
                          <Plus className="h-3.5 w-3.5" />
                          {lang === "ru" ? "Добавить тариф" : "Add Rate Plan"}
                        </Button>
                      )}

                      {showPlanForm && (
                        <>
                          <Separator />
                          <div className="space-y-4 rounded-lg border p-4 bg-muted/10">
                            <h5 className="text-sm font-medium">
                              {editingPlanId != null
                                ? (lang === "ru" ? "Редактировать тариф" : "Edit Rate Plan")
                                : (lang === "ru" ? "Новый тариф" : "New Rate Plan")}
                            </h5>

                            <div className="space-y-1.5">
                              <Label className="text-xs">{lang === "ru" ? "Тип тарифа *" : "Rate Plan Type *"}</Label>
                              <Select
                                value={ratePlanForm.code}
                                onValueChange={v => applyRatePlanPreset(v)}
                              >
                                <SelectTrigger className="h-9">
                                  <SelectValue placeholder={lang === "ru" ? "Выберите тип тарифа..." : "Select rate plan type..."} />
                                </SelectTrigger>
                                <SelectContent>
                                  {RATE_PLAN_PRESETS.map(p => (
                                    <SelectItem key={p.code} value={p.code}>
                                      {lang === "ru" ? p.nameRu : p.nameEn}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1.5">
                                <Label className="text-xs">🇷🇺 {lang === "ru" ? "Название (RU)" : "Name (RU)"}</Label>
                                <Input className="h-8" value={ratePlanForm.nameRu} onChange={e => setPlanField("nameRu", e.target.value)} placeholder="Стандартный" />
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-xs">🇬🇧 {lang === "ru" ? "Название (EN)" : "Name (EN)"}</Label>
                                <Input className="h-8" value={ratePlanForm.nameEn} onChange={e => setPlanField("nameEn", e.target.value)} placeholder="Standard" />
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-xs">{lang === "ru" ? "Наценка к цене (%)" : "Price surcharge (%)"}</Label>
                                <Input className="h-8" type="number" value={ratePlanForm.priceModifier} onChange={e => setPlanField("priceModifier", e.target.value)} placeholder="0" />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1.5">
                                <Label className="text-xs">🇷🇺 {lang === "ru" ? "Описание (RU)" : "Description (RU)"}</Label>
                                <Textarea className="text-xs" value={ratePlanForm.descriptionRu} onChange={e => setPlanField("descriptionRu", e.target.value)} rows={2} />
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-xs">🇬🇧 {lang === "ru" ? "Описание (EN)" : "Description (EN)"}</Label>
                                <Textarea className="text-xs" value={ratePlanForm.descriptionEn} onChange={e => setPlanField("descriptionEn", e.target.value)} rows={2} />
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-4">
                              {(() => {
                                const currentPreset = RATE_PLAN_PRESETS.find(p => p.code === ratePlanForm.code);
                                const isNonRefundable = currentPreset ? !currentPreset.refundable : false;
                                const fields: [keyof RatePlanForm, string][] = [
                                  ...(!isNonRefundable ? [["refundable", lang === "ru" ? "Возврат средств" : "Refundable"] as [keyof RatePlanForm, string]] : []),
                                  ["includesBreakfast", lang === "ru" ? "Завтрак включён" : "Breakfast included"],
                                  ["includesDinner", lang === "ru" ? "Ужин включён" : "Dinner included"],
                                ];
                                return fields.map(([field, label]) => (
                                  <div key={field} className="flex items-center gap-2">
                                    <Checkbox
                                      id={`plan-${field}`}
                                      checked={ratePlanForm[field] as boolean}
                                      onCheckedChange={v => setPlanField(field, !!v as any)}
                                    />
                                    <Label htmlFor={`plan-${field}`} className="text-xs cursor-pointer">{label}</Label>
                                  </div>
                                ));
                              })()}
                            </div>

                            <div className="flex gap-2">
                              <Button size="sm" onClick={savePlan} disabled={savingPlan} className="gap-1">
                                <Save className="h-3.5 w-3.5" />
                                {savingPlan ? (lang === "ru" ? "Сохранение..." : "Saving...") : (lang === "ru" ? "Сохранить тариф" : "Save plan")}
                              </Button>
                              <Button
                                size="sm" variant="outline"
                                onClick={() => { setEditingPlanId(null); setRatePlanForm(emptyRatePlanForm()); setShowPlanForm(false); }}
                              >
                                {lang === "ru" ? "Отмена" : "Cancel"}
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                  </>
                </TabsContent>

                {/* ADD-ONS TAB */}
                <TabsContent value="addons" className="mt-0 space-y-4">
                  <h4 className="font-medium text-sm">{lang === "ru" ? "Дополнительные услуги" : "Additional Services"}</h4>

                  <>

                  {/* Existing Addons */}
                  {addons.length > 0 && (
                    <div className="space-y-2">
                      {addons.map(addon => (
                        <div
                          key={addon.id}
                          className={`border rounded-lg p-3 flex items-start justify-between gap-3 ${
                            editingAddonId === addon.id ? "border-primary bg-primary/5" : "bg-muted/20"
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-sm">{lang === "ru" ? addon.nameRu : addon.nameEn}</span>
                              <Badge variant="outline" className="text-xs">{formatPrice(addon.price)}</Badge>

                              <Badge variant="outline" className="text-xs">
                                {ADDON_UNITS.find(u => u.value === addon.unit)?.[lang === "ru" ? "labelRu" : "labelEn"] ?? addon.unit}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <Button
                              size="sm" variant="ghost" className="h-7 w-7 p-0"
                              onClick={() => startEditAddon(addon)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive"
                              onClick={() => deleteAddon(addon.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {addons.length === 0 && !showAddonForm && (
                    <p className="text-sm text-muted-foreground">{lang === "ru" ? "Нет услуг" : "No services yet"}</p>
                  )}

                  {!showAddonForm && (
                    <Button
                      size="sm" variant="outline" className="gap-1.5"
                      onClick={() => { setEditingAddonId(null); setAddonForm(emptyAddonForm()); setShowAddonForm(true); }}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      {lang === "ru" ? "Добавить услугу" : "Add Service"}
                    </Button>
                  )}

                  {showAddonForm && (
                    <>
                      <Separator />
                      <div className="space-y-4 rounded-lg border p-4 bg-muted/10">
                        <h5 className="text-sm font-medium">
                          {editingAddonId != null
                            ? (lang === "ru" ? "Редактировать услугу" : "Edit Service")
                            : (lang === "ru" ? "Новая услуга" : "New Service")}
                        </h5>

                        <div className="space-y-1.5">
                          <Label className="text-xs">{lang === "ru" ? "Тип услуги *" : "Service Type *"}</Label>
                          {editingAddonId != null ? (
                            <div className="h-9 flex items-center px-3 text-sm border rounded-md bg-muted/50 text-foreground">
                              {addonForm.nameRu || addonForm.code}
                            </div>
                          ) : (
                            <Select
                              value={addonForm.code}
                              onValueChange={v => applyAddonPreset(v)}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder={lang === "ru" ? "Выберите тип услуги..." : "Select service type..."} />
                              </SelectTrigger>
                              <SelectContent className="max-h-64 overflow-y-auto">
                                {ADDON_PRESETS.map(p => (
                                  <SelectItem key={p.code} value={p.code}>
                                    {lang === "ru" ? p.nameRu : p.nameEn}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-xs">🇷🇺 {lang === "ru" ? "Название (RU)" : "Name (RU)"}</Label>
                            <Input className="h-8" value={addonForm.nameRu} onChange={e => setAddonField("nameRu", e.target.value)} placeholder="Завтрак" />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs">🇬🇧 {lang === "ru" ? "Название (EN)" : "Name (EN)"}</Label>
                            <Input className="h-8" value={addonForm.nameEn} onChange={e => setAddonField("nameEn", e.target.value)} placeholder="Breakfast" />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs">{lang === "ru" ? "Категория" : "Category"}</Label>
                            <Select value={addonForm.category} onValueChange={v => setAddonField("category", v)}>
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder={lang === "ru" ? "Категория" : "Category"} />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(ADDON_CATEGORY_LABELS).map(([key, labels]) => (
                                  <SelectItem key={key} value={key}>{lang === "ru" ? labels.ru : labels.en}</SelectItem>
                                ))}
                                {addonForm.category && !ADDON_CATEGORY_LABELS[addonForm.category] && (
                                  <SelectItem value={addonForm.category}>{addonForm.category}</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs">{lang === "ru" ? "Цена (USD) *" : "Price (USD) *"}</Label>
                            <Input className="h-8" type="number" value={addonForm.price} onChange={e => setAddonField("price", e.target.value)} placeholder="25" />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs">{lang === "ru" ? "Единица тарификации" : "Billing unit"}</Label>
                            <Select value={addonForm.unit} onValueChange={v => setAddonField("unit", v)}>
                              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {ADDON_UNITS.map(u => <SelectItem key={u.value} value={u.value}>{lang === "ru" ? u.labelRu : u.labelEn}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs">{lang === "ru" ? "Макс. количество" : "Max quantity"}</Label>
                            <Input className="h-8" type="number" value={addonForm.maxQuantity} onChange={e => setAddonField("maxQuantity", e.target.value)} placeholder="1" min="1" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-xs">🇷🇺 {lang === "ru" ? "Описание (RU)" : "Description (RU)"}</Label>
                            <Textarea className="text-xs" value={addonForm.descriptionRu} onChange={e => setAddonField("descriptionRu", e.target.value)} rows={2} />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs">🇬🇧 {lang === "ru" ? "Описание (EN)" : "Description (EN)"}</Label>
                            <Textarea className="text-xs" value={addonForm.descriptionEn} onChange={e => setAddonField("descriptionEn", e.target.value)} rows={2} />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" onClick={saveAddon} disabled={savingAddon} className="gap-1">
                            <Save className="h-3.5 w-3.5" />
                            {savingAddon ? (lang === "ru" ? "Сохранение..." : "Saving...") : (lang === "ru" ? "Сохранить услугу" : "Save service")}
                          </Button>
                          <Button
                            size="sm" variant="outline"
                            onClick={() => { setEditingAddonId(null); setAddonForm(emptyAddonForm()); setShowAddonForm(false); }}
                          >
                            {lang === "ru" ? "Отмена" : "Cancel"}
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                  </>
                </TabsContent>

              </div>
            </Tabs>
          </div>

          <DialogFooter className="px-8 py-5 border-t shrink-0 bg-muted/30">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>{lang === "ru" ? "Отмена" : "Cancel"}</Button>
            <Button onClick={handleSave} disabled={saving || (!editingRoom && allTypesTaken)} title={!editingRoom && allTypesTaken ? (lang === "ru" ? "Все 4 типа уже заняты" : "All 4 types are taken") : undefined}>
              {saving ? (lang === "ru" ? "Сохранение..." : "Saving...") : (lang === "ru" ? "Сохранить" : "Save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialog.open} onOpenChange={open => !open && setDeleteDialog({ open: false, room: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{lang === "ru" ? "Удалить номер?" : "Delete Room?"}</DialogTitle>
            <DialogDescription>
              {lang === "ru"
                ? `Номер «${deleteDialog.room ? roomTypeLabel(deleteDialog.room.type) : ""}» в ${deleteDialog.room?.hotelName} будет удалён. Действие нельзя отменить.`
                : `Room "${deleteDialog.room ? roomTypeLabel(deleteDialog.room.type) : ""}" at ${deleteDialog.room?.hotelName} will be permanently deleted.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, room: null })}>{lang === "ru" ? "Отмена" : "Cancel"}</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? (lang === "ru" ? "Удаление..." : "Deleting...") : (lang === "ru" ? "Удалить" : "Delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
