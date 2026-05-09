import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { customFetch } from '@/api/custom-fetch';
import {
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  Search,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const POST_IMAGES = [
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800',
];

const FEATURED_IMAGE =
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=1400';

const categoryColors: Record<string, string> = {
  'Travel Guides':
    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Hotel Reviews':
    'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  'Insider Tips':
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  Sustainability:
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  'Food & Dining':
    'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  Culture:
    'bg-stone-100 text-stone-700 dark:bg-stone-900/30 dark:text-stone-300',
};

function CategoryBadge({
  category,
  colorKey,
}: {
  category: string;
  colorKey: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
        categoryColors[colorKey] ?? 'bg-muted text-muted-foreground'
      }`}
    >
      <Tag className="h-3 w-3" />
      {category}
    </span>
  );
}

interface FeaturedPost {
  category: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  authorName: string;
  authorRole: string;
}

interface Post {
  category: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
}

const COLOR_KEYS = [
  'Travel Guides',
  'Hotel Reviews',
  'Sustainability',
  'Food & Dining',
  'Culture',
  'Insider Tips',
];

export default function Blog() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const categories = t('static.blog.categories', {
    returnObjects: true,
  }) as string[];
  const featured = t('static.blog.featured', {
    returnObjects: true,
  }) as FeaturedPost;
  const posts = t('static.blog.posts', { returnObjects: true }) as Post[];

  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [search, setSearch] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(
    () => localStorage.getItem('newsletter_subscribed') === 'true',
  );
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setNewsletterEmail(user.email);
    }
  }, [user?.email]);

  const filtered = (() => {
    const searchMatches = posts.filter((p) => {
      if (!search) return true;
      return (
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(search.toLowerCase())
      );
    });
    if (activeCategory === categories[0]) {
      const seen = new Set<string>();
      return searchMatches.filter((p) => {
        if (seen.has(p.category)) return false;
        seen.add(p.category);
        return true;
      });
    }
    return searchMatches.filter((p) => p.category === activeCategory);
  })();

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[380px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=2000"
            alt="Travel blog"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/65" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <BookOpen className="h-4 w-4 text-amber-300" />
            {t('static.blog.heroBadge')}
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight mb-5 drop-shadow-lg">
            {t('static.blog.heroTitle')}
          </h1>
          <p className="text-lg text-white/85 leading-relaxed">
            {t('static.blog.heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-8">
            {t('static.blog.editorsPick')}
          </p>
          <a
            href="#"
            className="group grid md:grid-cols-2 gap-8 bg-background border border-border/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
          >
            <div className="relative h-72 md:h-auto overflow-hidden">
              <img
                src={FEATURED_IMAGE}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <CategoryBadge
                category={featured.category}
                colorKey="Insider Tips"
              />
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mt-4 mb-4 leading-snug group-hover:text-primary transition-colors">
                {featured.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {featured.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {featured.readTime}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {featured.authorName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {featured.authorName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {featured.authorRole}
                  </p>
                </div>
                <span className="ml-auto inline-flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
                  {t('static.blog.readMore')}{' '}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* Filter & Search */}
      <section className="bg-muted/30 border-y border-border/50 py-6 sticky top-16 z-30 backdrop-blur-sm">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all ${
                    activeCategory === cat
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('static.blog.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Post Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-40" />
              <p className="text-muted-foreground text-lg">
                {t('static.blog.noResults')}
              </p>
              <Button
                variant="ghost"
                className="mt-4"
                onClick={() => {
                  setSearch('');
                  setActiveCategory(categories[0]);
                }}
              >
                {t('static.blog.clearFilters')}
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((p, i) => {
                const idx = posts.indexOf(p);
                return (
                  <a
                    key={p.title}
                    href="#"
                    className="group bg-background border border-border/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={POST_IMAGES[idx] ?? POST_IMAGES[0]}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute top-3 left-3">
                        <CategoryBadge
                          category={p.category}
                          colorKey={COLOR_KEYS[idx] ?? 'Insider Tips'}
                        />
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {p.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {p.readTime}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground text-base leading-snug mb-2 group-hover:text-primary transition-colors flex-1">
                        {p.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">
                        {p.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
                        {t('static.blog.readArticle')}{' '}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="bg-background border border-border/60 rounded-3xl p-10 shadow-sm">
            <BookOpen className="h-10 w-10 text-primary mx-auto mb-5" />
            <h2 className="font-serif text-3xl font-bold text-foreground mb-3">
              {t('static.blog.newsletterTitle')}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-7">
              {t('static.blog.newsletterText')}
            </p>
            {subscribed ? (
              <div className="flex items-center justify-center gap-3 max-w-md mx-auto bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl px-6 py-4">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  {t('static.blog.newsletterAlreadySubscribed')}
                </p>
              </div>
            ) : (
              <form
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newsletterEmail) return;
                  setSubscribing(true);
                  try {
                    await customFetch('/api/newsletter/subscribe', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: newsletterEmail }),
                    });
                    localStorage.setItem('newsletter_subscribed', 'true');
                    setSubscribed(true);
                    toast.success(t('static.blog.subscribeSuccess'));
                  } catch {
                    toast.error('Ошибка при подписке. Попробуйте ещё раз.');
                  } finally {
                    setSubscribing(false);
                  }
                }}
              >
                <Input
                  type="email"
                  placeholder={t('static.blog.newsletterPlaceholder')}
                  className="flex-1 h-11"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  disabled={subscribing}
                />
                <Button
                  type="submit"
                  className="h-11 px-6 rounded-lg sm:rounded-r-lg"
                  disabled={subscribing || !newsletterEmail}
                >
                  {subscribing ? t('static.blog.subscribing') : t('static.blog.subscribe')}
                </Button>
              </form>
            )}
            <p className="text-xs text-muted-foreground mt-4">
              {t('static.blog.newsletterPrivacy')}
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
