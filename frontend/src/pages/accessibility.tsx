import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import {
  Accessibility,
  Eye,
  Ear,
  MousePointer2,
  Brain,
  Monitor,
  Smartphone,
  CheckCircle2,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Building2,
  HeartHandshake,
  Globe2,
  RefreshCw,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const STAT_ICONS = [CheckCircle2, Monitor, Globe2, HeartHandshake];
const COMMITMENT_ICONS = [Eye, Ear, MousePointer2, Brain, Monitor, Smartphone];
const STANDARD_STATUS_COLORS = [
  'text-primary bg-primary/10',
  'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
  'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
  'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
];

interface Stat {
  value: string;
  label: string;
}
interface Commitment {
  title: string;
  description: string;
  features: string[];
}
interface Standard {
  code: string;
  title: string;
  description: string;
  status: string;
}
interface Faq {
  question: string;
  answer: string;
}

function FaqItem({ question, answer }: Faq) {
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

export default function AccessibilityPage() {
  const { t } = useTranslation();
  const stats = t('static.accessibility.stats', {
    returnObjects: true,
  }) as Stat[];
  const commitments = t('static.accessibility.commitments', {
    returnObjects: true,
  }) as Commitment[];
  const standards = t('static.accessibility.standards', {
    returnObjects: true,
  }) as Standard[];
  const hotelFeatures = t('static.accessibility.hotelFeatures', {
    returnObjects: true,
  }) as string[];
  const faqs = t('static.accessibility.faqs', {
    returnObjects: true,
  }) as Faq[];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[380px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1504439904031-93ded9f93e4e?auto=format&fit=crop&q=80&w=2000"
            alt="Accessibility"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-black/72" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Accessibility className="h-4 w-4 text-amber-300" />
            {t('static.accessibility.heroBadge')}
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight mb-4 drop-shadow-lg">
            {t('static.accessibility.heroTitle')}
          </h1>
          <p className="text-lg text-white/85 leading-relaxed">
            {t('static.accessibility.heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => {
              const Icon = STAT_ICONS[i] ?? CheckCircle2;
              return (
                <div
                  key={s.label}
                  className="flex flex-col items-center gap-2"
                >
                  <Icon className="h-7 w-7 opacity-80" />
                  <span className="font-serif text-2xl md:text-3xl font-bold">
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

      {/* Commitment Statement */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
                {t('static.accessibility.commitmentEyebrow')}
              </p>
              <h2 className="font-serif text-4xl font-bold text-foreground mb-5 leading-tight">
                {t('static.accessibility.commitmentTitle')}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                {t('static.accessibility.commitmentP1')}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-5">
                {t('static.accessibility.commitmentP2')}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t('static.accessibility.commitmentP3')}
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800"
                alt="Inclusive design"
                className="w-full h-[400px] object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-5 -left-5 bg-background rounded-xl p-4 shadow-xl border border-border max-w-[210px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <HeartHandshake className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-semibold text-foreground text-sm">
                    {t('static.accessibility.inclusiveFirstTitle')}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t('static.accessibility.inclusiveFirstText')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility Features */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              {t('static.accessibility.featuresEyebrow')}
            </p>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              {t('static.accessibility.featuresTitle')}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t('static.accessibility.featuresSubtitle')}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {commitments.map((c, i) => {
              const Icon = COMMITMENT_ICONS[i] ?? Eye;
              return (
                <div
                  key={c.title}
                  className="bg-background rounded-2xl p-7 border border-border/50 shadow-sm hover:shadow-md transition-shadow group flex flex-col"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-base mb-2">
                    {c.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">
                    {c.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {c.features.map((f) => (
                      <span
                        key={f}
                        className="text-xs bg-primary/8 text-primary font-medium px-2.5 py-1 rounded-full border border-primary/15"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Standards */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              {t('static.accessibility.standardsEyebrow')}
            </p>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              {t('static.accessibility.standardsTitle')}
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {t('static.accessibility.standardsSubtitle')}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {standards.map((s, i) => {
              const statusColor =
                STANDARD_STATUS_COLORS[i] ?? STANDARD_STATUS_COLORS[0];
              return (
                <div
                  key={s.code}
                  className="bg-muted/30 border border-border/50 rounded-2xl p-6 flex gap-5 items-start hover:shadow-sm transition-shadow"
                >
                  <div className="h-12 w-12 rounded-xl bg-background border border-border/50 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-bold text-foreground">
                        {s.code}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusColor}`}
                      >
                        {s.status}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {s.title}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hotel Accessibility */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-14 items-start">
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
                {t('static.accessibility.hotelsEyebrow')}
              </p>
              <h2 className="font-serif text-4xl font-bold text-foreground mb-5 leading-tight">
                {t('static.accessibility.hotelsTitle')}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                {t('static.accessibility.hotelsP1')}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {t('static.accessibility.hotelsP2')}
              </p>
              <Link href="/contact#send-message">
                <Button className="rounded-full px-8 gap-2">
                  <MessageCircle className="h-4 w-4" />
                  {t('static.accessibility.talkToTeam')}
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {hotelFeatures.map((text) => (
                <div
                  key={text}
                  className="flex items-center gap-3 bg-background border border-border/50 rounded-xl px-5 py-3.5 shadow-sm"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              {t('static.accessibility.faqEyebrow')}
            </p>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              {t('static.accessibility.faqTitle')}
            </h2>
            <p className="text-muted-foreground">
              {t('static.accessibility.faqSubtitle')}
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FaqItem key={faq.question} {...faq} />
            ))}
          </div>
        </div>
      </section>

      {/* Feedback */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-background border border-border/50 rounded-2xl p-8 md:p-10 shadow-sm">
            <div className="grid md:grid-cols-3 gap-8 items-center text-center md:text-left">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg">
                    {t('static.accessibility.feedbackTitle')}
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  {t('static.accessibility.feedbackText')}
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-foreground font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    {t('static.accessibility.feedbackEmail')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    {t('static.accessibility.feedbackResponse')}
                  </span>
                </div>
              </div>
              <div className="flex justify-center">
                <Link href="/contact#send-message">
                  <Button size="lg" className="rounded-full px-8">
                    {t('static.accessibility.contactUs')}
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
              {t('static.accessibility.ctaTitle')}
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              {t('static.accessibility.ctaSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/hotels">
                <Button size="lg" className="rounded-full px-10 text-base">
                  {t('static.accessibility.exploreHotels')}
                </Button>
              </Link>
              <Link href="/contact#send-message">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-10 text-base"
                >
                  {t('static.accessibility.getHelp')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
