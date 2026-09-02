import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Goal, Shield, Square, Tv } from "lucide-react";
import type { Match } from "@/data/matches";
import { getMatchById } from "@/lib/football.functions";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/matches/$matchId")({
  loader: async ({ params }) => {
    const match = await getMatchById({ data: { id: params.matchId } });
    if (!match) throw notFound();
    return match;
  },
  head: ({ loaderData }) => {
    const title = loaderData
      ? `${loaderData.home.name} ضد ${loaderData.away.name} — تفاصيل المباراة`
      : "المباراة غير موجودة — جدول";
    const description = loaderData
      ? `إحصائيات ومسار وتشكيلة مباراة ${loaderData.home.name} و${loaderData.away.name}.`
      : "تعذر العثور على تفاصيل المباراة المطلوبة.";
    return { meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ] };
  },
  component: MatchDetails,
});

type Stat = { label: string; home: number; away: number; suffix?: string };
type TimelineEvent = { minute: string; team: "home" | "away"; type: "goal" | "card" | "var" | "sub"; title: string; player: string };

const playerNames = ["حارس المرمى", "الظهير الأيمن", "قلب الدفاع", "قلب الدفاع", "الظهير الأيسر", "محور الارتكاز", "وسط الملعب", "صانع الألعاب", "الجناح الأيمن", "رأس الحربة", "الجناح الأيسر"];
const positions = [
  [50, 91], [17, 71], [38, 76], [62, 76], [83, 71], [50, 59], [28, 48], [72, 48], [18, 28], [50, 18], [82, 28],
];

function makeStats(match: Match): Stat[] {
  const homeLead = (match.homeScore ?? 1) >= (match.awayScore ?? 1);
  return [
    { label: "الاستحواذ", home: homeLead ? 57 : 44, away: homeLead ? 43 : 56, suffix: "%" },
    { label: "التسديدات", home: homeLead ? 14 : 9, away: homeLead ? 8 : 15 },
    { label: "على المرمى", home: 6, away: 5 },
    { label: "الركنيات", home: 7, away: 4 },
    { label: "التسلل", home: 2, away: 3 },
    { label: "البطاقات", home: 1, away: 2 },
  ];
}

function makeTimeline(match: Match): TimelineEvent[] {
  return [
    { minute: "12'", team: "home", type: "goal", title: "هدف", player: `${match.home.name} · المهاجم` },
    { minute: "28'", team: "away", type: "card", title: "بطاقة صفراء", player: `${match.away.name} · المدافع` },
    { minute: "45+2'", team: "away", type: "goal", title: "هدف", player: `${match.away.name} · الجناح` },
    { minute: "61'", team: "home", type: "var", title: "مراجعة تقنية الفيديو", player: "تأكيد قرار الحكم" },
    { minute: "73'", team: "home", type: "sub", title: "تبديل", player: `${match.home.name} · دخول لاعب الوسط` },
    { minute: "84'", team: "away", type: "goal", title: "هدف", player: `${match.away.name} · المهاجم` },
  ];
}

function Crest({ team }: { team: Match["home"] }) {
  if (team.badge)
    return <img src={team.badge} alt={`شعار ${team.name}`} width={56} height={56} className="size-14 rounded-full bg-card object-contain p-1 ring-2 ring-border" />;
  return <div className="grid size-14 place-items-center rounded-full text-xs font-black text-primary-foreground ring-2 ring-border" style={{ backgroundColor: team.color }}>{team.short}</div>;
}

function MatchHeader({ match }: { match: Match }) {
  const played = match.status !== "upcoming";
  return (
    <section className="border-b border-border bg-card px-4 pb-6 pt-3">
      <div className="mb-6 flex items-center justify-between">
        <Button asChild variant="ghost" size="icon" className="rounded-xl" aria-label="العودة للمباريات">
          <Link to="/"><ArrowRight /></Link>
        </Button>
        <div className="text-center"><p className="text-xs font-extrabold text-primary">{match.league}</p><p className="mt-1 text-[11px] text-muted-foreground">تفاصيل المباراة</p></div>
        <Button variant="ghost" size="icon" className="rounded-xl" aria-label="القناة الناقلة"><Tv /></Button>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex flex-col items-center gap-2 text-center"><Crest team={match.home} /><p className="text-sm font-black">{match.home.name}</p></div>
        <div className="min-w-24 text-center">
          <p className={cn("text-3xl font-black tabular-nums", match.status === "live" && "text-live")}>{played ? `${match.homeScore} - ${match.awayScore}` : match.time}</p>
          <p className="mt-2 text-[11px] font-bold text-muted-foreground">{match.status === "live" ? `مباشر ${match.minute}` : match.status === "finished" ? "انتهت" : "لم تبدأ"}</p>
        </div>
        <div className="flex flex-col items-center gap-2 text-center"><Crest team={match.away} /><p className="text-sm font-black">{match.away.name}</p></div>
      </div>
    </section>
  );
}

