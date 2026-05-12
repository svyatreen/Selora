import { useEffect, useMemo, useState, useCallback } from "react";
import { useSearch, useLocation } from "wouter";
import { useListHotels, getListHotelsQueryKey } from "@/api";
import { Layout } from "@/components/layout/Layout";
import { HotelCard } from "@/components/ui/hotel-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useDebounce } from "@/hooks/use-debounce";
import { useTranslation } from "react-i18next";

type HotelsFiltersState = {
  search: string;
  priceRange: number[];
  stars: number[];
  propertyTypes: string[];
  cities: string[];
  selectedAmenities: string[];
  popularFacilities: string[];
  mealPlans: string[];
  roomFeatures: string[];
  accessibility: string[];
  maxDistance?: number;
  sortBy: "price" | "rating" | "popularity";
  sortOrder: "asc" | "desc";
};

const DEFAULT_FILTERS: HotelsFiltersState = {
  search: "",
  priceRange: [0, 1000],
  stars: [],
  propertyTypes: [],
  cities: [],
  selectedAmenities: [],
  popularFacilities: [],
  mealPlans: [],
  roomFeatures: [],
  accessibility: [],
  maxDistance: undefined,
  sortBy: "popularity",
  sortOrder: "desc",
};

// Keep filters while app is open; reset after full page reload.
let hotelsFiltersMemory: HotelsFiltersState | null = null;

const AMENITIES_LIST = [
  "WiFi", "Pool", "Indoor Pool", "Spa", "Gym", "Sauna", "Hot Tub",
  "Restaurant", "Bar", "Room Service",
  "Parking", "Airport Shuttle", "24-hour Reception", "Concierge", "Laundry",
  "Beach Access", "Garden", "Terrace", "Balcony", "Sea View",
  "Family Rooms", "Kids Club", "Babysitting", "Pet Friendly",
  "Wheelchair Access", "Elevator", "Air Conditioning", "Non-Smoking",
  "Business Center", "Meeting Rooms", "Tennis", "Golf", "Water Sports",
];

const PROPERTY_TYPES = ["Hotel", "Resort", "Villa", "Apartment", "Boutique", "Hostel", "B&B", "Guest House"];

const MEAL_PLANS: Array<{ label: string; match: string[] }> = [
  { label: "Breakfast included", match: ["Breakfast"] },
  { label: "Half board", match: ["Half Board", "Half-Board"] },
  { label: "Full board", match: ["Full Board", "Full-Board"] },
  { label: "All-inclusive", match: ["All-Inclusive", "All Inclusive"] },
  { label: "Room service", match: ["Room Service"] },
  { label: "Restaurant on-site", match: ["Restaurant"] },
  { label: "Bar / Lounge", match: ["Bar", "Lounge"] },
  { label: "Vegetarian options", match: ["Vegetarian"] },
  { label: "Special diet menus", match: ["Special Diet", "Gluten-Free"] },
  { label: "Kids' meals", match: ["Kids Meal", "Children's Menu"] },
];

const POPULAR_FACILITIES: Array<{ label: string; match: string[] }> = [
  { label: "WiFi", match: ["WiFi"] },
  { label: "Parking", match: ["Parking"] },
  { label: "Swimming pool", match: ["Pool", "Indoor Pool"] },
  { label: "Spa & wellness", match: ["Spa", "Sauna", "Hot Tub"] },
  { label: "Fitness center", match: ["Gym"] },
  { label: "Airport shuttle", match: ["Airport Shuttle"] },
  { label: "Pet friendly", match: ["Pet Friendly"] },
  { label: "Family friendly", match: ["Family Rooms", "Kids Club", "Babysitting"] },
];

const ROOM_FEATURES: Array<{ label: string; match: string[] }> = [
  { label: "Sea view", match: ["Sea View"] },
  { label: "Balcony", match: ["Balcony"] },
  { label: "Air conditioning", match: ["Air Conditioning"] },
  { label: "Non-smoking", match: ["Non-Smoking"] },
];

