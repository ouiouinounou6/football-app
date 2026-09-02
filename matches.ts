export type MatchStatus = "live" | "finished" | "upcoming";

export type Team = {
  name: string;
  short: string;
  color: string;
  badge?: string | undefined;
};

export type Match = {
  id: string;
  league: string;
  leagueBadge?: string | undefined;
  time: string;
  kickoff?: string | undefined;
  status: MatchStatus;
  minute?: string | undefined;
  home: Team;
  away: Team;
  homeScore?: number | undefined;
  awayScore?: number | undefined;
  channel: string;
};

export const leagues = [
  "كل المباريات",
  "الدوري الإنجليزي",
  "الدوري الإسباني",
  "دوري أبطال أوروبا",
  "الدوري السعودي",
  "الدوري الإيطالي",
];

export const matches: Match[] = [
  {
    id: "m1",
    league: "الدوري الإنجليزي",
    time: "18:30",
    status: "live",
    minute: "'67",
    home: { name: "ليفربول", short: "ليف", color: "oklch(0.55 0.19 25)" },
    away: { name: "مانشستر سيتي", short: "مان", color: "oklch(0.72 0.11 220)" },
    homeScore: 2,
    awayScore: 1,
    channel: "beIN SPORTS 1",
  },
  {
    id: "m2",
    league: "الدوري السعودي",
    time: "19:00",
    status: "live",
    minute: "'34",
    home: { name: "الهلال", short: "هلا", color: "oklch(0.58 0.18 258)" },
    away: { name: "الاتحاد", short: "اتح", color: "oklch(0.62 0.16 60)" },
    homeScore: 0,
    awayScore: 0,
    channel: "SSC 1",
  },
  {
    id: "m3",
    league: "الدوري الإنجليزي",
    time: "16:00",
    status: "finished",
    home: { name: "برايتون", short: "برا", color: "oklch(0.6 0.16 250)" },
    away: { name: "تشيلسي", short: "تشي", color: "oklch(0.5 0.2 265)" },
    homeScore: 3,
    awayScore: 4,
    channel: "beIN SPORTS 2",
  },
  {
    id: "m4",
    league: "الدوري الإيطالي",
    time: "15:00",
    status: "finished",
    home: { name: "يوفنتوس", short: "يوف", color: "oklch(0.35 0.01 260)" },
    away: { name: "إنتر ميلان", short: "إنت", color: "oklch(0.5 0.19 265)" },
    homeScore: 1,
    awayScore: 3,
    channel: "starzplay",
  },
  {
    id: "m5",
    league: "دوري أبطال أوروبا",
    time: "22:00",
    status: "upcoming",
    home: { name: "ريال مدريد", short: "ريا", color: "oklch(0.85 0.03 260)" },
    away: { name: "بايرن ميونخ", short: "باي", color: "oklch(0.55 0.2 25)" },
    channel: "beIN SPORTS 1",
  },
  {
    id: "m6",
    league: "الدوري الإسباني",
    time: "22:30",
    status: "upcoming",
    home: { name: "برشلونة", short: "برش", color: "oklch(0.45 0.15 280)" },
    away: { name: "إشبيلية", short: "إشب", color: "oklch(0.68 0.15 25)" },
    channel: "beIN SPORTS 3",
  },
  {
    id: "m7",
    league: "الدوري السعودي",
    time: "21:15",
    status: "upcoming",
    home: { name: "النصر", short: "نصر", color: "oklch(0.62 0.18 130)" },
    away: { name: "الأهلي", short: "أهل", color: "oklch(0.62 0.18 155)" },
    channel: "SSC 2",
  },
];

