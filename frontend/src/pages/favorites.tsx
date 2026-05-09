import { Layout } from "@/components/layout/Layout";
import { useTranslation } from "react-i18next";
import { HotelCard } from "@/components/ui/hotel-card";
import { useGetFavorites, getGetFavoritesQueryKey } from "@/api";
import { Building2 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Favorites() {
  const { t } = useTranslation();
  const { data: favorites, isLoading } = useGetFavorites({
    query: { queryKey: getGetFavoritesQueryKey() }
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-10">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">{t('favoritesPage.headerTitle')}</h1>
          <p className="text-muted-foreground text-lg">{t('favoritesPage.headerSubtitle')}</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : favorites?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((favorite: any) => (
              <HotelCard key={favorite.id} hotel={favorite} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t('favoritesPage.empty')}</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              {t('favoritesPage.emptyHelp')}
            </p>
            <Button asChild>
              <Link href="/hotels">{t('favoritesPage.explore')}</Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
