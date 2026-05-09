import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  Globe2,
  Star,
  Users,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  MapPin,
  Trophy,
  Leaf,
} from 'lucide-react';

const statIcons = [Building2, Globe2, Star, Users];
const valueIcons = [Sparkles, HeartHandshake, ShieldCheck, Leaf];

const teamImages = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
];

type StatItem = { value: string; label: string };
type ValueItem = { title: string; description: string };
type MilestoneItem = { year: string; title: string; description: string };
type TeamItem = { name: string; role: string; bio: string; location: string };

export default function About() {
  const { t } = useTranslation();
  const stats = (t('static.about.stats', { returnObjects: true }) as StatItem[]) ?? [];
  const values = (t('static.about.values', { returnObjects: true }) as ValueItem[]) ?? [];
  const milestones = (t('static.about.milestones', { returnObjects: true }) as MilestoneItem[]) ?? [];
  const team = (t('static.about.team', { returnObjects: true }) as TeamItem[]) ?? [];

  return (
    <Layout>
      <section className="relative min-h-[520px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=2000"
            alt="Selora"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Trophy className="h-4 w-4 text-amber-300" />
            {t('static.about.heroBadge')}
          </div>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 drop-shadow-lg">
            {t('static.about.heroTitle')}
          </h1>
          <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed">
            {t('static.about.heroSubtitle')}
          </p>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground py-14">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => {
              const Icon = statIcons[idx] ?? Building2;
              return (
                <div key={stat.label} className="flex flex-col items-center gap-2">
                  <Icon className="h-7 w-7 opacity-80" />
                  <span className="font-serif text-4xl font-bold">{stat.value}</span>
                  <span className="text-sm font-medium opacity-75 uppercase tracking-wide">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
                {t('static.about.missionEyebrow')}
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
                {t('static.about.missionTitle')}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-5">
                {t('static.about.missionP1')}
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                {t('static.about.missionP2')}
              </p>
              <Link href="/hotels">
                <Button size="lg" className="rounded-full px-8">
                  {t('static.about.missionCta')}
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=800"
                alt=""
                className="w-full h-[480px] object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-background rounded-xl p-4 shadow-xl border border-border max-w-[200px]">
                <div className="flex items-center gap-2 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-xs font-medium text-foreground">
                  {t('static.about.quote')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('static.about.quoteAuthor')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              {t('static.about.valuesEyebrow')}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
              {t('static.about.valuesTitle')}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, idx) => {
              const Icon = valueIcons[idx] ?? Sparkles;
              return (
                <div
                  key={v.title}
                  className="bg-background rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg mb-3">
                    {v.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {v.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              {t('static.about.timelineEyebrow')}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
              {t('static.about.timelineTitle')}
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />
            <div className="space-y-12">
              {milestones.map((m, i) => (
                <div
                  key={m.year}
                  className={`relative flex gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-start`}
                >
                  <div
                    className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'} pl-16 md:pl-0`}
                  >
                    <div className="bg-background border border-border rounded-xl p-5 shadow-sm inline-block text-left">
                      <span className="text-primary font-bold text-sm">
                        {m.year}
                      </span>
                      <h3 className="font-semibold text-foreground mt-1 mb-2">
                        {m.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {m.description}
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-primary ring-4 ring-background mt-5" />
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              {t('static.about.teamEyebrow')}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
              {t('static.about.teamTitle')}
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-lg">
              {t('static.about.teamSubtitle')}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <div
                key={member.name}
                className="bg-background rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={teamImages[idx] ?? teamImages[0]}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-foreground text-base">
                    {member.name}
                  </h3>
                  <p className="text-primary text-sm font-medium mt-0.5">
                    {member.role}
                  </p>
                  <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1 mb-3">
                    <MapPin className="h-3 w-3" />
                    {member.location}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-12">
            <Building2 className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              {t('static.about.ctaTitle')}
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              {t('static.about.ctaSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/hotels">
                <Button size="lg" className="rounded-full px-10 text-base">
                  {t('static.about.ctaExplore')}
                </Button>
              </Link>
              <Link href="/contact#send-message">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-10 text-base"
                >
                  {t('static.about.ctaJoin')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
