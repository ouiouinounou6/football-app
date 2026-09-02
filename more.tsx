import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Globe,
  Info,
  ListOrdered,
  Moon,
  Newspaper,
  Settings,
  Target,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/more")({
  head: () => ({
    meta: [
      { title: "المزيد — الإعدادات" },
      { name: "description", content: "إعدادات التطبيق: المظهر واللغة وروابط سريعة." },
      { property: "og:title", content: "المزيد — الإعدادات" },
      { property: "og:description", content: "إعدادات التطبيق: المظهر واللغة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MorePage,
});

function MorePage() {
  const [lang, setLang] = useState<"ar" | "en">("ar");

  return (
    <div dir="rtl" className="min-h-screen bg-background pb-24">
      <div className="mx-auto max-w-md">
        <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-4">
            <Link
              to="/"
              aria-label="رجوع"
              className="grid size-11 place-items-center rounded-2xl bg-card text-foreground shadow-sm ring-1 ring-border"
            >
              <ArrowRight className="size-5" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground">
                <Settings className="size-6" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold leading-tight">المزيد</h1>
                <p className="text-[11px] text-muted-foreground">الإعدادات والخيارات</p>
              </div>
            </div>
            <div className="size-11" />
          </div>
        </header>

        <main className="space-y-6 px-4 pt-4">
          <section>
            <h2 className="mb-3 text-sm font-extrabold">الإعدادات</h2>
            <div className="divide-y divide-border rounded-3xl bg-card shadow-sm ring-1 ring-border">
              <div className="flex w-full items-center justify-between px-4 py-4">
                <span className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
                    <Moon className="size-5" />
                  </span>
                  <span className="text-sm font-bold">الوضع الليلي</span>
                </span>
                <span className="rounded-full bg-primary/15 px-3 py-1 text-[11px] font-extrabold text-primary">
                  مفعّل دائمًا
                </span>
              </div>


              <button
                type="button"
                onClick={() => setLang(lang === "ar" ? "en" : "ar")}
                className="flex w-full items-center justify-between px-4 py-4"
              >
                <span className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
                    <Globe className="size-5" />
                  </span>
                  <span className="text-sm font-bold">اللغة</span>
                </span>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
                  {lang === "ar" ? "العربية" : "English"}
                </span>
              </button>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-extrabold">روابط سريعة</h2>
            <div className="divide-y divide-border rounded-3xl bg-card shadow-sm ring-1 ring-border">
              <Link to="/standings" className="flex items-center gap-3 px-4 py-4">
                <span className="grid size-10 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
                  <ListOrdered className="size-5" />
                </span>
                <span className="text-sm font-bold">ترتيب الدوريات</span>
              </Link>
              <Link to="/scorers" className="flex items-center gap-3 px-4 py-4">
                <span className="grid size-10 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
                  <Target className="size-5" />
                </span>
                <span className="text-sm font-bold">قائمة الهدافين</span>
              </Link>
              <Link to="/news" className="flex items-center gap-3 px-4 py-4">
                <span className="grid size-10 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
                  <Newspaper className="size-5" />
                </span>
                <span className="text-sm font-bold">الأخبار</span>
              </Link>
            </div>
          </section>

          <section className="rounded-3xl bg-card p-4 shadow-sm ring-1 ring-border">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
                <Info className="size-5" />
              </span>
              <div>
                <p className="text-sm font-bold">حول التطبيق</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  جدول مباريات اليوم — الإصدار 1.0
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}

