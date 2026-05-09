import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Building2 } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTelegram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer links */}
        <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
          <div>
            <h3 className="text-base font-semibold uppercase tracking-wider text-foreground">
              {t('footer.destinations')}
            </h3>
            <ul className="mt-5 space-y-3">
              {['Paris', 'Tokyo', 'Bali', 'London'].map((city) => (
                <li key={city}>
                  <Link
                    href={`/hotels?city=${city}`}
                    className="text-base text-muted-foreground transition-colors hover:text-primary"
                  >
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold uppercase tracking-wider text-foreground">
              {t('footer.company')}
            </h3>
            <ul className="mt-5 space-y-3">
              <li><Link href="/about" className="text-base text-muted-foreground transition-colors hover:text-primary">{t('footer.aboutUs')}</Link></li>
              <li><Link href="/press" className="text-base text-muted-foreground transition-colors hover:text-primary">{t('footer.press')}</Link></li>
              <li><Link href="/blog" className="text-base text-muted-foreground transition-colors hover:text-primary">{t('footer.blog')}</Link></li>
              <li><Link href="/careers" className="text-base text-muted-foreground transition-colors hover:text-primary">{t('footer.careers')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold uppercase tracking-wider text-foreground">
              {t('footer.support')}
            </h3>
            <ul className="mt-5 space-y-3">
              <li><Link href="/help-center" className="text-base text-muted-foreground transition-colors hover:text-primary">{t('footer.helpCenter')}</Link></li>
              <li><Link href="/contact" className="text-base text-muted-foreground transition-colors hover:text-primary">{t('footer.contactUs')}</Link></li>
              <li><Link href="/cancellation-policy" className="text-base text-muted-foreground transition-colors hover:text-primary">{t('footer.cancellationPolicy')}</Link></li>
              <li><Link href="/safety" className="text-base text-muted-foreground transition-colors hover:text-primary">{t('footer.safety')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold uppercase tracking-wider text-foreground">
              {t('footer.legal')}
            </h3>
            <ul className="mt-5 space-y-3">
              <li><Link href="/privacy-policy" className="text-base text-muted-foreground transition-colors hover:text-primary">{t('footer.privacy')}</Link></li>
              <li><Link href="/terms-of-service" className="text-base text-muted-foreground transition-colors hover:text-primary">{t('footer.terms')}</Link></li>
              <li><Link href="/cookie-policy" className="text-base text-muted-foreground transition-colors hover:text-primary">{t('footer.cookies')}</Link></li>
              <li><Link href="/accessibility" className="text-base text-muted-foreground transition-colors hover:text-primary">{t('footer.accessibility')}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center gap-4 border-t py-8 sm:flex-row sm:justify-between">
          <p className="text-base text-muted-foreground order-2 sm:order-1">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>

          <Link href="/" className="flex items-center gap-2 order-1 sm:order-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-serif text-xl font-bold text-primary">
              Selora
            </span>
          </Link>

          <div className="flex items-center gap-5 order-3">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground transition-colors hover:text-primary"><FaFacebook className="h-6 w-6" /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground transition-colors hover:text-primary"><FaInstagram className="h-6 w-6" /></a>
            <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="text-muted-foreground transition-colors hover:text-primary"><FaTelegram className="h-6 w-6" /></a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="text-muted-foreground transition-colors hover:text-primary"><FaXTwitter className="h-6 w-6" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
