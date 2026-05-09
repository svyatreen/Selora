import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-foreground">{t('notFoundPage.title')}</h1>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            {t('notFoundPage.body')}
          </p>

          <Button asChild className="mt-6 w-full">
            <Link href="/">{t('notFoundPage.goHome')}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
