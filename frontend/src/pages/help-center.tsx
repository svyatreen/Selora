import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  ChevronDown,
  ChevronUp,
  BookOpen,
  CreditCard,
  CalendarX,
  Star,
  ShieldCheck,
  User,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';

const CATEGORY_META: Record<
  string,
  { icon: React.ElementType; color: string; count: number }
> = {
  All: {
    icon: BookOpen,
    color: 'bg-primary/10 text-primary',
    count: 20,
  },
  Booking: {
    icon: BookOpen,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
    count: 5,
  },
  Payments: {
    icon: CreditCard,
    color:
      'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300',
    count: 4,
  },
  Cancellations: {
    icon: CalendarX,
    color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300',
    count: 4,
  },
  Reviews: {
    icon: Star,
    color:
      'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
    count: 3,
  },
  Account: {
    icon: User,
    color:
      'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300',
    count: 4,
  },
};

interface CategoryItem {
  key: string;
  label: string;
}
interface Faq {
  category: string;
  categoryKey: string;
  question: string;
  answer: string;
}

export default function HelpCenter() {
  const { t } = useTranslation();
  const categories = t('static.help.categories', {
    returnObjects: true,
  }) as CategoryItem[];
  const faqs = t('static.help.faqs', { returnObjects: true }) as Faq[];
  const topics = t('static.help.topics', { returnObjects: true }) as string[];

  const [search, setSearch] = useState('');
  const [activeCategoryKey, setActiveCategoryKey] = useState('All');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = faqs.filter((faq) => {
    const matchCat =
      activeCategoryKey === 'All' || faq.categoryKey === activeCategoryKey;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 max-w-3xl text-center text-primary-foreground">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <HelpCircle className="h-4 w-4" />
            {t('static.help.heroBadge')}
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight mb-5 drop-shadow">
            {t('static.help.heroTitle')}
          </h1>
          <p className="text-lg text-primary-foreground/80">
            {t('static.help.heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted/30 border-b border-border/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {categories.map((cat) => {
              const meta = CATEGORY_META[cat.key] ?? CATEGORY_META.All;
              const Icon = meta.icon;
              const count = cat.key === 'All' ? faqs.length : meta.count;
              const isActive = activeCategoryKey === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategoryKey(cat.key)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all text-center ${
                    isActive
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border/50 bg-background hover:border-primary/40 hover:shadow-sm'
                  }`}
                >
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center ${meta.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-foreground leading-tight">
                    {cat.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {t('static.help.articlesCount', { count })}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          {search && (
            <p className="text-sm text-muted-foreground mb-6">
              {t('static.help.resultsFor', { count: filtered.length })}{' '}
              <span className="font-semibold text-foreground">"{search}"</span>
            </p>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="text-muted-foreground text-lg mb-4">
                {t('static.help.noResults')}
              </p>
              <Button
                variant="ghost"
                onClick={() => {
                  setSearch('');
                  setActiveCategoryKey('All');
                }}
              >
                {t('static.help.clearFilters')}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((faq) => {
                const isOpen = expanded === faq.question;
                return (
                  <div
                    key={faq.question}
                    className={`border rounded-xl overflow-hidden transition-all ${
                      isOpen
                        ? 'border-primary/40 shadow-sm'
                        : 'border-border/50'
                    } bg-background`}
                  >
                    <button
                      className="w-full text-left px-6 py-5 flex items-start gap-4"
                      onClick={() => setExpanded(isOpen ? null : faq.question)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-primary">
                            {faq.category}
                          </span>
                        </div>
                        <p className="font-semibold text-foreground text-base leading-snug">
                          {faq.question}
                        </p>
                      </div>
                      <div className="flex-shrink-0 mt-1">
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-primary" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 border-t border-border/40 pt-4">
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              {t('static.help.stillNeedHelp')}
            </p>
            <h2 className="font-serif text-4xl font-bold text-foreground">
              {t('static.help.contactSupport')}
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              {t('static.help.supportLead')}
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {/* Live Chat */}
            <div className="bg-background border border-border/50 rounded-2xl p-7 text-center shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-base mb-2">
                {t('static.help.liveChat')}
              </h3>
              <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                {t('static.help.liveChatText')}
              </p>
              <div className="mt-auto space-y-5">
                <div className="flex items-center justify-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-medium">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  {t('static.help.availableNow')}
                </div>
                <Button className="w-full rounded-lg">
                  {t('static.help.startChat')}
                </Button>
              </div>
            </div>

            {/* Email */}
            <div className="bg-background border border-border/50 rounded-2xl p-7 text-center shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-base mb-2">
                {t('static.help.emailSupport')}
              </h3>
              <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                {t('static.help.emailSupportText')}
              </p>
              <div className="mt-auto space-y-5">
                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <Clock className="h-3.5 w-3.5" />
                  {t('static.help.emailReply')}
                </div>
                <Link href="/contact#send-message" className="block">
                  <Button variant="outline" className="w-full rounded-lg">
                    {t('static.help.sendEmail')}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-background border border-border/50 rounded-2xl p-7 text-center shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-base mb-2">
                {t('static.help.phoneSupport')}
              </h3>
              <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                {t('static.help.phoneSupportText')}
              </p>
              <div className="mt-auto space-y-5">
                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <Clock className="h-3.5 w-3.5" />
                  {t('static.help.phoneHours')}
                </div>
                <Button variant="outline" className="w-full rounded-lg">
                  +33 1 23 45 67 89
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </Layout>
  );
}
