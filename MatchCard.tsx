import type { Match } from "@/data/matches";
import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

function Crest({ short, color, badge, name }: { short: string; color: string; badge?: string | undefined; name: string }) {
  if (badge) {
    return (
      <img
        src={badge}
        alt={`شعار ${name}`}
        loading="lazy"
        width={48}
        height={48}
        className="size-12 shrink-0 rounded-full bg-card object-contain p-1 ring-2 ring-border/60"
      />
    );
  }
  return (
    <div
      className="grid size-12 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white ring-2 ring-border/60"
      style={{ backgroundColor: color }}
    >
      {short}
    </div>
  );
}

export function MatchCard({ match }: { match: Match }) {
  const isLive = match.status === "live";
  const played = match.status !== "upcoming";

  return (
    <Link
      to="/matches/$matchId"
      params={{ matchId: match.id }}
      aria-label={`تفاصيل مباراة ${match.home.name} و${match.away.name}`}
      className="block rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      preload="intent"
    >
    <article className="overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-border transition-transform active:scale-[0.99]">
      {/* League header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="text-xs font-extrabold text-primary">{match.league}</span>
        {isLive ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-live/10 px-2.5 py-1 text-[11px] font-extrabold text-live ring-1 ring-live/30">
            <span className="size-1.5 animate-pulse rounded-full bg-live" />
            مباشر {match.minute}
          </span>
        ) : match.status === "finished" ? (
          <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
            انتهت
          </span>
        ) : (
          <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold text-secondary-foreground">
            قادمة
          </span>
        )}
      </div>

      {/* Teams + score */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-5">
        <div className="flex flex-col items-center gap-2 text-center">
          <Crest short={match.home.short} color={match.home.color} badge={match.home.badge} name={match.home.name} />
          <span className="text-[13px] font-extrabold leading-tight">{match.home.name}</span>
        </div>

        <div className="min-w-[72px] text-center">
          {played ? (
            <p
              className={`rounded-xl px-3 py-1.5 text-xl font-extrabold tabular-nums ${
                isLive
                  ? "bg-live/10 text-live ring-1 ring-live/20"
                  : "bg-secondary text-foreground"
              }`}
            >
              {match.homeScore} - {match.awayScore}
            </p>
          ) : (
            <p className="rounded-xl bg-secondary px-3 py-1.5 text-lg font-extrabold tabular-nums text-primary">
              {match.time}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <Crest short={match.away.short} color={match.away.color} badge={match.away.badge} name={match.away.name} />
          <span className="text-[13px] font-extrabold leading-tight">{match.away.name}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground">
        <span>{match.channel}</span>
        <span className="inline-flex items-center gap-1 font-bold text-primary">
          التفاصيل
          <ChevronLeft className="size-3.5" />
        </span>
      </div>
    </article>
    </Link>
  );
}

