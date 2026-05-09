import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import {
  ShieldCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  CreditCard,
  CalendarDays,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Building2,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const POLICY_META = [
  {
    icon: CheckCircle2,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
  },
  {
    icon: AlertCircle,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
  },
  {
    icon: XCircle,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
  },
];

const STAT_ICONS = [CheckCircle2, RefreshCw, CreditCard, Clock];
const STEP_ICONS = [CalendarDays, AlertCircle, XCircle, CreditCard];

interface Stat {
  value: string;
  label: string;
}
interface Policy {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
}
interface TimelineRow {
  window: string;
  label: string;
  refund: string;
  fee: string;
  status: 'green' | 'amber' | 'red';
}
interface Step {
  step: string;
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

export default function CancellationPolicy() {
  const { t } = useTranslation();

  const stats = t('static.cancellation.stats', {
    returnObjects: true,
  }) as Stat[];
  const policies = t('static.cancellation.policies', {
    returnObjects: true,
  }) as Policy[];
  const timeline = t('static.cancellation.timeline', {
    returnObjects: true,
  }) as TimelineRow[];
  const steps = t('static.cancellation.steps', {
    returnObjects: true,
  }) as Step[];
  const faqs = t('static.cancellation.faqs', {
    returnObjects: true,
  }) as Faq[];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[360px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=2000"
            alt="Cancellation policy"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <ShieldCheck className="h-4 w-4 text-amber-300" />
            {t('static.cancellation.heroBadge')}
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight mb-4 drop-shadow-lg">
            {t('static.cancellation.heroTitle')}
          </h1>
          <p className="text-lg text-white/85 leading-relaxed">
            {t('static.cancellation.heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Key Stats */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => {
              const Icon = STAT_ICONS[i] ?? CheckCircle2;
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

      {/* Policy Tiers */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              {t('static.cancellation.policyTypesEyebrow')}
            </p>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              {t('static.cancellation.policyTypesTitle')}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t('static.cancellation.policyTypesSubtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {policies.map((p, i) => {
              const meta = POLICY_META[i] ?? POLICY_META[0];
              const Icon = meta.icon;
              return (
                <div
                  key={p.title}
                  className={`rounded-2xl border p-7 ${meta.border} ${meta.bg} flex flex-col gap-5`}
                >
                  <div className="h-12 w-12 rounded-xl bg-background flex items-center justify-center shadow-sm">
                    <Icon className={`h-6 w-6 ${meta.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg mb-1">
                      {p.title}
                    </h3>
                    <p className={`text-sm font-medium ${meta.color} mb-3`}>
                      {p.subtitle}
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium bg-background border border-border/50 rounded-full px-3 py-1 text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Table */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              {t('static.cancellation.timelineEyebrow')}
            </p>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              {t('static.cancellation.timelineTitle')}
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {t('static.cancellation.timelineSubtitle')}
            </p>
          </div>

          <div className="bg-background rounded-2xl border border-border/50 overflow-hidden shadow-sm">
            <div className="grid grid-cols-3 gap-0 bg-muted/50 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <span>{t('static.cancellation.windowHeader')}</span>
              <span className="text-center">
                {t('static.cancellation.refundHeader')}
              </span>
              <span className="text-right">
                {t('static.cancellation.feeHeader')}
              </span>
            </div>
            {timeline.map((row, i) => {
              const dotColor =
                row.status === 'green'
                  ? 'bg-green-500'
                  : row.status === 'amber'
                    ? 'bg-amber-500'
                    : 'bg-red-500';
              const refundColor =
                row.status === 'green'
                  ? 'text-green-600 dark:text-green-400'
                  : row.status === 'amber'
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-red-600 dark:text-red-400';
              return (
                <div
                  key={row.window}
                  className={`grid grid-cols-3 gap-0 px-6 py-5 items-center ${
                    i < timeline.length - 1 ? 'border-b border-border/40' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${dotColor}`}
                    />
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {row.window}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {row.label}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`text-center font-semibold text-sm ${refundColor}`}
                  >
                    {row.refund}
                  </p>
                  <p className="text-right text-muted-foreground text-sm">
                    {row.fee}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground text-center mt-5 leading-relaxed">
            {t('static.cancellation.timelineFootnote')}
          </p>
        </div>
      </section>

      {/* How to Cancel */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              {t('static.cancellation.howEyebrow')}
            </p>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              {t('static.cancellation.howTitle')}
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((s, i) => {
              const Icon = STEP_ICONS[i] ?? CalendarDays;
              return (
                <div key={s.step} className="relative">
                  <div className="bg-muted/40 rounded-2xl p-6 border border-border/50 h-full">
                    <span className="font-serif text-4xl font-bold text-primary/20 block mb-4 leading-none">
                      {s.step}
                    </span>
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {s.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              {t('static.cancellation.faqEyebrow')}
            </p>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              {t('static.cancellation.faqTitle')}
            </h2>
            <p className="text-muted-foreground">
              {t('static.cancellation.faqSubtitle')}
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FaqItem key={faq.question} {...faq} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <p className="text-muted-foreground text-sm mb-4">
              {t('static.cancellation.stillHaveQuestions')}
            </p>
            <Link href="/contact#send-message">
              <Button variant="outline" className="rounded-full px-8 gap-2">
                <HelpCircle className="h-4 w-4" />
                {t('static.cancellation.contactSupport')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-12">
            <Building2 className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              {t('static.cancellation.ctaTitle')}
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              {t('static.cancellation.ctaSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/hotels">
                <Button size="lg" className="rounded-full px-10 text-base">
                  {t('static.cancellation.exploreHotels')}
                </Button>
              </Link>
              <Link href="/contact#send-message">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-10 text-base"
                >
                  {t('static.cancellation.talkToUs')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
