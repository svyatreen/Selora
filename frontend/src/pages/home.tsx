import { Layout } from "@/components/layout/Layout";
import { HotelCard } from "@/components/ui/hotel-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, CalendarDays, Users } from "lucide-react";
import { useGetHotelStats, getGetHotelStatsQueryKey } from "@/api";
import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@/api/custom-fetch";
import { useAuth } from "@/contexts/AuthContext";
import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

type RecentHotel = {
  id: number;
  name: string;
  description: string;
  city: string;
  address: string;
  rating: number;
  stars: number;
  amenities: string[];
  images: string[];
  reviewCount: number;
  minPrice: number | null;
  createdAt: string;
  viewedAt: string;
};

export default function Home() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated } = useAuth();
  const { data: stats, isLoading } = useGetHotelStats({
    query: { queryKey: getGetHotelStatsQueryKey() }
  });

  const { data: recentlyViewed } = useQuery<RecentHotel[]>({
    queryKey: ["/api/recently-viewed"],
    queryFn: () => customFetch<RecentHotel[]>("/api/recently-viewed", { credentials: "include" }),
    enabled: isAuthenticated,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/hotels?city=${encodeURIComponent(searchQuery.toLowerCase())}`);
    } else {
      setLocation('/hotels');
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000"
            alt="Luxury hotel view" 
            className="w-full h-full object-cover object-center"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white mt-20">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 drop-shadow-lg">
            {t("home.heroTitle")}
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-12 drop-shadow">
            {t("home.heroSubtitle")}
          </p>

          <div className="max-w-4xl mx-auto bg-background/95 backdrop-blur-md p-4 rounded-2xl shadow-xl">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder={t("home.searchPlaceholder")}
                  className="pl-10 h-12 bg-white text-neutral-900 placeholder:text-neutral-500 text-lg border-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-8 text-lg w-full md:w-auto">
                <Search className="mr-2 h-5 w-5" />
                {t("common.search")}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-border">
            <div className="px-4">
              <p className="text-4xl font-serif font-bold text-primary mb-2">
                {stats?.totalHotels || "100+"}
              </p>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">{t("home.stats.premiumHotels")}</p>
            </div>
            <div className="px-4">
              <p className="text-4xl font-serif font-bold text-primary mb-2">
                {stats?.featuredCities?.length || "50+"}
              </p>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">{t("home.stats.cities")}</p>
            </div>
            <div className="px-4">
              <p className="text-4xl font-serif font-bold text-primary mb-2">50 000+</p>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">{t("home.stats.happyGuests")}</p>
            </div>
            <div className="px-4">
              <p className="text-4xl font-serif font-bold text-primary mb-2">4.8</p>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">{t("home.stats.averageRating")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed */}
      {isAuthenticated && recentlyViewed && recentlyViewed.length > 0 && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-6 w-6 text-primary" />
                  <h2 className="text-3xl font-serif font-bold">{t("home.recentlyViewed")}</h2>
                </div>
                <p className="text-muted-foreground">{t("home.recentlyViewedSubtitle")}</p>
              </div>
              <Button variant="outline" onClick={() => setLocation('/hotels')}>{t("home.browseAll")}</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentlyViewed.slice(0, 4).map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Destinations */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-3">{t("home.popularDestinations")}</h2>
              <p className="text-muted-foreground">{t("home.popularSubtitle")}</p>
            </div>
            <Button variant="outline" onClick={() => setLocation('/hotels')}>{t("home.viewAllCities")}</Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { city: "Paris",  img: "1499856871958-5b9627545d1a" },
              { city: "Tokyo",  img: "1540959733332-eab4deabeeaf" },
              { city: "Bali",   img: "1537996194471-e657df975ab4" },
              { city: "London", img: "1513635269975-59663e0ac1ad" },
            ].map(({ city, img }) => {
              const count = stats?.featuredCities?.find(c => c.city.toLowerCase() === city.toLowerCase())?.count;
              return (
                <div
                  key={city}
                  className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => setLocation(`/hotels?city=${encodeURIComponent(city.toLowerCase())}`)}
                >
                  <img
                    src={`https://images.unsplash.com/photo-${img}?auto=format&fit=crop&q=80&w=800`}
                    alt={city}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-5 left-5 text-white">
                    <h3 className="text-xl font-serif font-bold mb-0.5">{city}</h3>
                    {count !== undefined && (
                      <p className="text-white/80 text-sm">{t("home.properties", { count })}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top Picks */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-3">{t("home.topRated")}</h2>
              <p className="text-muted-foreground">{t("home.topRatedSubtitle")}</p>
            </div>
            <Button variant="outline" onClick={() => setLocation('/hotels')}>{t("home.viewAllHotels")}</Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats?.topHotels?.slice(0, 12).map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
