import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import {
  ShieldCheck,
  Lock,
  Eye,
  AlertTriangle,
  BadgeCheck,
  UserCheck,
  PhoneCall,
  FileText,
  Star,
  Globe2,
  HeartHandshake,
  ChevronDown,
  ChevronUp,
  Building2,
  Fingerprint,
  Wifi,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const COMMITMENT_ICONS = [
  ShieldCheck,
  Lock,
  UserCheck,
  Eye,
  Fingerprint,
  Globe2,
];
const TIP_ICONS = [
  BadgeCheck,
  FileText,
  Wifi,
  PhoneCall,
  AlertTriangle,
  HeartHandshake,
];
const STAT_ICONS = [ShieldCheck, Lock, Star, PhoneCall];

interface Stat {
  value: string;
  label: string;
}
interface Commitment {
  title: string;
  description: string;
}
interface Certification {
  label: string;
  detail: string;
}
interface Tip {
  title: string;
  description: string;
}
interface Faq {
  question: string;
  answer: string;
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/50 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-muted/40 transition-colors"
      >
        <span className="font-medium text-foreground">{question}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-4" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-4" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-border/50 pt-4">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function Safety() {
  const { t } = useTranslation();
  const stats = t('static.safety.stats', { returnObjects: true }) as Stat[];
  const commitments = t('static.safety.commitments', {
    returnObjects: true,
  }) as Commitment[];
  const certifications = t('static.safety.certifications', {
    returnObjects: true,
  }) as Certification[];
  const guestTips = t('static.safety.guestTips', {
    returnObjects: true,
  }) as Tip[];
  const faqs = t('static.safety.faqs', { returnObjects: true }) as Faq[];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[380px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=2000"
            alt="Safety and security"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-black/70" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <ShieldCheck className="h-4 w-4 text-amber-300" />
            {t('static.safety.heroBadge')}
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight mb-4 drop-shadow-lg">
            {t('static.safety.heroTitle')}
          </h1>
          <p className="text-lg text-white/85 leading-relaxed">
            {t('static.safety.heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => {
              const Icon = STAT_ICONS[i] ?? ShieldCheck;
              return (
                <div key={s.label} className="flex flex-col items-center gap-2">
                  <Icon className="h-7 w-7 opacity-80" />
                  <span className="font-serif text-3xl font-bold">
                    {s.value}
                  </span>
                  <span className="text-sm font-medium opacity-75 uppercase tracking-wide">
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Commitments */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              {t('static.safety.commitmentsEyebrow')}
            </p>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              {t('static.safety.commitmentsTitle')}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t('static.safety.commitmentsSubtitle')}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {commitments.map((c, i) => {
              const Icon = COMMITMENT_ICONS[i] ?? ShieldCheck;
              return (
                <div
                  key={c.title}
                  className="bg-muted/30 rounded-2xl p-7 border border-border/50 hover:shadow-md transition-shadow group"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-base mb-2">
                    {c.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {c.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">
              {t('static.safety.certifiedEyebrow')}
            </p>
            <h2 className="font-serif text-3xl font-bold text-foreground">
              {t('static.safety.certifiedTitle')}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {certifications.map((c) => (
              <div
                key={c.label}
                className="bg-background border border-border/50 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <BadgeCheck className="h-5 w-5 text-primary" />
                </div>
                <p className="font-semibold text-foreground text-sm mb-1">
                  {c.label}
                </p>
                <p className="text-muted-foreground text-xs">{c.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guest Safety Tips */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
                {t('static.safety.tipsEyebrow')}
              </p>
              <h2 className="font-serif text-4xl font-bold text-foreground mb-5 leading-tight">
                {t('static.safety.tipsTitle')}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {t('static.safety.tipsLead')}
              </p>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 flex gap-4 items-start">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm mb-1">
                    {t('static.safety.phishingTitle')}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {t('static.safety.phishingText')}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {guestTips.map((tip, i) => {
                const Icon = TIP_ICONS[i] ?? BadgeCheck;
                return (
                  <div
                    key={tip.title}
                    className="flex gap-4 items-start bg-muted/30 rounded-xl p-5 border border-border/50 hover:shadow-sm transition-shadow"
                  >
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm mb-1">
                        {tip.title}
                      </p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-background border border-border/50 rounded-2xl p-8 md:p-10 shadow-sm">
            <div className="grid md:grid-cols-3 gap-8 items-center text-center md:text-left">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                  <div className="h-10 w-10 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                    <PhoneCall className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg">
                    {t('static.safety.emergencyTitle')}
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {t('static.safety.emergencyText')}
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    {t('static.safety.emergencyPhone')}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    {t('static.safety.emergencyEmail')}
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <Link href="/contact#send-message">
                  <Button size="lg" className="rounded-full px-8">
                    {t('static.safety.contactSupport')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              {t('static.safety.faqEyebrow')}
            </p>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              {t('static.safety.faqTitle')}
            </h2>
            <p className="text-muted-foreground">
              {t('static.safety.faqSubtitle')}
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FaqItem key={faq.question} {...faq} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="bg-background border border-border/50 rounded-3xl p-12 shadow-sm">
            <Building2 className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              {t('static.safety.ctaTitle')}
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              {t('static.safety.ctaSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/hotels">
                <Button size="lg" className="rounded-full px-10 text-base">
                  {t('static.safety.exploreHotels')}
                </Button>
              </Link>
              <Link href="/contact#send-message">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-10 text-base"
                >
                  {t('static.safety.talkToUs')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