export const yesterdayMatches: Match[] = [
  {
    id: "y1",
    league: "الدوري الإسباني",
    time: "21:00",
    status: "finished",
    home: { name: "أتلتيكو مدريد", short: "أتل", color: "oklch(0.55 0.2 25)" },
    away: { name: "فالنسيا", short: "فال", color: "oklch(0.75 0.1 85)" },
    homeScore: 2,
    awayScore: 0,
    channel: "beIN SPORTS 3",
  },
  {
    id: "y2",
    league: "الدوري الإنجليزي",
    time: "19:30",
    status: "finished",
    home: { name: "أرسنال", short: "أرس", color: "oklch(0.58 0.2 25)" },
    away: { name: "تشيلسي", short: "تشي", color: "oklch(0.5 0.18 265)" },
    homeScore: 1,
    awayScore: 1,
    channel: "beIN SPORTS 2",
  },
  {
    id: "y3",
    league: "دوري أبطال أوروبا",
    time: "22:00",
    status: "finished",
    home: { name: "باريس سان جيرمان", short: "باري", color: "oklch(0.45 0.15 260)" },
    away: { name: "بوروسيا دورتموند", short: "دور", color: "oklch(0.8 0.16 95)" },
    homeScore: 3,
    awayScore: 1,
    channel: "beIN SPORTS 1",
  },
];

export const tomorrowMatches: Match[] = [
  {
    id: "t1",
    league: "الدوري الإنجليزي",
    time: "17:00",
    status: "upcoming",
    home: { name: "مانشستر يونايتد", short: "يون", color: "oklch(0.55 0.19 25)" },
    away: { name: "توتنهام", short: "توت", color: "oklch(0.8 0.02 260)" },
    channel: "beIN SPORTS 2",
  },
  {
    id: "t2",
    league: "الدوري الإيطالي",
    time: "21:45",
    status: "upcoming",
    home: { name: "نابولي", short: "ناب", color: "oklch(0.62 0.12 230)" },
    away: { name: "ميلان", short: "ميل", color: "oklch(0.5 0.18 25)" },
    channel: "starzplay",
  },
  {
    id: "t3",
    league: "الدوري السعودي",
    time: "20:00",
    status: "upcoming",
    home: { name: "الأهلي", short: "أهل", color: "oklch(0.62 0.18 155)" },
    away: { name: "التعاون", short: "تعا", color: "oklch(0.7 0.14 85)" },
    channel: "SSC 1",
  },
];

export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  league: string;
  time: string;
};

export const news: NewsItem[] = [
  {
    id: "n1",
    title: "ليفربول يواصل صدارته بفوز مثير على مانشستر سيتي",
    summary:
      "حسم ليفربول قمة الجولة أمام مانشستر سيتي بنتيجة 2-1 في مباراة شهدت أداءً هجوميًا رائعًا من الفريقين، ليعزز الريدز موقعه في صدارة الدوري الإنجليزي.",
    league: "الدوري الإنجليزي",
    time: "منذ ساعة",
  },
  {
    id: "n2",
    title: "الكلاسيكو يقترب: ريال مدريد وبرشلونة في جاهزية كاملة",
    summary:
      "أنهى الفريقان تحضيراتهما لموقعة الكلاسيكو المنتظرة نهاية الأسبوع، وسط ترقب جماهيري واسع وعودة المصابين إلى تدريبات الفريقين.",
    league: "الدوري الإسباني",
    time: "منذ 3 ساعات",
  },
  {
    id: "n3",
    title: "الهلال والاتحاد.. ديربي الرياض يشعل دوري روشن",
    summary:
      "تتجه الأنظار إلى ملعب المملكة أرينا حيث يلتقي الهلال بالاتحاد في قمة نارية ضمن منافسات دوري روشن السعودي للمحترفين.",
    league: "الدوري السعودي",
    time: "منذ 5 ساعات",
  },
  {
    id: "n4",
    title: "إنتر يكتسح يوفنتوس بثلاثية ويعتلي صدارة الكالتشيو",
    summary:
      "حقق إنتر ميلان فوزًا عريضًا على يوفنتوس بثلاثة أهداف مقابل هدف في ديربي إيطاليا، لينفرد بصدارة الدوري الإيطالي.",
    league: "الدوري الإيطالي",
    time: "منذ 8 ساعات",
  },
  {
    id: "n5",
    title: "قرعة ربع نهائي دوري الأبطال تسفر عن مواجهات نارية",
    summary:
      "أسفرت قرعة الدور ربع النهائي عن مواجهات قوية أبرزها ريال مدريد ضد بايرن ميونخ في إعادة لنهائيات سابقة.",
    league: "دوري أبطال أوروبا",
    time: "أمس",
  },
];

