import { Link, useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Building2, User, LogOut, Menu, Sun, Moon, Heart, LayoutDashboard } from 'lucide-react';
import { CurrencyToggle } from '@/components/layout/CurrencyToggle';
import { LanguageToggle } from '@/components/layout/LanguageToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Navbar() {
  const { t } = useTranslation();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();
  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  const NavLinks = () => (
    <>
      <Link
        href="/hotels"
        className="text-base font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        {t('nav.findHotel')}
      </Link>
      {isAuthenticated && (
        <Link
          href="/favorites"
          className="text-base font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          {t('nav.favorites')}
        </Link>
      )}
      {isAdmin && (
        <Link
          href="/admin"
          className="text-base font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          {t('nav.adminDashboard')}
        </Link>
      )}
    </>
  );

  const IconLink = ({
    href,
    icon: Icon,
    label,
    badge,
  }: {
    href: string;
    icon: typeof Heart;
    label: string;
    badge?: number;
  }) => (
    <Link href={href}>
      <Button
        variant="ghost"
        size="icon"
        aria-label={label}
        title={label}
        className="relative h-10 w-10"
      >
        <Icon className="h-5 w-5" />
        {typeof badge === 'number' && badge > 0 && (
          <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
            {badge}
          </span>
        )}
      </Button>
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Building2 className="h-7 w-7 text-primary" />
            <span className="font-serif text-2xl font-bold tracking-tight text-primary">
              Selora
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/hotels"
              className="text-base font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {t('nav.findHotel')}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle />
          <CurrencyToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={t('nav.toggleTheme')}
            className="h-10 w-10"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <div className="hidden sm:flex items-center gap-1">
            {isAuthenticated && (
              <IconLink href="/favorites" icon={Heart} label={t('nav.favorites')} />
            )}
            {isAuthenticated && isAdmin && (
              <IconLink href="/admin" icon={LayoutDashboard} label={t('nav.adminDashboard')} />
            )}
          </div>

          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="lg" className="hidden sm:inline-flex text-base">
                  {t('nav.login')}
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" className="text-base">{t('nav.signup')}</Button>
              </Link>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-11 w-11 rounded-full"
                >
                  <Avatar
                    key={user?.avatarUrl || 'no-avatar-nav'}
                    className="h-11 w-11"
                  >
                    {user?.avatarUrl ? (
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                    ) : null}
                    <AvatarFallback className="bg-primary/10 text-primary text-base font-serif font-bold">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="flex w-full cursor-pointer items-center"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>{t('nav.profile')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('nav.logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-10 w-10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">{t('nav.toggleMenu')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col gap-4 pt-10">
              <NavLinks />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
