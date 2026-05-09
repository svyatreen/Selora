import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import {
  Lock,
  Eye,
  ShieldCheck,
  FileText,
  UserCheck,
  Globe2,
  RefreshCw,
  Mail,
  ChevronDown,
  ChevronUp,
  Building2,
  Trash2,
  Server,
  Cookie,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const SECTION_ICONS = [
  FileText,
  Eye,
  Globe2,
  Cookie,
  Server,
  UserCheck,
  ShieldCheck,
  Globe2,
  UserCheck,
  RefreshCw,
];
const HIGHLIGHT_ICONS = [Lock, Trash2, ShieldCheck, Mail];

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

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  const highlights = t('static.privacy.highlights', {
    returnObjects: true,
  }) as Highlight[];
  const sections = t('static.privacy.sections', {
    returnObjects: true,
  }) as Section[];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[340px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2000"
            alt="Privacy policy"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-black/72" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Lock className="h-4 w-4 text-amber-300" />
            {t('static.privacy.heroBadge')}
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight mb-4 drop-shadow-lg">
            {t('static.privacy.heroTitle')}
          </h1>
          <p className="text-white/80 text-sm">
            {t('static.privacy.lastUpdated')}
          </p>
        </div>
      </section>

      {/* Intro + Highlights */}
      <section className="py-16 bg-muted/30 border-b border-border/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
                {t('static.privacy.introEyebrow')}
              </p>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
                {t('static.privacy.introTitle')}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t('static.privacy.introP1')}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t('static.privacy.introP2')}{' '}
                <a
                  href="mailto:selorabooking@gmail.com"
                  className="text-primary hover:underline font-medium"
                >
                  selorabooking@gmail.com
                </a>
                .
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {highlights.map((h, i) => {
                const Icon = HIGHLIGHT_ICONS[i] ?? Lock;
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
            {t('static.privacy.contents')}
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

      {/* Policy Sections */}
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

      {/* Contact & Rights CTA */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-background border border-border/50 rounded-2xl p-8 md:p-10 shadow-sm">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <UserCheck className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg">
                    {t('static.privacy.exerciseRightsTitle')}
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {t('static.privacy.exerciseRightsText')}
                </p>
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">
                      {t('static.privacy.emailLabel')}
                    </span>{' '}
                    selorabooking@gmail.com
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 md:items-end">
                <Link href="/contact#send-message">
                  <Button
                    size="lg"
                    className="rounded-full px-8 w-full md:w-auto"
                  >
                    {t('static.privacy.contactPrivacy')}
                  </Button>
                </Link>
                <Link href="/safety">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 w-full md:w-auto"
                  >
                    {t('static.privacy.viewSafety')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-12">
            <Building2 className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              {t('static.privacy.ctaTitle')}
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              {t('static.privacy.ctaSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/hotels">
                <Button size="lg" className="rounded-full px-10 text-base">
                  {t('static.privacy.exploreHotels')}
                </Button>
              </Link>
              <Link href="/contact#send-message">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-10 text-base"
                >
                  {t('static.privacy.askQuestion')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