function Statistics({ match }: { match: Match }) {
  return <div className="space-y-5 py-3">{makeStats(match).map((stat) => {
    const total = Math.max(stat.home + stat.away, 1);
    return <div key={stat.label}>
      <div className="mb-2 grid grid-cols-[44px_1fr_44px] items-center text-center text-xs font-black"><span>{stat.home}{stat.suffix}</span><span className="text-muted-foreground">{stat.label}</span><span>{stat.away}{stat.suffix}</span></div>
      <div dir="ltr" className="flex h-2 gap-1 overflow-hidden rounded-full bg-muted"><span className="bg-primary" style={{ width: `${stat.home / total * 100}%` }} /><span className="bg-live" style={{ width: `${stat.away / total * 100}%` }} /></div>
    </div>;
  })}</div>;
}

function EventIcon({ type }: { type: TimelineEvent["type"] }) {
  if (type === "goal") return <Goal className="size-4 text-success" />;
  if (type === "card") return <Square className="size-4 fill-warning text-warning" />;
  if (type === "var") return <span className="text-[9px] font-black text-primary">VAR</span>;
  return <span className="text-sm font-black text-success">⇄</span>;
}

function Timeline({ match }: { match: Match }) {
  return <div className="relative py-3 before:absolute before:inset-y-5 before:right-8 before:w-px before:bg-border">{makeTimeline(match).map((event) => <div key={`${event.minute}-${event.title}`} className="relative mb-5 grid grid-cols-[64px_1fr] gap-3">
    <div className="z-10 flex items-center justify-center"><span className="grid size-9 place-items-center rounded-full bg-card ring-1 ring-border"><EventIcon type={event.type} /></span></div>
    <div className={cn("rounded-2xl bg-card p-3 ring-1 ring-border", event.team === "away" && "border-l-2 border-live")}><div className="flex justify-between gap-2"><strong className="text-xs">{event.title}</strong><span className="text-xs font-black tabular-nums text-primary">{event.minute}</span></div><p className="mt-1 text-[11px] text-muted-foreground">{event.player}</p></div>
  </div>)}</div>;
}

function Lineup({ match }: { match: Match }) {
  const [side, setSide] = useState<"home" | "away">("home");
  const team = match[side];
  return <div className="py-3">
    <div className="mb-4 grid grid-cols-2 rounded-2xl bg-muted p-1">
      {(["home", "away"] as const).map((value) => <Button key={value} variant={side === value ? "default" : "ghost"} className="h-10 rounded-xl" onClick={() => setSide(value)}>{match[value].name}</Button>)}
    </div>
    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-pitch ring-1 ring-border">
      <div className="absolute inset-3 rounded-xl border-2 border-pitch-line/70" />
      <div className="absolute inset-x-3 top-1/2 border-t-2 border-pitch-line/70" />
      <div className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-pitch-line/70" />
      <div className="absolute left-1/2 top-3 h-16 w-36 -translate-x-1/2 border-2 border-t-0 border-pitch-line/70" />
      <div className="absolute bottom-3 left-1/2 h-16 w-36 -translate-x-1/2 border-2 border-b-0 border-pitch-line/70" />
      {playerNames.map((name, index) => {
        const position = positions[index];
        if (!position) return null;
        return <div key={name + index} className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center" style={{ left: `${position[0]}%`, top: `${position[1]}%` }}><span className="grid size-8 place-items-center rounded-full bg-card text-[10px] font-black text-primary shadow-md ring-2 ring-primary">{index + 1}</span><span className="mt-1 max-w-20 truncate rounded bg-foreground/80 px-1.5 py-0.5 text-[8px] font-bold text-background">{name}</span></div>;
      })}
    </div>
    <p className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground"><Shield className="size-4" />خطة {team.name}: 4-3-3</p>
  </div>;
}

function MatchDetails() {
  const match = Route.useLoaderData();
  return <div dir="rtl" className="min-h-screen bg-background pb-8"><div className="mx-auto max-w-md"><MatchHeader match={match} /><main className="px-4 pt-4">
    <Tabs defaultValue="stats" dir="rtl">
      <TabsList className="grid h-12 w-full grid-cols-3 rounded-2xl bg-card p-1 ring-1 ring-border">
        <TabsTrigger value="stats" className="h-10 rounded-xl text-xs font-extrabold">الإحصائيات</TabsTrigger>
        <TabsTrigger value="timeline" className="h-10 rounded-xl text-xs font-extrabold">مسار المباراة</TabsTrigger>
        <TabsTrigger value="lineup" className="h-10 rounded-xl text-xs font-extrabold">التشكيلة</TabsTrigger>
      </TabsList>
      <TabsContent value="stats" className="mt-4 rounded-3xl bg-card p-4 ring-1 ring-border"><Statistics match={match} /></TabsContent>
      <TabsContent value="timeline" className="mt-4"><Timeline match={match} /></TabsContent>
      <TabsContent value="lineup" className="mt-4"><Lineup match={match} /></TabsContent>
    </Tabs>
  </main></div></div>;
          }