const ACCESSIBILITY: Array<{ label: string; match: string[] }> = [
  { label: "Wheelchair accessible", match: ["Wheelchair Access"] },
  { label: "Elevator", match: ["Elevator"] },
];

const DISTANCE_OPTIONS = [
  { label: "Less than 1 km", max: 1 },
  { label: "Less than 3 km", max: 3 },
  { label: "Less than 5 km", max: 5 },
  { label: "Less than 10 km", max: 10 },
];

function hotelHasAny(hotelAmenities: any, matches: string[]): boolean {
  if (!Array.isArray(hotelAmenities)) return false;
  const lower = hotelAmenities.map((a: string) => String(a).toLowerCase());
  return matches.some((m) => lower.some((a: string) => a.includes(m.toLowerCase())));
}

function inferPropertyType(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("resort")) return "Resort";
  if (n.includes("villa")) return "Villa";
  if (n.includes("apartment") || n.includes("apt")) return "Apartment";
  if (n.includes("boutique")) return "Boutique";
  if (n.includes("hostel")) return "Hostel";
  if (n.includes("b&b") || n.includes("bed and breakfast")) return "B&B";
  if (n.includes("guest house") || n.includes("guesthouse")) return "Guest House";
  return "Hotel";
}

// Stable pseudo-distance derived from id so it doesn't jump on re-render
function pseudoDistance(id: number): number {
  return Math.round(((id * 73) % 95) / 10 * 10) / 10;
}

