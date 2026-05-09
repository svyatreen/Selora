import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Cookie, X } from 'lucide-react';

const STORAGE_KEY = 'selora_cookie_consent';

export function CookieConsent() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  function acceptAll() {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  }

  function declineNonEssential() {
    localStorage.setItem(STORAGE_KEY, 'declined');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="mx-auto max-w-4xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl">
        <div className="p-5 md:p-6">
          <div className="flex items-start gap-4">
            <div className="mt-0.5 flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Cookie className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  {t('cookieConsent.title')}
                </h3>
                <button
                  onClick={declineNonEssential}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label={t('cookieConsent.close')}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {t('cookieConsent.body')}{' '}
                <Link
                  href="/cookie-policy"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {t('cookieConsent.policyLink')}
                </Link>
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button
                  onClick={acceptAll}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5"
                >
                  {t('cookieConsent.acceptAll')}
                </Button>
                <Button
                  onClick={declineNonEssential}
                  variant="outline"
                  size="sm"
                  className="rounded-lg px-5 border-gray-300 dark:border-gray-600"
                >
                  {t('cookieConsent.essentialOnly')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
