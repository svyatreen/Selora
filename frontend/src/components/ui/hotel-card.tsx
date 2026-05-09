import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { MapPin, Star, Heart } from "lucide-react";
import { Hotel } from "@/api/generated/api.schemas";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAddFavorite, useRemoveFavorite, useGetFavorites, getGetFavoritesQueryKey } from "@/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface HotelCardProps {
  hotel: Hotel;
}

export function HotelCard({ hotel }: HotelCardProps) {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { formatPrice } = useCurrency();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: favorites } = useGetFavorites({
    query: {
      enabled: isAuthenticated,
      queryKey: getGetFavoritesQueryKey()
    }
  });

  const isFavorite = favorites?.some((f: any) => (f.hotelId ?? f.id) === hotel.id);

  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setLocation("/login");
      return;
    }

    if (isFavorite) {
      removeFavorite.mutate({ hotelId: hotel.id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetFavoritesQueryKey() });
          toast.success(t("favoritesPage.removed"));
        }
      });
    } else {
      addFavorite.mutate({ hotelId: hotel.id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetFavoritesQueryKey() });
          toast.success(t("favoritesPage.added"));
        }
      });
    }
  };

  return (
    <Link href={`/hotels/${hotel.id}`}>
      <Card className="group overflow-hidden rounded-xl border-border/50 bg-card transition-all hover:shadow-md cursor-pointer h-full flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden">
          {hotel.images[0] ? (
            <img
              src={hotel.images[0]}
              alt={hotel.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-muted" />
          )}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-foreground"
              onClick={toggleFavorite}
              aria-label={isFavorite ? t("hotelCard.removeFromFavorites") : t("hotelCard.addToFavorites")}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-destructive text-destructive" : "text-gray-800 stroke-2"}`} />
            </Button>
          </div>
          {hotel.stars >= 4 && (
            <Badge className="absolute top-3 left-3 bg-primary/90 hover:bg-primary text-primary-foreground backdrop-blur-sm">
              {t("hotelCard.luxury", { defaultValue: "Luxury" })}
            </Badge>
          )}
        </div>
        <CardContent className="p-5 flex flex-col flex-grow">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="font-serif text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
              {hotel.name}
            </h3>
            <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              <span className="text-sm font-medium">{hotel.stars}</span>
            </div>
          </div>

          <div className="flex items-center text-muted-foreground mb-4">
            <MapPin className="mr-1 h-3.5 w-3.5" />
            <span className="text-sm truncate">{hotel.city}</span>
          </div>

          <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">{t("common.startingFrom")}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold">{formatPrice(hotel.minPrice || 0)}</span>
                <span className="text-sm text-muted-foreground">{t("common.perNight")}</span>
              </div>
            </div>
            <span className="text-sm font-medium text-primary flex items-center group-hover:translate-x-1 transition-transform">
              {t("common.viewDetails")} →
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