function toggleArr<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export default function Hotels() {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const searchString = useSearch();
  const [, navigate] = useLocation();

  // Parse URL params
  const urlParams = useMemo(() => new URLSearchParams(searchString), [searchString]);
  const cityFromUrl = urlParams.get("city") || "";

  // Initialize from URL or memory
  const initialFilters = hotelsFiltersMemory ?? DEFAULT_FILTERS;
  const initialSearch = cityFromUrl || initialFilters.search;

  const [search, setSearch] = useState(initialSearch);
  const debouncedSearch = useDebounce(search, 400);

  const [priceRange, setPriceRange] = useState<number[]>(initialFilters.priceRange);
  const debouncedPrice = useDebounce(priceRange, 400);

  const [stars, setStars] = useState<number[]>(initialFilters.stars);
  const [propertyTypes, setPropertyTypes] = useState<string[]>(initialFilters.propertyTypes);
  const [cities, setCities] = useState<string[]>(initialFilters.cities);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialFilters.selectedAmenities);
  const [popularFacilities, setPopularFacilities] = useState<string[]>(initialFilters.popularFacilities);
  const [mealPlans, setMealPlans] = useState<string[]>(initialFilters.mealPlans);
  const [roomFeatures, setRoomFeatures] = useState<string[]>(initialFilters.roomFeatures);
  const [accessibility, setAccessibility] = useState<string[]>(initialFilters.accessibility);
  const [maxDistance, setMaxDistance] = useState<number | undefined>(initialFilters.maxDistance);

  const [sortBy, setSortBy] = useState<"price" | "rating" | "popularity">(initialFilters.sortBy);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialFilters.sortOrder);

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sync URL with search state
  const updateUrl = useCallback((newSearch: string) => {
    const params = new URLSearchParams();
    if (newSearch.trim()) {
      params.set("city", newSearch.trim());
    }
    const newSearchString = params.toString();
    const newUrl = newSearchString ? `/hotels?${newSearchString}` : "/hotels";
    navigate(newUrl, { replace: true });
  }, [navigate]);

  // Update search from URL on mount and when URL changes
  useEffect(() => {
    if (cityFromUrl && cityFromUrl !== search) {
      setSearch(cityFromUrl);
    }
  }, [cityFromUrl]);

  // Update URL when debounced search changes
  useEffect(() => {
    updateUrl(search);
  }, [debouncedSearch, updateUrl]);

  const { data: rawHotels, isLoading } = useListHotels(
    {
      search: debouncedSearch || undefined,
      sortBy,
      sortOrder,
    },
    {
      query: {
        queryKey: getListHotelsQueryKey({
          search: debouncedSearch || undefined,
          sortBy,
          sortOrder,
        }),
      },
    }
  );

  const availableCities = useMemo(() => {
    const set = new Set<string>();
    rawHotels?.forEach((h: any) => set.add(h.city));
    return Array.from(set).sort();
  }, [rawHotels]);

  const filteredHotels = useMemo(() => {
    if (!rawHotels) return [];
    const filtered = rawHotels.filter((h: any) => {
      const price = h.minPrice ?? 0;
      if (h.minPrice != null) {
        if (price < debouncedPrice[0]) return false;
        if (debouncedPrice[1] < 1000 && price > debouncedPrice[1]) return false;
      }
      if (stars.length && !stars.includes(h.stars)) return false;
      if (cities.length && !cities.includes(h.city)) return false;
      if (propertyTypes.length && !propertyTypes.includes(inferPropertyType(h.name))) return false;
      if (selectedAmenities.length && !selectedAmenities.every((a) => hotelHasAny(h.amenities, [a]))) return false;
      if (popularFacilities.length) {
        const ok = popularFacilities.every((label) => {
          const def = POPULAR_FACILITIES.find((p) => p.label === label);
          return def ? hotelHasAny(h.amenities, def.match) : true;
        });
        if (!ok) return false;
      }
      if (mealPlans.length) {
        const ok = mealPlans.every((label) => {
          const def = MEAL_PLANS.find((p) => p.label === label);
          return def ? hotelHasAny(h.amenities, def.match) : true;
        });
        if (!ok) return false;
      }
      if (roomFeatures.length) {
        const ok = roomFeatures.every((label) => {
          const def = ROOM_FEATURES.find((p) => p.label === label);
          return def ? hotelHasAny(h.amenities, def.match) : true;
        });
        if (!ok) return false;
      }
      if (accessibility.length) {
        const ok = accessibility.every((label) => {
          const def = ACCESSIBILITY.find((p) => p.label === label);
          return def ? hotelHasAny(h.amenities, def.match) : true;
        });
        if (!ok) return false;
      }
      if (maxDistance != null && pseudoDistance(h.id) > maxDistance) return false;
      return true;
    });

    if (sortBy === "popularity") {
      const direction = sortOrder === "asc" ? -1 : 1;
      return [...filtered].sort((a: any, b: any) => {
        const aPopular = a.popularBadge === "POPULAR_CHOICE" && a.stars >= 4 ? 1 : 0;
        const bPopular = b.popularBadge === "POPULAR_CHOICE" && b.stars >= 4 ? 1 : 0;
        if (aPopular !== bPopular) return (bPopular - aPopular) * direction;
        return (b.rating - a.rating) * direction;
      });
    }

    return filtered;
  }, [rawHotels, debouncedPrice, stars, cities,
      propertyTypes, selectedAmenities, popularFacilities, mealPlans, roomFeatures, accessibility, maxDistance, sortBy, sortOrder]);

  useEffect(() => {
    hotelsFiltersMemory = {
      search,
      priceRange,
      stars,
      propertyTypes,
      cities,
      selectedAmenities,
      popularFacilities,
      mealPlans,
      roomFeatures,
      accessibility,
      maxDistance,
      sortBy,
      sortOrder,
    };
  }, [
    search,
    priceRange,
    stars,
    propertyTypes,
    cities,
    selectedAmenities,
    popularFacilities,
    mealPlans,
    roomFeatures,
    accessibility,
    maxDistance,
    sortBy,
    sortOrder,
  ]);

  const clearFilters = () => {
    hotelsFiltersMemory = null;
    setSearch(DEFAULT_FILTERS.search);
    setPriceRange(DEFAULT_FILTERS.priceRange);
    setStars(DEFAULT_FILTERS.stars);
    setPropertyTypes(DEFAULT_FILTERS.propertyTypes);
    setCities(DEFAULT_FILTERS.cities);
    setSelectedAmenities(DEFAULT_FILTERS.selectedAmenities);
    setPopularFacilities(DEFAULT_FILTERS.popularFacilities);
    setMealPlans(DEFAULT_FILTERS.mealPlans);
    setRoomFeatures(DEFAULT_FILTERS.roomFeatures);
    setAccessibility(DEFAULT_FILTERS.accessibility);
    setMaxDistance(DEFAULT_FILTERS.maxDistance);
    setSortBy(DEFAULT_FILTERS.sortBy);
    setSortOrder(DEFAULT_FILTERS.sortOrder);
  };

  const activeFiltersCount =
    (search ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0) +
    stars.length + propertyTypes.length + cities.length +
    selectedAmenities.length + popularFacilities.length + mealPlans.length +
    roomFeatures.length + accessibility.length + (maxDistance != null ? 1 : 0);

  return (
    <Layout>
      <div className="bg-secondary/30 py-8 border-b">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-4">{t("hotels.pageTitle")}</h1>
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={t("hotels.searchPlaceholder")}
              className="pl-10 h-12 bg-background text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filters Toggle */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <Button variant="outline" onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}>
              <Filter className="mr-2 h-4 w-4" />
              {t("hotels.filters")} {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{t("hotels.sortBy")}</span>
              <Select
                value={`${sortBy}-${sortOrder}`}
                onValueChange={(val) => {
                  const [s, o] = val.split("-");
                  setSortBy(s as any);
                  setSortOrder(o as any);
                }}
              >
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity-desc">{t("hotels.sort.popular")}</SelectItem>
                  <SelectItem value="price-asc">{t("hotels.sort.priceAsc")}</SelectItem>
                  <SelectItem value="price-desc">{t("hotels.sort.priceDesc")}</SelectItem>
                  <SelectItem value="rating-desc">{t("hotels.sort.ratingDesc")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sidebar Filters */}
          <aside
            className={`w-full lg:w-72 flex-shrink-0 ${isMobileFiltersOpen ? "block" : "hidden lg:block"}`}
          >
            <div className="lg:sticky lg:top-24 rounded-xl border bg-card">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold">{t("hotels.filters")}</h2>
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </div>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 px-2 text-xs">
                    <X className="h-3 w-3 mr-1" />
                    {t("hotels.clearAll")}
                  </Button>
                )}
              </div>

              <ScrollArea className="lg:h-[calc(100vh-12rem)]">
                <Accordion
                  type="multiple"
                  defaultValue={["price", "popular", "stars", "amenities"]}
                  className="px-4"
                >
                  {/* Price */}
                  <AccordionItem value="price">
                    <AccordionTrigger className="text-sm font-semibold">{t("hotels.filter.price")}</AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-3 px-1">
                        <Slider
                          min={0}
                          max={1000}
                          step={25}
                          value={priceRange}
                          onValueChange={setPriceRange}
                          className="mb-4"
                        />
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{formatPrice(priceRange[0], { decimals: 0 })}</span>
                          <span>
                            {formatPrice(priceRange[1], { decimals: 0 })}
                            {priceRange[1] === 1000 ? "+" : ""}
                          </span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Popular facilities */}
                  <AccordionItem value="popular">
                    <AccordionTrigger className="text-sm font-semibold">{t("hotels.filter.popular")}</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-1">
                        {POPULAR_FACILITIES.map((f) => (
                          <label key={f.label} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={popularFacilities.includes(f.label)}
                              onCheckedChange={() => setPopularFacilities((p) => toggleArr(p, f.label))}
                            />
                            <span className="text-sm">{t(`hotels.facility.${f.label}`, { defaultValue: f.label })}</span>
                          </label>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Stars */}
                  <AccordionItem value="stars">
                    <AccordionTrigger className="text-sm font-semibold">{t("hotels.filter.stars")}</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-1">
                        {[5, 4, 3, 2, 1].map((s) => (
                          <label key={s} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={stars.includes(s)}
                              onCheckedChange={() => setStars((p) => toggleArr(p, s))}
                            />
                            <span className="text-sm">{t("hotels.stars", { count: s })}</span>
                          </label>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Property type */}
                  <AccordionItem value="type">
                    <AccordionTrigger className="text-sm font-semibold">{t("hotels.filter.type")}</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-1">
                        {PROPERTY_TYPES.map((pt) => (
                          <label key={pt} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={propertyTypes.includes(pt)}
                              onCheckedChange={() => setPropertyTypes((p) => toggleArr(p, pt))}
                            />
                            <span className="text-sm">{t(`hotels.propertyType.${pt}`, { defaultValue: pt })}</span>
                          </label>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* City */}
                  {availableCities.length > 0 && (
                    <AccordionItem value="city">
                      <AccordionTrigger className="text-sm font-semibold">{t("hotels.filter.city")}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pt-1 max-h-56 overflow-y-auto pr-1">
                          {availableCities.map((c) => (
                            <label key={c} className="flex items-center gap-2 cursor-pointer">
                              <Checkbox
                                checked={cities.includes(c)}
                                onCheckedChange={() => setCities((p) => toggleArr(p, c))}
                              />
                              <span className="text-sm">{c}</span>
                            </label>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Distance */}
                  <AccordionItem value="distance">
                    <AccordionTrigger className="text-sm font-semibold">{t("hotels.filter.distance")}</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-1">
                        {DISTANCE_OPTIONS.map((d) => (
                          <label key={d.label} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={maxDistance === d.max}
                              onCheckedChange={(checked) => setMaxDistance(checked ? d.max : undefined)}
                            />
                            <span className="text-sm">{t(`hotels.distance.lt${d.max}`, { defaultValue: d.label })}</span>
                          </label>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Meals */}
                  <AccordionItem value="meals">
                    <AccordionTrigger className="text-sm font-semibold">{t("hotels.filter.meals")}</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-1">
                        {MEAL_PLANS.map((m) => (
                          <label key={m.label} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={mealPlans.includes(m.label)}
                              onCheckedChange={() => setMealPlans((p) => toggleArr(p, m.label))}
                            />
                            <span className="text-sm">{t(`hotels.facility.${m.label}`, { defaultValue: m.label })}</span>
                          </label>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Room features */}
                  <AccordionItem value="rooms">
                    <AccordionTrigger className="text-sm font-semibold">{t("hotels.filter.rooms")}</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-1">
                        {ROOM_FEATURES.map((m) => (
                          <label key={m.label} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={roomFeatures.includes(m.label)}
                              onCheckedChange={() => setRoomFeatures((p) => toggleArr(p, m.label))}
                            />
                            <span className="text-sm">{t(`hotels.facility.${m.label}`, { defaultValue: m.label })}</span>
                          </label>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Accessibility */}
                  <AccordionItem value="access">
                    <AccordionTrigger className="text-sm font-semibold">{t("hotels.filter.access")}</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-1">
                        {ACCESSIBILITY.map((m) => (
                          <label key={m.label} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={accessibility.includes(m.label)}
                              onCheckedChange={() => setAccessibility((p) => toggleArr(p, m.label))}
                            />
                            <span className="text-sm">{t(`hotels.facility.${m.label}`, { defaultValue: m.label })}</span>
                          </label>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* All amenities */}
                  <AccordionItem value="amenities" className="border-b-0">
                    <AccordionTrigger className="text-sm font-semibold">{t("hotels.filter.amenities")}</AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-1 space-y-2 max-h-64 overflow-y-auto pr-1">
                        {AMENITIES_LIST.map((a) => (
                          <label key={a} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={selectedAmenities.includes(a)}
                              onCheckedChange={() => setSelectedAmenities((p) => toggleArr(p, a))}
                            />
                            <span className="text-sm">{t(`hotels.facility.${a}`, { defaultValue: a })}</span>
                          </label>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </ScrollArea>
            </div>
          </aside>

          {/* Results Area */}
          <div className="flex-1 min-w-0">
            <div className="hidden lg:flex items-center justify-between mb-6 pb-4 border-b">
              <p className="text-muted-foreground">
                {isLoading ? t("hotels.searching") : t("hotels.showing", { count: filteredHotels.length, total: rawHotels?.length || 0 })}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{t("hotels.sortBy")}</span>
                <Select
                  value={`${sortBy}-${sortOrder}`}
                  onValueChange={(val) => {
                    const [s, o] = val.split("-");
                    setSortBy(s as any);
                    setSortOrder(o as any);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity-desc">{t("hotels.sort.popular")}</SelectItem>
                    <SelectItem value="price-asc">{t("hotels.sort.priceAsc")}</SelectItem>
                    <SelectItem value="price-desc">{t("hotels.sort.priceDesc")}</SelectItem>
                    <SelectItem value="rating-desc">{t("hotels.sort.ratingDesc")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {stars.map((s) => (
                  <Badge key={`s-${s}`} variant="secondary" className="gap-1">
                    {s}★
                    <button onClick={() => setStars((p) => toggleArr(p, s))}><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
                {cities.map((c) => (
                  <Badge key={`c-${c}`} variant="secondary" className="gap-1">
                    {c}
                    <button onClick={() => setCities((p) => toggleArr(p, c))}><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
                {propertyTypes.map((pt) => (
                  <Badge key={`t-${pt}`} variant="secondary" className="gap-1">
                    {t(`hotels.propertyType.${pt}`, { defaultValue: pt })}
                    <button onClick={() => setPropertyTypes((p) => toggleArr(p, pt))}><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
                {popularFacilities.map((f) => (
                  <Badge key={`p-${f}`} variant="secondary" className="gap-1">
                    {t(`hotels.facility.${f}`, { defaultValue: f })}
                    <button onClick={() => setPopularFacilities((p) => toggleArr(p, f))}><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
                {mealPlans.map((m) => (
                  <Badge key={`m-${m}`} variant="secondary" className="gap-1">
                    {t(`hotels.facility.${m}`, { defaultValue: m })}
                    <button onClick={() => setMealPlans((p) => toggleArr(p, m))}><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
                {roomFeatures.map((m) => (
                  <Badge key={`rf-${m}`} variant="secondary" className="gap-1">
                    {t(`hotels.facility.${m}`, { defaultValue: m })}
                    <button onClick={() => setRoomFeatures((p) => toggleArr(p, m))}><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
                {accessibility.map((m) => (
                  <Badge key={`a-${m}`} variant="secondary" className="gap-1">
                    {t(`hotels.facility.${m}`, { defaultValue: m })}
                    <button onClick={() => setAccessibility((p) => toggleArr(p, m))}><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
                {selectedAmenities.map((a) => (
                  <Badge key={`am-${a}`} variant="secondary" className="gap-1">
                    {t(`hotels.facility.${a}`, { defaultValue: a })}
                    <button onClick={() => setSelectedAmenities((p) => toggleArr(p, a))}><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
                {maxDistance != null && (
                  <Badge variant="secondary" className="gap-1">
                    {t("hotels.withinKm", { km: maxDistance })}
                    <button onClick={() => setMaxDistance(undefined)}><X className="h-3 w-3" /></button>
                  </Badge>
                )}
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 rounded-xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : filteredHotels.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredHotels.map((hotel: any) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border mt-4">
                <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t("hotels.noMatchTitle")}</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  {t("hotels.noMatchHelp")}
                </p>
                <Button onClick={clearFilters} variant="outline">{t("hotels.clearAllFilters")}</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
