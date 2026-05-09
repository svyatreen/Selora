import { Link } from 'wouter';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Newspaper,
  Download,
  Mail,
  ExternalLink,
  Quote,
  Calendar,
  Trophy,
  Tv2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const COVERAGE_LOGOS = ['CNT', 'Forbes', 'FT'];
const COVERAGE_COLORS = ['bg-stone-800', 'bg-blue-900', 'bg-pink-700'];

interface Coverage {
  outlet: string;
  date: string;
  title: string;
  excerpt: string;
  tag: string;
}

interface Release {
  date: string;
  title: string;
  summary: string;
}

interface Award {
  year: string;
  award: string;
  body: string;
}

interface MediaAsset {
  label: string;
  size: string;
}

export default function Press() {
  const { t } = useTranslation();

  const featuredCoverage = t('static.press.featuredCoverage', {
    returnObjects: true,
  }) as Coverage[];
  const pressReleases = t('static.press.pressReleases', {
    returnObjects: true,
  }) as Release[];
  const awards = t('static.press.awards', { returnObjects: true }) as Award[];
  const mediaAssets = t('static.press.mediaAssets', {
    returnObjects: true,
  }) as MediaAsset[];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[420px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=2000"
            alt="Press and media"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/70" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Newspaper className="h-4 w-4 text-amber-300" />
            {t('static.press.heroBadge')}
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight mb-5 drop-shadow-lg">
            {t('static.press.heroTitle')}
          </h1>
          <p className="text-lg text-white/85 leading-relaxed max-w-xl mx-auto">
            {t('static.press.heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Featured Coverage */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              {t('static.press.asSeenIn')}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
              {t('static.press.featuredCoverageTitle')}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredCoverage.map((c, i) => (
              <div
                key={c.outlet}
                className="bg-background border border-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col"
              >
                <div
                  className={`${COVERAGE_COLORS[i] ?? 'bg-stone-800'} px-6 py-5 flex items-center justify-between`}
                >
                  <span className="font-serif text-lg font-bold text-white">
                    {COVERAGE_LOGOS[i] ?? c.outlet}
                  </span>
                  <Badge className="bg-white/20 text-white border-0 text-xs">
                    {c.tag}
                  </Badge>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-3">
                    <Calendar className="h-3.5 w-3.5" />
                    {c.date}
                  </div>
                  <h3 className="font-semibold text-foreground text-base leading-snug mb-3">
                    {c.title}
                  </h3>
                  <div className="relative mb-5 flex-1">
                    <Quote className="h-6 w-6 text-primary/20 mb-1" />
                    <p className="text-muted-foreground text-sm leading-relaxed italic">
                      {c.excerpt}
                    </p>
                  </div>
                  <a
                    href="#"
                    className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:underline"
                  >
                    {t('static.press.readFullArticle')}{' '}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              {t('static.press.recognition')}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
              {t('static.press.awardsTitle')}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {awards.map((a) => (
              <div
                key={`${a.year}-${a.award}`}
                className="bg-background border border-border/50 rounded-xl p-5 flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-0.5">
                    {a.year} · {a.body}
                  </p>
                  <p className="text-sm font-semibold text-foreground leading-snug">
                    {a.award}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              {t('static.press.latestNews')}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
              {t('static.press.pressReleasesTitle')}
            </h2>
          </div>
          <div className="space-y-4">
            {pressReleases.map((r) => (
              <div
                key={r.title}
                className="group bg-background border border-border/50 rounded-xl p-6 flex gap-5 items-start hover:border-primary/40 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="hidden sm:flex h-12 w-12 rounded-lg bg-primary/10 items-center justify-center flex-shrink-0">
                  <Newspaper className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-medium mb-1">
                    {r.date}
                  </p>
                  <h3 className="font-semibold text-foreground text-base leading-snug mb-1.5 group-hover:text-primary transition-colors">
                    {r.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {r.summary}
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Overview */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              {t('static.press.mediaResources')}
            </p>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-5">
              {t('static.press.brandOverviewTitle')}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
              {t('static.press.brandOverviewText')}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: t('static.press.brandStat1Label'), value: t('static.press.brandStat1Value') },
              { label: t('static.press.brandStat2Label'), value: t('static.press.brandStat2Value') },
              { label: t('static.press.brandStat3Label'), value: t('static.press.brandStat3Value') },
              { label: t('static.press.brandStat4Label'), value: t('static.press.brandStat4Value') },
            ].map((stat) => (
              <div key={stat.label} className="bg-background border border-border/60 rounded-2xl p-7 text-center shadow-sm">
                <p className="font-serif text-4xl font-bold text-primary mb-2">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 relative rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?auto=format&fit=crop&q=80&w=1400"
              alt="Selora brand"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-10">
              <div className="text-white">
                <p className="text-sm font-semibold uppercase tracking-widest opacity-80 mb-1">
                  {t('static.press.coverageIn')}
                </p>
                <p className="font-serif text-3xl font-bold">
                  {t('static.press.outlets', { count: 50 })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Press Contact */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-12">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Mail className="h-7 w-7 text-primary" />
            </div>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              {t('static.press.pressEnquiriesTitle')}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-lg mx-auto">
              {t('static.press.pressEnquiriesText')}
            </p>
            <div className="bg-background border border-border rounded-xl p-5 mb-8 inline-block">
              <p className="text-sm text-muted-foreground mb-1">
                {t('static.press.pressContact')}
              </p>
              <p className="font-semibold text-foreground">selorabooking@gmail.com</p>
            </div>
            <div className="block">
              <Link href="/contact#send-message">
                <Button size="lg" className="rounded-full px-10 text-base">
                  <Mail className="mr-2 h-4 w-4" />
                  {t('static.press.contactPressTeam')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
