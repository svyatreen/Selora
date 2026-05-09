import { Link } from 'wouter';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MapPin,
  Clock,
  Briefcase,
  Globe2,
  HeartHandshake,
  Sparkles,
  TrendingUp,
  Plane,
  ChevronDown,
  ChevronUp,
  Search,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const PERK_ICONS = [
  Plane,
  Globe2,
  TrendingUp,
  HeartHandshake,
  Sparkles,
  Users,
];

const DEPT_COLORS: Record<number, string> = {
  0: '',
  1: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  2: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  3: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  4: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  5: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
};

interface Stat {
  value: string;
  label: string;
}
interface Perk {
  title: string;
  description: string;
}
interface Opening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}

export default function Careers() {
  const { t } = useTranslation();

  const stats = t('static.careers.stats', { returnObjects: true }) as Stat[];
  const perks = t('static.careers.perks', { returnObjects: true }) as Perk[];
  const departments = t('static.careers.departments', {
    returnObjects: true,
  }) as string[];
  const openings = t('static.careers.openings', {
    returnObjects: true,
  }) as Opening[];

  const [activedept, setActivedept] = useState<string>(departments[0]);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = (() => {
    const searchMatches = openings.filter((job) => {
      if (!search) return true;
      return (
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.department.toLowerCase().includes(search.toLowerCase()) ||
        job.location.toLowerCase().includes(search.toLowerCase())
      );
    });
    if (activedept === departments[0]) {
      const deptCount: Record<string, number> = {};
      return searchMatches.filter((job) => {
        const count = deptCount[job.department] ?? 0;
        if (count >= 2) return false;
        deptCount[job.department] = count + 1;
        return true;
      });
    }
    return searchMatches.filter((job) => job.department === activedept);
  })();

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[440px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000"
            alt="Team working together"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/70" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Briefcase className="h-4 w-4 text-amber-300" />
            {t('static.careers.heroBadge')}
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight mb-5 drop-shadow-lg">
            {t('static.careers.heroTitle')}
          </h1>
          <p className="text-lg text-white/85 leading-relaxed max-w-2xl mx-auto">
            {t('static.careers.heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-serif text-4xl font-bold">{s.value}</p>
                <p className="text-sm font-medium opacity-75 uppercase tracking-wide mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              {t('static.careers.whySelora')}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
              {t('static.careers.lifeAtSelora')}
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-lg">
              {t('static.careers.perksLead')}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {perks.map((perk, i) => {
              const Icon = PERK_ICONS[i] ?? Sparkles;
              return (
                <div
                  key={perk.title}
                  className="bg-background border border-border/50 rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-base mb-2">
                    {perk.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {perk.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Photos */}
      <section className="py-0">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800', alt: 'Team collaboration' },
              { src: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800', alt: 'Team meeting' },
              { src: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800', alt: 'Remote work' },
              { src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800', alt: 'Creative session' },
              { src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800', alt: 'Office culture' },
              { src: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800', alt: 'Team lunch' },
            ].map((photo) => (
              <div key={photo.src} className="h-52 md:h-64 overflow-hidden rounded-xl">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              {t('static.careers.nowHiring')}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
              {t('static.careers.openPositions')}
            </h2>
          </div>

          {/* Filter row */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setActivedept(dept)}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all ${
                    activedept === dept
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-primary'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('static.careers.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>

          {/* Job list */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="text-muted-foreground text-lg">
                {t('static.careers.noResults')}
              </p>
              <Button
                variant="ghost"
                className="mt-4"
                onClick={() => {
                  setSearch('');
                  setActivedept(departments[0]);
                }}
              >
                {t('static.careers.clearFilters')}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((job) => {
                const isOpen = expanded === job.id;
                const deptIdx = departments.indexOf(job.department);
                const colorClass =
                  DEPT_COLORS[deptIdx] ??
                  'bg-muted text-muted-foreground';
                return (
                  <div
                    key={job.id}
                    className="bg-background border border-border/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <button
                      className="w-full text-left px-6 py-5 flex items-start gap-4"
                      onClick={() => setExpanded(isOpen ? null : job.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span
                            className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${colorClass}`}
                          >
                            {job.department}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {job.type}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {job.location}
                          </span>
                        </div>
                        <h3 className="font-semibold text-foreground text-base leading-snug">
                          {job.title}
                        </h3>
                      </div>
                      <div className="flex-shrink-0 mt-1">
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-6 border-t border-border/50 pt-5">
                        <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                          {job.description}
                        </p>
                        <h4 className="text-sm font-semibold text-foreground mb-3">
                          {t('static.careers.whatWereLookingFor')}
                        </h4>
                        <ul className="space-y-2 mb-6">
                          {job.requirements.map((req) => (
                            <li
                              key={req}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                              {req}
                            </li>
                          ))}
                        </ul>
                        <Button className="rounded-full px-7">
                          {t('static.careers.applyForRole')}
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Open Application */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-12">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Briefcase className="h-7 w-7 text-primary" />
            </div>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              {t('static.careers.openApplicationTitle')}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-lg mx-auto">
              {t('static.careers.openApplicationText')}
            </p>
            <Link href="/contact#send-message">
              <Button size="lg" className="rounded-full px-10 text-base">
                {t('static.careers.sendOpenApplication')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
