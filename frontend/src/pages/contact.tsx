import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { customFetch } from '@/api/custom-fetch';
import { useState } from 'react';
import { Link } from 'wouter';
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  Building2,
  Globe2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';

interface Office {
  city: string;
  flag: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
}

export default function Contact() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const topics = t('static.contact.topics', {
    returnObjects: true,
  }) as string[];
  const offices = t('static.contact.offices', {
    returnObjects: true,
  }) as Office[];

  const [form, setForm] = useState({
    name: isAuthenticated && user ? user.name ?? '' : '',
    email: isAuthenticated && user ? user.email ?? '' : '',
    topic: '',
    bookingRef: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    try {
      await customFetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
    } catch {
      alert('Ошибка при отправке. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[360px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&q=80&w=2000"
            alt="Contact us"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/70" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Mail className="h-4 w-4 text-amber-300" />
            {t('static.contact.heroBadge')}
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight mb-4 drop-shadow-lg">
            {t('static.contact.heroTitle')}
          </h1>
          <p className="text-lg text-white/85 leading-relaxed">
            {t('static.contact.heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Quick Contact Cards */}
      <section className="py-14 bg-muted/30 border-b border-border/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid sm:grid-cols-3 gap-5">
            {/* Live Chat */}
            <div className="bg-background border border-border/50 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">
                {t('static.contact.liveChat')}
              </h3>
              <div className="flex items-center justify-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-medium mb-2">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                {t('static.contact.availableNow')}
              </div>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {t('static.contact.liveChatDesc')}
              </p>
              <Button size="sm" className="w-full rounded-lg">
                {t('static.contact.startChat')}
              </Button>
            </div>

            {/* Email */}
            <div className="bg-background border border-border/50 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">
                {t('static.contact.email')}
              </h3>
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground font-medium mb-2">
                <Clock className="h-3.5 w-3.5" />
                {t('static.contact.emailReply')}
              </div>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {t('static.contact.emailDesc')}
              </p>
              <Button
                size="sm"
                variant="outline"
                className="w-full rounded-lg"
                onClick={() => {
                  document.getElementById('send-message')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {t('static.contact.sendEmail')}
              </Button>
            </div>

            {/* Phone */}
            <div className="bg-background border border-border/50 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">
                {t('static.contact.phone')}
              </h3>
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground font-medium mb-2">
                <Clock className="h-3.5 w-3.5" />
                {t('static.contact.phoneHours')}
              </div>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {t('static.contact.phoneNumber')}
              </p>
              <Button size="sm" variant="outline" className="w-full rounded-lg">
                {t('static.contact.callNow')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="send-message" className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-5 gap-14 items-start">
            {/* Left — Info */}
            <div className="lg:col-span-2">
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
                {t('static.contact.formEyebrow')}
              </p>
              <h2 className="font-serif text-4xl font-bold text-foreground mb-5 leading-tight">
                {t('static.contact.formTitle')}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {t('static.contact.formIntro')}
              </p>

              <div className="space-y-5">
                <div className="flex gap-4 items-start">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {t('static.contact.responseTime')}
                    </p>
                    <p className="text-muted-foreground text-sm whitespace-pre-line">
                      {t('static.contact.responseTimeText')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Globe2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {t('static.contact.languages')}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {t('static.contact.languagesText')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {t('static.contact.beforeYouWrite')}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {t('static.contact.beforeYouWriteText')}{' '}
                      <Link
                        href="/help-center"
                        className="text-primary hover:underline"
                      >
                        {t('static.contact.helpCenter')}
                      </Link>{' '}
                      {t('static.contact.beforeYouWriteText2')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-10 text-center">
                  <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto mb-5" />
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                    {t('static.contact.messageSent')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {t('static.contact.thankYou')}{' '}
                    <span className="font-medium text-foreground">
                      {form.name}
                    </span>
                    . {t('static.contact.receivedAndReply')}{' '}
                    <span className="font-medium text-foreground">
                      {form.email}
                    </span>{' '}
                    {t('static.contact.withinHours')}
                  </p>
                  <Button
                    variant="outline"
                    className="rounded-full px-8"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        name: '',
                        email: '',
                        topic: '',
                        bookingRef: '',
                        message: '',
                      });
                    }}
                  >
                    {t('static.contact.sendAnother')}
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-background border border-border/50 rounded-2xl p-8 shadow-sm space-y-5"
                >
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        {t('static.contact.fullName')}{' '}
                        <span className="text-destructive">*</span>
                      </label>
                      <Input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder={t('static.contact.fullNamePlaceholder')}
                        required
                        className="h-11"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        {t('static.contact.emailAddress')}{' '}
                        <span className="text-destructive">*</span>
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder={t('static.contact.emailPlaceholder')}
                        required
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        {t('static.contact.topic')}
                      </label>
                      <select
                        name="topic"
                        value={form.topic}
                        onChange={handleChange}
                        className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">
                          {t('static.contact.selectTopic')}
                        </option>
                        {topics.map((topic) => (
                          <option key={topic} value={topic}>
                            {topic}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        {t('static.contact.bookingRef')}
                        <span className="text-muted-foreground font-normal">
                          {' '}
                          {t('static.contact.optional')}
                        </span>
                      </label>
                      <Input
                        name="bookingRef"
                        value={form.bookingRef}
                        onChange={handleChange}
                        placeholder={t('static.contact.bookingRefPlaceholder')}
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t('static.contact.message')}{' '}
                      <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder={t('static.contact.messagePlaceholder')}
                      required
                      className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <p className="text-xs text-muted-foreground">
                      {t('static.contact.requiredHint')}{' '}
                      <span className="text-destructive">*</span>{' '}
                      {t('static.contact.requiredHintEnd')}
                    </p>
                    <Button
                      type="submit"
                      className="rounded-full px-8"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                          {t('static.contact.sending')}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          {t('static.contact.sendMessage')}
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              {t('static.contact.officesEyebrow')}
            </p>
            <h2 className="font-serif text-4xl font-bold text-foreground">
              {t('static.contact.officesTitle')}
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {offices.map((office) => (
              <div
                key={office.city}
                className="bg-background border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{office.flag}</span>
                  <div>
                    <p className="font-semibold text-foreground text-base">
                      {office.city}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Building2 className="h-3 w-3" />{' '}
                      {t('static.contact.regionalOffice')}
                    </p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-2.5 items-start text-muted-foreground">
                    <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary/60" />
                    <span className="leading-relaxed">{office.address}</span>
                  </div>
                  <div className="flex gap-2.5 items-center text-muted-foreground">
                    <Phone className="h-4 w-4 flex-shrink-0 text-primary/60" />
                    <span>{office.phone}</span>
                  </div>
                  <div className="flex gap-2.5 items-center text-muted-foreground">
                    <Mail className="h-4 w-4 flex-shrink-0 text-primary/60" />
                    <span>{office.email}</span>
                  </div>
                  <div className="flex gap-2.5 items-center text-muted-foreground">
                    <Clock className="h-4 w-4 flex-shrink-0 text-primary/60" />
                    <span>{office.hours}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
