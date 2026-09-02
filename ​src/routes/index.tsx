import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Loader2, Menu, RefreshCw, Search, Volleyball } from "lucide-react";
import type { Match, MatchStatus } from "@/data/matches";
import { getMatchesByDay } from "@/lib/football.functions";
import { MatchCard } from "@/components/MatchCard";
import { BottomNav } from "@/components/BottomNav";

const matchesQuery = (offset: number) =>
  queryOptions({
    queryKey: ["matches", offset],
    queryFn: () => getMatchesByDay({ data: { offset } }),
    staleTime: 30_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "جدول مباريات اليوم — نتائج مباشرة ومواعيد محدثة" },
      {
        name: "description",
        content:
          "جدول مباريات اليوم مباشر: نتائج حية، مواعيد بالتوقيت المحلي، وجميع الدوريات العربية والأوروبية والعالمية محدثة تلقائيًا.",
      },
      { property: "og:title", content: "جدول مباريات اليوم — نتائج مباشرة" },
      {
        property: "og:description",
        content: "نتائج مباشرة ومواعيد مباريات اليوم لكل الدوريات، محدثة تلقائيًا.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(matchesQuery(0)),
  errorComponent: () => (
    <div dir="rtl" className="grid min-h-screen place-items-center bg-background px-6 text-center">
      <p className="text-sm font-bold">تعذّر تحميل المباريات، حاول التحديث بعد قليل.</p>
    </div>
  ),
  component: Index,
});

const days: { label: string; offset: number }[] = [
  { label: "أمس", offset: -1 },
  { label: "اليوم", offset: 0 },
  { label: "غدًا", offset: 1 },
];

const groups: { key: MatchStatus; label: string }[] = [
  { key: "live", label: "مباشر الآن" },
  { key: "upcoming", label: "لم تبدأ بعد" },
  { key: "finished", label: "انتهت" },
];

const ALL = "كل المباريات";

function Index() {
  const [offset, setOffset] = useState(0);
  const [league, setLeague] = useState(ALL);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");

  const { data, isFetching, isPending, refetch } = useQuery(matchesQuery(offset));
  const dayMatches: Match[] = data ?? [];

  const leagues = useMemo(() => {
    const counts = new Map<string, number>();
    for (const match of dayMatches) counts.set(match.league, (counts.get(match.league) ?? 0) + 1);
    return [ALL, ...[...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name)];
  }, [dayMatches]);

  const filtered = useMemo(() => {
    let list = league === ALL ? dayMatches : dayMatches.filter((m) => m.league === league);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((m) =>
        [m.home.name, m.away.name, m.league, m.channel].join(" ").toLowerCase().includes(q),
      );
    }
    return list;
  }, [dayMatches, league, query]);

  const dayLabel = days.find((d) => d.offset === offset)?.label ?? "اليوم";
  const today = new Intl.DateTimeFormat("ar", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(Date.now() + offset * 86_400_000));

  return (
    <div dir="rtl" className="min-h-screen bg-background pb-24">
      <div className="mx-auto max-w-md">
        <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-4">
            <Link
              to="/more"
              aria-label="القائمة"
              className="grid size-11 place-items-center rounded-2xl bg-card text-foreground shadow-sm ring-1 ring-border"
            >
              <Menu className="size-5" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div
                className="grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground"
                style={{ boxShadow: "var(--shadow-soft)" }}
              >
                <Volleyball className="size-6" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold leading-tight">مباريات اليوم</h1>
                <p className="text-[11px] text-muted-foreground">{today}</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="بحث"
              onClick={() => {
                setShowSearch((s) => !s);
                if (showSearch) setQuery("");
              }}
              className={`grid size-11 place-items-center rounded-2xl shadow-sm ring-1 ring-border ${
                showSearch ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
              }`}
            >
              <Search className="size-5" />
            </button>
          </div>

          {showSearch && (
            <div className="px-4 pb-3">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث عن فريق أو بطولة أو ملعب..."
                className="w-full rounded-2xl bg-card px-4 py-3 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-ring"
              />
            </div>
          )}

          <div className="px-4 pb-3">
            <div className="flex gap-1 rounded-2xl bg-card p-1 ring-1 ring-border">
              {days.map((d) => (
                <button
                  key={d.label}
                  type="button"
                  onClick={() => {
                    setOffset(d.offset);
                    setLeague(ALL);
                  }}
                  className={`flex-1 rounded-xl py-2.5 text-sm font-extrabold transition-all ${
                    offset === d.offset
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
            {leagues.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLeague(l)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                  league === l
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground ring-1 ring-border"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </header>

        <main className="space-y-6 px-4 pt-4">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 animate-pulse rounded-full bg-live" />
              بيانات حية محدثة تلقائيًا كل دقيقة
            </span>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-1 font-bold text-primary"
            >
              <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} />
              تحديث
            </button>
          </div>

          {isPending ? (
            <div className="grid place-items-center py-20 text-muted-foreground">
              <Loader2 className="size-7 animate-spin text-primary" />
              <p className="mt-3 text-xs font-bold">جارٍ تحميل المباريات...</p>
            </div>
          ) : (
            <>
              {groups.map(({ key, label }) => {
                const list = filtered.filter((m) => m.status === key);
                if (list.length === 0) return null;
                return (
                  <section key={key}>
                    <div className="mb-3 flex items-center justify-between">
                      <h2 className="text-sm font-extrabold">{label}</h2>
                      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-bold text-secondary-foreground">
                        {list.length} مباراة
                      </span>
                    </div>
                    <div className="space-y-3">
                      {list.map((m) => (
                        <MatchCard key={m.id} match={m} />
                      ))}
                    </div>
                  </section>
                );
              })}
              {filtered.length === 0 && (
                <div className="py-16 text-center">
                  <div className="mx-auto mb-4 grid size-16 place-items-center rounded-3xl bg-secondary">
                    <Volleyball className="size-8 text-primary" />
                  </div>
                  <p className="text-sm font-bold">لا توجد نتائج</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    لا توجد مباريات مطابقة {query.trim() ? "لبحثك" : "في هذه البطولة"} {dayLabel}
                  </p>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
