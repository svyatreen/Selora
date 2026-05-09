import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import {
  Cookie,
  ShieldCheck,
  BarChart2,
  Settings,
  XCircle,
  RefreshCw,
  Globe2,
  Lock,
  ChevronDown,
  ChevronUp,
  Building2,
  ToggleLeft,
  Info,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const COOKIE_TYPE_META = [
  {
    icon: ShieldCheck,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    badgeColor:
      'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
  },
  {
    icon: BarChart2,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    badgeColor:
      'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  },
  {
    icon: Settings,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    badgeColor:
      'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  },
  {
    icon: XCircle,
    color: 'text-slate-500 dark:text-slate-400',
    bg: 'bg-slate-50 dark:bg-slate-800/30',
    border: 'border-slate-200 dark:border-slate-700',
    badgeColor:
      'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400',
  },
];

const SECTION_ICONS = [Info, Cookie, Globe2, ToggleLeft, RefreshCw, RefreshCw];
const INTRO_BADGE_ICONS = [ShieldCheck, Lock, ToggleLeft, Globe2];
const RELATED_ICONS = [Lock, ShieldCheck, ShieldCheck];

interface Example {
  name: string;
  purpose: string;
  duration: string;
}
interface CookieType {
  id: string;
  badge: string;
  title: string;
  description: string;
  examples: Example[];
}
interface Section {
  id: string;
  title: string;
  content: string;
}
interface Related {
  id: string;
  href: string;
  title: string;
  description: string;
}

function SectionBlock({
  section,
  Icon,
}: {
  section: Section;
  Icon: React.ElementType;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-border/50 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <span className="font-semibold text-foreground flex-1">
          {section.title}
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-6 border-t border-border/50 pt-5">
          <p className="text-muted-foreground text-sm leading-relaxed">
            {section.content}
          </p>
        </div>
      )}
    </div>
  );
}

export default function CookiePolicy() {
  const { t } = useTranslation();
  const cookieTypes = t('static.cookies.cookieTypes', {
    returnObjects: true,
  }) as CookieType[];
  const sections = t('static.cookies.sections', {
    returnObjects: true,
  }) as Section[];
  const introBadges = t('static.cookies.introBadges', {
    returnObjects: true,
  }) as string[];
  const related = t('static.cookies.related', {
    returnObjects: true,
  }) as Related[];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[340px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=2000"
            alt="Cookie policy"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/52 to-black/72" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Cookie className="h-4 w-4 text-amber-300" />
            {t('static.cookies.heroBadge')}
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight mb-4 drop-shadow-lg">
            {t('static.cookies.heroTitle')}
          </h1>
          <p className="text-white/80 text-sm">
            {t('static.cookies.lastUpdated')}
          </p>
        </div>
      </section>

      {/* Intro Banner */}
      <section className="py-14 bg-muted/30 border-b border-border/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2">
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
                {t('static.cookies.introEyebrow')}
              </p>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
                {t('static.cookies.introTitle')}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                {t('static.cookies.introP1')}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t('static.cookies.introP2')}
              </p>
            </div>
            <div className="space-y-3">
              {introBadges.map((text, i) => {
                const Icon = INTRO_BADGE_ICONS[i] ?? ShieldCheck;
                return (
                  <div
                    key={text}
                    className="flex items-center gap-3 bg-background border border-border/50 rounded-xl px-4 py-3 shadow-sm"
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Cookie Types */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              {t('static.cookies.typesEyebrow')}
            </p>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              {t('static.cookies.typesTitle')}
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {t('static.cookies.typesSubtitle')}
            </p>
          </div>
          <div className="space-y-6">
            {cookieTypes.map((ct, i) => {
              const meta = COOKIE_TYPE_META[i] ?? COOKIE_TYPE_META[0];
              const Icon = meta.icon;
              return (
                <div
                  key={ct.id}
                  className={`rounded-2xl border p-7 ${meta.border} ${meta.bg}`}
                >
                  <div className="flex flex-wrap items-start gap-4 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-background flex items-center justify-center shadow-sm flex-shrink-0">
                      <Icon className={`h-6 w-6 ${meta.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h3 className="font-semibold text-foreground text-lg">
                          {ct.title}
                        </h3>
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${meta.badgeColor}`}
                        >
                          {ct.badge}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {ct.description}
                      </p>
                    </div>
                  </div>
                  {ct.examples.length > 0 && (
                    <div className="mt-5 bg-background/70 rounded-xl border border-border/40 overflow-hidden">
                      <div className="grid grid-cols-3 gap-0 bg-muted/40 px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        <span>{t('static.cookies.cookieNameHeader')}</span>
                        <span>{t('static.cookies.purposeHeader')}</span>
                        <span className="text-right">
                          {t('static.cookies.durationHeader')}
                        </span>
                      </div>
                      {ct.examples.map((ex, j) => (
                        <div
                          key={ex.name}
                          className={`grid grid-cols-3 gap-4 px-4 py-3 items-center text-sm ${
                            j < ct.examples.length - 1
                              ? 'border-b border-border/30'
                              : ''
                          }`}
                        >
                          <code className="font-mono text-xs text-primary bg-primary/8 px-2 py-0.5 rounded">
                            {ex.name}
                          </code>
                          <span className="text-muted-foreground">
                            {ex.purpose}
                          </span>
                          <span className="text-right text-muted-foreground">
                            {ex.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {ct.examples.length === 0 && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                      <XCircle className="h-4 w-4 flex-shrink-0" />
                      {t('static.cookies.noCookies')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detailed Sections */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              {t('static.cookies.detailsEyebrow')}
            </p>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              {t('static.cookies.detailsTitle')}
            </h2>
          </div>
          <div className="space-y-4">
            {sections.map((section, i) => (
              <div key={section.id} id={section.id} className="scroll-mt-20">
                <SectionBlock
                  section={section}
                  Icon={SECTION_ICONS[i] ?? Info}
                />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Related Policies */}
      <section className="py-16 bg-background border-t border-border/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">
              {t('static.cookies.relatedEyebrow')}
            </p>
            <h2 className="font-serif text-3xl font-bold text-foreground">
              {t('static.cookies.relatedTitle')}
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map((p, i) => {
              const Icon = RELATED_ICONS[i] ?? Lock;
              return (
                <Link key={p.href} href={p.href}>
                  <div className="bg-muted/30 border border-border/50 rounded-2xl p-6 hover:shadow-md transition-all hover:-translate-y-0.5 group h-full">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <p className="font-semibold text-foreground text-sm mb-1">
                      {p.title}
                    </p>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="bg-background border border-border/50 rounded-3xl p-12 shadow-sm">
            <Building2 className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              {t('static.cookies.ctaTitle')}
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              {t('static.cookies.ctaSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/hotels">
                <Button size="lg" className="rounded-full px-10 text-base">
                  {t('static.cookies.exploreHotels')}
                </Button>
              </Link>
              <Link href="/contact#send-message">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-10 text-base"
                >
                  {t('static.cookies.askQuestion')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
