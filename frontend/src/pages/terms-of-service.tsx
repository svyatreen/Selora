import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import {
  FileText,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
  CreditCard,
  Globe2,
  Scale,
  RefreshCw,
  Building2,
  ChevronDown,
  ChevronUp,
  BadgeCheck,
  XCircle,
  Lock,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const HIGHLIGHT_ICONS = [BadgeCheck, Lock, Scale, RefreshCw];
const SECTION_ICONS = [
  FileText,
  Globe2,
  UserCheck,
  Building2,
  CreditCard,
  XCircle,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Scale,
];
const RELATED_META = [
  { href: '/privacy-policy', icon: Lock },
  { href: '/cancellation-policy', icon: XCircle },
  { href: '/safety', icon: ShieldCheck },
];

interface Highlight {
  label: string;
  description: string;
}
interface SectionContent {
  subtitle: string;
  text: string;
}
interface Section {
  id: string;
  title: string;
  content: SectionContent[];
}
interface RelatedPolicy {
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
        <div className="px-6 pb-6 space-y-5 border-t border-border/50 pt-5">
          {section.content.map(({ subtitle, text }) => (
            <div key={subtitle}>
              <p className="font-medium text-foreground text-sm mb-1.5">
                {subtitle}
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TermsOfService() {
  const { t } = useTranslation();
  const highlights = t('static.terms.highlights', {
    returnObjects: true,
  }) as Highlight[];
  const sections = t('static.terms.sections', {
    returnObjects: true,
  }) as Section[];
  const relatedPolicies = t('static.terms.relatedPolicies', {
    returnObjects: true,
  }) as RelatedPolicy[];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[340px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=2000"
            alt="Terms of service"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-black/72" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Scale className="h-4 w-4 text-amber-300" />
            {t('static.terms.heroBadge')}
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight mb-4 drop-shadow-lg">
            {t('static.terms.heroTitle')}
          </h1>
          <p className="text-white/80 text-sm">
            {t('static.terms.lastUpdated')}
          </p>
        </div>
      </section>

      {/* Intro + Highlights */}
      <section className="py-16 bg-muted/30 border-b border-border/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
                {t('static.terms.introEyebrow')}
              </p>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
                {t('static.terms.introTitle')}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t('static.terms.introP1')}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t('static.terms.introP2')}{' '}
                <a
                  href="mailto:legal@selora.com"
                  className="text-primary hover:underline font-medium"
                >
                  legal@selora.com
                </a>
                {t('static.terms.introP2End')}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {highlights.map((h, i) => {
                const Icon = HIGHLIGHT_ICONS[i] ?? BadgeCheck;
                return (
                  <div
                    key={h.label}
                    className="bg-background border border-border/50 rounded-xl p-5 shadow-sm"
                  >
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <p className="font-semibold text-foreground text-sm mb-1">
                      {h.label}
                    </p>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {h.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-12 bg-background border-b border-border/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-5">
            {t('static.terms.contents')}
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 py-1"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary/50 flex-shrink-0" />
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-4">
            {sections.map((section, i) => (
              <div key={section.id} id={section.id} className="scroll-mt-20">
                <SectionBlock
                  section={section}
                  Icon={SECTION_ICONS[i] ?? FileText}
                />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Related Policies */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">
              {t('static.terms.relatedEyebrow')}
            </p>
            <h2 className="font-serif text-3xl font-bold text-foreground">
              {t('static.terms.relatedTitle')}
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {relatedPolicies.map((p, i) => {
              const meta = RELATED_META[i] ?? RELATED_META[0];
              const Icon = meta.icon;
              return (
                <Link key={meta.href} href={meta.href}>
                  <div className="bg-background border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group h-full">
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
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-12">
            <Building2 className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              {t('static.terms.ctaTitle')}
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              {t('static.terms.ctaSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/hotels">
                <Button size="lg" className="rounded-full px-10 text-base">
                  {t('static.terms.exploreHotels')}
                </Button>
              </Link>
              <Link href="/contact#send-message">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-10 text-base"
                >
                  {t('static.terms.askQuestion')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
