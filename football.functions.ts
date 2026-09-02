import { createServerFn } from "@tanstack/react-start";
import type { Match, MatchStatus } from "@/data/matches";
import { arLeague, arTeam } from "@/lib/football-i18n";

// TheSportsDB free tier — no API key required, worldwide coverage.
const API = "https://www.thesportsdb.com/api/v1/json/3";
const TZ = "Africa/Algiers";

type RawEvent = {
  idEvent: string;
  strEvent?: string;
  strLeague?: string;
  strLeagueBadge?: string | null;
  strHomeTeam?: string;
  strAwayTeam?: string;
  strHomeTeamBadge?: string | null;
  strAwayTeamBadge?: string | null;
  intHomeScore?: string | number | null;
  intAwayScore?: string | number | null;
  strTimestamp?: string | null;
  dateEvent?: string | null;
  strTime?: string | null;
  strStatus?: string | null;
  strProgress?: string | null;
  strVenue?: string | null;
  strSport?: string | null;
};

const LIVE_CODES = ["1H", "2H", "HT", "ET", "P", "BT", "LIVE", "INPLAY"];
const DONE_CODES = ["FT", "AET", "PEN", "AP", "MATCH FINISHED", "FINISHED"];

function palette(name: string) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) % 360;
  return `oklch(0.58 0.17 ${hash})`;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part.slice(0, 2)).join("").toUpperCase().slice(0, 4);
}

function toNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function isoOf(event: RawEvent) {
  if (event.strTimestamp) {
    return event.strTimestamp.endsWith("Z")
      ? event.strTimestamp
      : `${event.strTimestamp.replace(" ", "T")}Z`;
  }
  if (event.dateEvent) return `${event.dateEvent}T${event.strTime ?? "00:00:00"}Z`;
  return null;
}

function localTime(iso: string | null) {
  if (!iso) return "--:--";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "--:--";
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: TZ,
  }).format(date);
}

function statusOf(event: RawEvent, iso: string | null): MatchStatus {
  const code = (event.strStatus ?? "").trim().toUpperCase();
  if (DONE_CODES.includes(code)) return "finished";
  if (LIVE_CODES.includes(code) || /^\d+$/.test(code)) return "live";
  const hasScore = toNumber(event.intHomeScore) !== undefined;
  if (!iso) return hasScore ? "finished" : "upcoming";
  const kickoff = new Date(iso).getTime();
  const now = Date.now();
  if (now > kickoff + 140 * 60_000) return hasScore ? "finished" : "upcoming";
  if (now >= kickoff) return hasScore ? "live" : "upcoming";
  return "upcoming";
}

function mapEvent(event: RawEvent): Match | null {
  const home = event.strHomeTeam?.trim();
  const away = event.strAwayTeam?.trim();
  if (!home || !away) return null;
  const iso = isoOf(event);
  const status = statusOf(event, iso);
  const code = (event.strStatus ?? "").trim().toUpperCase();
  const minute =
    status === "live"
      ? code === "HT"
        ? "استراحة"
        : `'${(event.strProgress || code || "").replace(/[^0-9+]/g, "") || "•"}`
      : undefined;

  return {
    id: event.idEvent,
    league: arLeague(event.strLeague ?? ""),
    leagueBadge: event.strLeagueBadge ?? undefined,
    time: localTime(iso),
    kickoff: iso ?? undefined,
    status,
    minute,
    home: {
      name: arTeam(home),
      short: initials(home),
      color: palette(home),
      badge: event.strHomeTeamBadge ?? undefined,
    },
    away: {
      name: arTeam(away),
      short: initials(away),
      color: palette(away),
      badge: event.strAwayTeamBadge ?? undefined,
    },
    homeScore: toNumber(event.intHomeScore),
    awayScore: toNumber(event.intAwayScore),
    channel: event.strVenue?.trim() || arLeague(event.strLeague ?? ""),
  };
}

function dayString(offset: number) {
  const now = new Date();
  const target = new Date(now.getTime() + offset * 86_400_000);
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(target);
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, { headers: { accept: "application/json" } });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

/** Real fixtures/results for a given day offset (-1 yesterday, 0 today, 1 tomorrow). */
export const getMatchesByDay = createServerFn({ method: "GET" })
  .inputValidator((input: { offset: number }) => ({
    offset: Math.max(-1, Math.min(1, Math.trunc(Number(input?.offset) || 0))),
  }))
  .handler(async ({ data }) => {
    const date = dayString(data.offset);
    const day = await fetchJson<{ events: RawEvent[] | null }>(
      `${API}/eventsday.php?d=${date}&s=Soccer`,
    );

    const byId = new Map<string, Match>();
    for (const event of day?.events ?? []) {
      const match = mapEvent(event);
      if (match) byId.set(match.id, match);
    }

    if (data.offset === 0) {
      const live = await fetchJson<{ livescore: RawEvent[] | null }>(
        `${API}/livescore.php?s=Soccer`,
      );
      for (const event of live?.livescore ?? []) {
        const match = mapEvent({ ...event, strStatus: event.strStatus ?? "1H" });
        if (match) byId.set(match.id, { ...match, status: "live" });
      }
    }

    const order: Record<MatchStatus, number> = { live: 0, upcoming: 1, finished: 2 };
    return [...byId.values()].sort(
      (a, b) => order[a.status] - order[b.status] || a.time.localeCompare(b.time),
    );
  });

/** Full detail for one match. */
export const getMatchById = createServerFn({ method: "GET" })
  .inputValidator((input: { id: string }) => ({ id: String(input?.id ?? "") }))
  .handler(async ({ data }) => {
    if (!/^\d+$/.test(data.id)) return null;
    const result = await fetchJson<{ events: RawEvent[] | null }>(
      `${API}/lookupevent.php?id=${data.id}`,
    );
    const event = result?.events?.[0];
    return event ? mapEvent(event) : null;
  });

