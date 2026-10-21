/* SolarLog — PWA monitor Ares. Reusa a API oficial; histórico vem da nuvem Ares. */
"use strict";
const BASE = "https://appcloud.areswatt.com/prod-api/";
const $ = (s, r = document) => r.querySelector(s);
const el = (h) => { const t = document.createElement("template"); t.innerHTML = h.trim(); return t.content.firstChild; };
const app = $("#app");

/* ---------- ícones (stroke 1.7, uma gramática) ---------- */
const svg = (p, w = 1.7) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const I = {
  bolt: svg('<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>'),
  chip: svg('<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M10 10h4v4h-4zM9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>'),
  hist: svg('<path d="M3 3v18h18M7 15l4-5 3 3 5-7"/>'),
  bell: svg('<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"/>'),
  gear: svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
  close: svg('<path d="M6 6l12 12M18 6 6 18"/>', 2),
  chevL: svg('<path d="M15 6l-6 6 6 6"/>', 2),
  chevR: svg('<path d="M9 6l6 6-6 6"/>', 2),
  coin: svg('<circle cx="12" cy="12" r="9"/><path d="M15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .8-3 2s1.3 1.7 3 2 3 .8 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5M12 6v2M12 16v2"/>'),
  leaf: svg('<path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15M5 19l7-7"/>'),
  curve: svg('<path d="M3 20h18M4 17c3 0 4-11 8-11s5 11 8 11"/>'),
  bars: svg('<path d="M6 20V10M12 20V4M18 20v-7"/>'),
  target: svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'),
  cal: svg('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
  globe: svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'),
  thermo: svg('<path d="M14 14.8V4a2 2 0 1 0-4 0v10.8a4 4 0 1 0 4 0z"/>'),
  wave: svg('<path d="M2 12c2-5 4-5 6 0s4 5 6 0 4-5 6 0"/>'),
  plug: svg('<path d="M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0zM12 17v5"/>'),
  noplug: svg('<path d="M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0zM12 17v5M3 3l18 18"/>'),
  panel: svg('<path d="M4 4h16l-2 11H6zM9 4l-1 11M15 4l1 11M5 9.5h14M12 15v5M8 20h8"/>'),
  conv: svg('<path d="M4 8h13l-3-3M20 16H7l3 3"/>'),
  trophy: svg('<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 3M17 6h3a3 3 0 0 1-3 3"/>'),
  info: svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'),
  pin: svg('<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>'),
  off: svg('<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>'),
  logout: svg('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>'),
};

/* ---------- ajustes (só neste aparelho; nada sensível) ---------- */
const CFG = (() => {
  let c = {};
  try { c = JSON.parse(localStorage.getItem("solarlog_cfg") || "{}"); } catch {}
  // co2: fator médio do SIN (MCTI) em kg/kWh; tarifa e kWp editáveis em Ajustes
  return { name: "", tarifa: 0.9, invest: 0, kwp: 0, co2: 0.0385, tcoef: 0.30, theme: "system", lat: -23.55, lon: -46.63, geo: false, ...c };
})();
const saveCfg = () => { try { localStorage.setItem("solarlog_cfg", JSON.stringify(CFG)); } catch {} };

const darkMQ = matchMedia("(prefers-color-scheme: dark)");
function applyTheme() {
  const dark = CFG.theme === "dark" || (CFG.theme === "system" && darkMQ.matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  const m = $('meta[name="theme-color"]'); if (m) m.content = dark ? "#121214" : "#f3f0eb";
}
darkMQ.addEventListener?.("change", applyTheme);
applyTheme();

/* ---------- sessão / auth ---------- */
const S = {
  get token() { return sessionStorage.getItem("ares_tok"); },
  set token(v) { v ? sessionStorage.setItem("ares_tok", v) : sessionStorage.removeItem("ares_tok"); },
  get uid() { return sessionStorage.getItem("ares_uid"); },
  set uid(v) { v ? sessionStorage.setItem("ares_uid", v) : sessionStorage.removeItem("ares_uid"); },
  get lang() { return "pt-BR"; },
};

async function api(path, { method = "GET", params, auth = true } = {}) {
  let url = BASE + path;
  const headers = { lang: S.lang };
  let body;
  if (auth && S.token) headers.Authorization = "Bearer " + S.token;
  if (method === "GET" && params) url += "?" + new URLSearchParams(flat(params)).toString();
  else if (params != null) { body = JSON.stringify(params); headers["Content-Type"] = "application/json"; }
  const r = await fetch(url, { method, headers, body });
  if (r.status === 401 || r.status === 403) { S.token = null; throw new AuthError(); }
  if (!r.ok) throw new Error("HTTP " + r.status);
  return r.json();
}
function flat(o) { const out = {}; for (const k in o) out[k] = Array.isArray(o[k]) ? o[k].join(",") : o[k]; return out; }
class AuthError extends Error {}

async function login(user, pw) {
  const r = await api("app/user/login", { method: "POST", auth: false, params: { username: user, password: pw } });
  if (r.code !== 200) throw new Error(r.msg || "Login falhou");
  S.token = r.token;
  const info = await api("getInfo");
  S.uid = info.user.userId;
  return info;
}

/* histórico antigo ficava em IndexedDB local; agora vem da nuvem Ares. Limpa o resto. */
try { indexedDB.deleteDatabase("solarlog"); } catch {}

/* ---------- datas ---------- */
/* data local (não UTC), YYYY-MM-DD */
const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const day0 = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d, n) => { const x = day0(d); x.setDate(x.getDate() + n); return x; };
const dayList = (a, b) => { const out = []; for (let d = day0(a), e = day0(b); d <= e; d = addDays(d, 1)) out.push(d); return out; };
const DOW = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const MES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const hhmm = (d) => d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
const dm = (d) => d.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
const tmin = (t) => { const [h, m] = String(t).split(" ")[1]?.split(":") || []; return h == null ? NaN : +h * 60 + +m; };   // "YYYY-MM-DD HH:MM:SS" -> min do dia

/* nascer/pôr do sol (NOAA, precisão de ~1 min), horário local */
function sunTimes(date, lat, lon) {
  const r = Math.PI / 180;
  const n = Math.round((day0(date) - new Date(date.getFullYear(), 0, 0)) / 864e5);
  const g = (2 * Math.PI / 365) * (n - 1);
  const eqt = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const dec = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  const ha = Math.acos(Math.min(1, Math.max(-1, Math.cos(90.833 * r) / (Math.cos(lat * r) * Math.cos(dec)) - Math.tan(lat * r) * Math.tan(dec)))) / r;
  const at = (min) => new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, Math.round(min)));
  return { rise: at(720 - 4 * (lon + ha) - eqt), set: at(720 - 4 * (lon - ha) - eqt) };
}

/* ---------- coleta ---------- */
async function fetchDevices() {
  const r = await api("app/home/v3/appUserAllDevices", { params: { userId: S.uid } });
  return (r.data || []).map((d) => ({
    sn: d.snCode, name: d.deviceName || d.snCode, plant: d.plantName || "", model: d.modelType || "",
    online: d.state === true, id: d.id, raw: d,
  }));
}
/* amostras do dia por device: array achatado de pontos por canal.
   Cada ponto: {createTime, channelNumber, channelPower, channelPowerGeneration(Wh acum), ...} */
async function fetchToday(sn) {
  const r = await api("app/plant_statistics/devicePowerToday", { params: { snCodes: [sn] } });
  return r.code === 200 && Array.isArray(r.data) ? r.data : [];
}
/* leitura ao vivo por canal (tela do inversor): tem tensão, rede, temperatura, pico etc. */
async function fetchChannels(sn) {
  const rs = await Promise.all([1, 2, 3, 4].map((ch) =>
    api("app/plant_statistics/currentDeviceDetail", { params: { snCode: sn, channelNumber: ch } })));
  return rs.map((r, i) => r.code === 200 && r.data ? { ch: i + 1, ...r.data } : null).filter(Boolean);  // canal vazio não derruba os outros
}

/* Geração diária de um device, por período (datas YYYY-MM-DD, inclusivas).
   POST app/home/v3/chartDeviceHistory {snCode, startTime, endTime} — só aceita yyyy-MM-dd.
   Resposta: {code:200, data:[{date:"MM-DD", year:2026, channelPowerGeneration:<Wh do dia,
   já somado entre canais>, snCode}]}. Dia sem dado na nuvem não vem no array.
   Hoje = delta do acumulado de devicePowerToday (conferido: bate exato). */
async function fetchDeviceHistory(sn, start, end) {
  const r = await api("app/home/v3/chartDeviceHistory", { method: "POST", params: { snCode: sn, startTime: start, endTime: end } });
  return r.code === 200 && Array.isArray(r.data) ? r.data : [];   // device sem histórico/erro: vazio, não quebra
}

/* kWh/dia da conta (soma dos inversores), em cache por trimestre (janela ≤ 92 dias, como já validado) */
const DAILY = new Map();   // "YYYY-MM-DD" -> kWh
const QUART = new Map();   // "YYYY-Qn" -> Promise
function loadQuarter(y, q, force = false) {
  const key = `${y}-Q${q}`;
  if (!force && QUART.has(key)) return QUART.get(key);
  const today = day0(new Date());
  const start = new Date(y, (q - 1) * 3, 1);
  const end = new Date(Math.min(new Date(y, q * 3, 0), today));
  const p = (async () => {
    if (start > today) return;
    const devices = STATE.devices.length ? STATE.devices : await fetchDevices();
    const per = await Promise.all(devices.map((d) => fetchDeviceHistory(d.sn, ymd(start), ymd(end))));
    const acc = new Map();
    for (const rows of per) for (const r of rows) {
      const k = `${r.year}-${r.date}`;
      acc.set(k, (acc.get(k) || 0) + Math.max(0, Number(r.channelPowerGeneration) || 0) / 1000);
    }
    for (const [k, v] of acc) DAILY.set(k, v);
  })();
  QUART.set(key, p);
  p.catch(() => QUART.delete(key));
  return p;
}
/* garante DAILY de a..b; refresh=true rebusca o trimestre atual (hoje muda) */
function ensureRange(a, b, refresh = false) {
  const now = new Date(), cq = `${now.getFullYear()}-Q${Math.floor(now.getMonth() / 3) + 1}`;
  const jobs = [];
  for (let y = a.getFullYear(), q = Math.floor(a.getMonth() / 3) + 1; y < b.getFullYear() || (y === b.getFullYear() && q <= Math.floor(b.getMonth() / 3) + 1); q === 4 ? (y++, q = 1) : q++)
    jobs.push(loadQuarter(y, q, refresh && `${y}-Q${q}` === cq));
  return Promise.all(jobs);
}
/* kWh de um dia: hoje vem do acumulado ao vivo (mais fresco); demais da nuvem */
function kwhOn(key) {
  if (key === ymd(new Date()) && STATE.updated) return Math.max(STATE.kwhToday, DAILY.get(key) || 0);
  return DAILY.get(key) || 0;
}
const sumDays = (a, b) => dayList(a, b).reduce((s, d) => s + kwhOn(ymd(d)), 0);

/* resume as amostras de um device: potência agora, energia hoje, total acum. */
function summarize(samples) {
  const byCh = new Map();
  for (const s of samples) {
    const c = s.channelNumber;
    (byCh.get(c) || byCh.set(c, []).get(c)).push(s);
  }
  let totalWh = 0, todayWh = 0;
  for (const arr of byCh.values()) {
    arr.sort((a, b) => a.createTime < b.createTime ? -1 : 1);   // garante ordem cronológica
    const gens = arr.map((x) => Number(x.channelPowerGeneration || 0)).filter((v) => v > 0);
    if (gens.length) { totalWh += gens[gens.length - 1]; todayWh += Math.max(0, gens[gens.length - 1] - gens[0]); }
  }
  const latest = samples.reduce((m, s) => s.createTime > m ? s.createTime : m, "");
  const powerNow = samples.filter((s) => s.createTime === latest)
    .reduce((a, s) => a + Number(s.channelPower || 0), 0);
  return { totalWh, todayWh, powerNow, latest };
}

/* séries do dia por métrica, a partir das amostras de todos os devices/canais.
   agg: soma (potência), máx (temperatura) ou média dos valores > 0 (tensões, frequência). */
const num = (v) => (v == null || v === "" || isNaN(+v)) ? null : +v;
const FREQ_KEY = (s) => Object.keys(s).find((k) => /freq/i.test(k));
const METRICS = [
  { id: "power", label: "Potência ativa", unit: "kW", d: 2, pick: (s) => num(s.channelPower), agg: "sum", scale: 1 / 1000 },
  { id: "temp", label: "Temperatura do inversor", unit: "°C", d: 1, pick: (s) => num(s.temperature), agg: "max" },
  { id: "pv", label: "Tensão FV", unit: "V", d: 1, pick: (s) => num(s.channelVoltage), agg: "avg" },
  { id: "grid", label: "Tensão da rede", unit: "V", d: 1, pick: (s) => num(s.cityVoltage), agg: "avg" },
  { id: "freq", label: "Frequência da rede", unit: "Hz", d: 2, pick: (s) => { const k = FREQ_KEY(s); return k ? num(s[k]) : null; }, agg: "avg" },
];
function metricSeries(samples, m) {
  const map = new Map();
  for (const s of samples) {
    const v = m.pick(s); if (v == null) continue;
    const a = map.get(s.createTime) || map.set(s.createTime, { sum: 0, n: 0, max: -Infinity }).get(s.createTime);
    if (m.agg !== "avg" || v > 0) { a.sum += v; a.n++; }
    a.max = Math.max(a.max, v);
  }
  return [...map].sort((a, b) => a[0] < b[0] ? -1 : 1)
    .map(([t, a]) => ({ m: tmin(t), v: (m.agg === "sum" ? a.sum : m.agg === "max" ? a.max : a.n ? a.sum / a.n : 0) * (m.scale || 1) }))
    .filter((p) => !isNaN(p.m) && (m.agg !== "avg" || p.v > 0));
}

const fmt = (n, d = 0) => (n == null || isNaN(n) || !isFinite(n)) ? "—" : Number(n).toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });
const brl = (n) => "R$ " + fmt(n, 2);
const kw = (w) => fmt(w / 1000, w >= 10000 ? 1 : 2);
const energy = (kwh) => kwh >= 1000 ? [fmt(kwh / 1000, 1), "MWh"] : [fmt(kwh, kwh >= 100 ? 0 : 1), "kWh"];

/* ---------- dias guardados no aparelho: potência e temperatura por horário ----------
   A nuvem Ares só dá a curva do dia atual; cada abertura do app grava o dia (até 45 dias). */
const DAYS_KEY = "solarlog_days";
const loadDays = () => { try { return JSON.parse(localStorage.getItem(DAYS_KEY) || "{}"); } catch { return {}; } };
function saveDay(key, rec) {
  const all = loadDays(); all[key] = rec;
  const ks = Object.keys(all).sort(); while (ks.length > 45) delete all[ks.shift()];
  try { localStorage.setItem(DAYS_KEY, JSON.stringify(all)); } catch {}
}
const r1 = (v, d) => Math.round(v * 10 ** d) / 10 ** d;
/* resumo de calor por dia (sem limite de 45 dias): {YYYY-MM-DD: [temp. máx °C, min acima de HOT, perda estimada kWh]} */
const SUM_KEY = "solarlog_daysum";
const loadSums = () => { try { return JSON.parse(localStorage.getItem(SUM_KEY) || "{}"); } catch { return {}; } };
function saveSum(key, hs) {
  if (!hs) return;
  const all = loadSums(); all[key] = [r1(hs.max.v, 1), hs.hotMin, r1(hs.lossKwh, 3)];
  const ks = Object.keys(all).sort(); while (ks.length > 1500) delete all[ks.shift()];
  try { localStorage.setItem(SUM_KEY, JSON.stringify(all)); } catch {}
}
const toPts = (arr) => (arr || []).map(([m, v]) => ({ m, v }));
const hm = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(Math.round(m % 60)).padStart(2, "0")}`;
const dur = (m) => m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ""}` : `${m} min`;

/* Perda por calor (estimativa): potência dos painéis cai CFG.tcoef %/°C acima de 25 °C.
   Usa a temperatura do microinversor (preso sob os painéis) como aproximação da dos painéis. */
const HOT = 60;
const tempAt = (tp, m) => { let b = null; for (const p of tp) if (Math.abs(p.m - m) <= 15 && (!b || Math.abs(p.m - m) < Math.abs(b.m - m))) b = p; return b ? b.v : null; };
const heatFactor = (T) => T != null && T > 25 ? Math.min(0.5, CFG.tcoef / 100 * (T - 25)) : 0;
function heatStats(pw, tp) {
  if (!tp.length) return null;
  let lossKwh = 0, genKwh = 0, hotMin = 0;
  for (let i = 1; i < pw.length; i++) {
    const dt = (pw[i].m - pw[i - 1].m) / 60; if (dt <= 0 || dt > 0.5) continue;
    const f = heatFactor(tempAt(tp, pw[i].m));
    genKwh += pw[i].v * dt; lossKwh += pw[i].v * f / (1 - f) * dt;
  }
  for (let i = 1; i < tp.length; i++) { const dt = tp[i].m - tp[i - 1].m; if (dt <= 15 && tp[i].v >= HOT) hotMin += dt; }
  const max = tp.reduce((a, b) => b.v > a.v ? b : a);
  return { max, hotMin, lossKwh, pct: genKwh + lossKwh > 0 ? lossKwh / (genKwh + lossKwh) : 0 };
}

/* ---------- estado em memória ---------- */
const EMPTY = { devices: [], samples: [], series: [], temps: [], powerNow: 0, kwhToday: 0, totalKwh: 0, latest: "", updated: null };
let STATE = EMPTY;
const CHAN = new Map();   // sn -> {at, chans}

async function loadDashboard() {
  const devices = await fetchDevices();
  const t = new Date();
  const from = new Date(Math.min(new Date(t.getFullYear(), 0, 1), addDays(t, -31)));
  const histP = (async () => { STATE.devices.length || (STATE = { ...STATE, devices }); await ensureRange(from, t, true); })()
    .catch((ex) => { if (ex instanceof AuthError) throw ex; });   // histórico falhou: painel ao vivo ainda aparece
  const today = await Promise.all(devices.map((d) => fetchToday(d.sn)));
  let samples = [], totalWh = 0, todayWh = 0, latest = "";
  for (const [i, d] of devices.entries()) {
    d.samples = today[i];
    const sm = summarize(d.samples);
    d.powerNow = sm.powerNow;
    totalWh += sm.totalWh; todayWh += sm.todayWh;
    if (sm.latest > latest) latest = sm.latest;
    samples = samples.concat(d.samples);
  }
  await histP;
  const powerNow = devices.reduce((s, d) => s + (d.powerNow || 0), 0);
  const key = ymd(t), series = metricSeries(samples, METRICS[0]);
  let temps = metricSeries(samples, METRICS[1]);
  if (!temps.length && devices.length) {   // amostras sem temperatura: grava a leitura ao vivo a cada atualização
    const m = t.getHours() * 60 + t.getMinutes();
    const rs = await Promise.all(devices.map((d) => api("app/plant_statistics/currentDeviceDetail", { params: { snCode: d.sn, channelNumber: 1 } }).catch(() => null)));
    const v = Math.max(...rs.map((r) => num(r?.data?.temperature)).filter((x) => x != null));
    temps = toPts(loadDays()[key]?.t);
    if (isFinite(v) && !temps.some((p) => Math.abs(p.m - m) < 4)) temps.push({ m, v });
  }
  saveDay(key, { p: series.map((p) => [p.m, r1(p.v, 3)]), t: temps.map((p) => [p.m, r1(p.v, 1)]), kwh: r1(todayWh / 1000, 2) });
  saveSum(key, heatStats(series, temps));
  STATE = { devices, samples, series, temps, powerNow, kwhToday: todayWh / 1000, totalKwh: totalWh / 1000, latest, updated: new Date() };
  recordAlerts(devices);
  return STATE;
}

/* ================= COMPONENTES ================= */
let VIEW = 0;   // sobe a cada navegação; resposta que chega de uma tela antiga é descartada
let CUR = "home", LAST_TAB = "home";

function navbar(active) {
  const tabs = [["home", I.bolt, "Agora"], ["inverter", I.chip, "Inversor"], ["history", I.hist, "Histórico"], ["alerts", I.bell, "Alertas"]];
  const badge = todayAlerts().length;
  return el(`<nav class="nav">${tabs.map(([id, ic, lb]) =>
    `<a href="#${id}" class="${active === id ? "on" : ""}" ${active === id ? 'aria-current="page"' : ""}><span class="pill">${ic}${id === "alerts" && badge ? '<i class="badge"></i>' : ""}</span>${lb}</a>`).join("")}</nav>`);
}

function cardHead(icon, title, meta = "") {
  return `<div class="ch"><span class="ic">${icon}</span><span class="kc">${title}</span>${meta ? `<span class="meta">${meta}</span>` : ""}</div>`;
}

/* gráfico de linha do dia: pts [{m: minuto do dia, v}] */
function lineChart(pts, { label = "Gráfico", d = 1 } = {}) {
  const W = 340, H = 150, pl = 4, pr = 4, pt = 10, pb = 20;
  const lo = Math.min(360, ...pts.map((p) => p.m)), hi = Math.max(1080, ...pts.map((p) => p.m));
  const x = (m) => pl + (m - lo) / (hi - lo) * (W - pl - pr);
  const ticks = []; for (let m = Math.ceil(lo / 180) * 180; m <= hi; m += 180) ticks.push(m);
  const axis = ticks.map((m) => `<text class="ax" x="${x(m).toFixed(1)}" y="${H - 5}" text-anchor="middle">${String(m / 60).padStart(2, "0")}:00</text>`).join("");
  if (!pts.length) return el(`<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}: sem dados">${axis}<text class="ax" x="${W / 2}" y="${H / 2}" text-anchor="middle">Sem leituras hoje</text></svg>`);
  const vmin = Math.min(...pts.map((p) => p.v)), vmax = Math.max(...pts.map((p) => p.v));
  const base = vmin > vmax * 0.5 ? vmin * 0.96 : Math.min(0, vmin);   // tensões/frequência: eixo não começa no zero
  const top = vmax === base ? base + 1 : vmax + (vmax - base) * 0.06;
  const y = (v) => pt + (1 - (v - base) / (top - base)) * (H - pt - pb);
  const line = pts.map((p, i) => (i ? "L" : "M") + x(p.m).toFixed(1) + " " + y(p.v).toFixed(1)).join(" ");
  const area = `${line} L${x(pts[pts.length - 1].m).toFixed(1)} ${H - pb} L${x(pts[0].m).toFixed(1)} ${H - pb} Z`;
  const id = "g" + Math.random().toString(36).slice(2, 7);
  return el(`<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="${esc(label)}, máximo ${fmt(vmax, d)}">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--acc)" stop-opacity=".45"/><stop offset="1" stop-color="var(--acc)" stop-opacity=".03"/></linearGradient></defs>
    ${[0.33, 0.66].map((f) => `<line class="grid" x1="0" x2="${W}" y1="${(pt + f * (H - pt - pb)).toFixed(1)}" y2="${(pt + f * (H - pt - pb)).toFixed(1)}"/>`).join("")}
    <path d="${area}" fill="url(#${id})"/><path class="line" d="${line}"/>
    <line class="base" x1="0" x2="${W}" y1="${H - pb}" y2="${H - pb}"/>${axis}
  </svg>`);
}

/* potência (área, kW) × temperatura (linha, °C), com faixas acima de HOT e a curva estimada sem perda por calor */
function dualChart(pw, tp, label = "Potência e temperatura") {
  const W = 340, H = 170, pl = 4, pr = 28, pt = 10, pb = 20;
  const ms = [...pw, ...tp].map((p) => p.m);
  if (!ms.length) return lineChart([], { label });
  const lo = Math.min(360, ...ms), hi = Math.max(1080, ...ms);
  const x = (m) => pl + (m - lo) / (hi - lo) * (W - pl - pr);
  const ideal = pw.map((p) => ({ m: p.m, v: p.v / (1 - heatFactor(tempAt(tp, p.m))) }));
  const pmax = Math.max(0.1, ...ideal.map((p) => p.v)) * 1.08;
  const tlo = Math.min(20, ...tp.map((p) => p.v)), thi = Math.max(HOT + 10, ...tp.map((p) => p.v));
  const yp = (v) => pt + (1 - v / pmax) * (H - pt - pb), yt = (v) => pt + (1 - (v - tlo) / (thi - tlo)) * (H - pt - pb);
  const path = (pts, y) => pts.map((p, i) => (i ? "L" : "M") + x(p.m).toFixed(1) + " " + y(p.v).toFixed(1)).join(" ");
  const bands = []; let run = null;
  for (const p of tp) { if (p.v >= HOT) { if (run && p.m - run.b <= 15) run.b = p.m; else { run && bands.push(run); run = { a: p.m, b: p.m }; } } else if (run) { bands.push(run); run = null; } }
  run && bands.push(run);
  const ticks = []; for (let m = Math.ceil(lo / 180) * 180; m <= hi; m += 180) ticks.push(m);
  const id = "g" + Math.random().toString(36).slice(2, 7);
  return el(`<svg class="chart dual" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--acc)" stop-opacity=".4"/><stop offset="1" stop-color="var(--acc)" stop-opacity=".03"/></linearGradient></defs>
    ${bands.map((b) => `<rect class="hot" x="${x(b.a).toFixed(1)}" y="${pt}" width="${Math.max(3, x(b.b) - x(b.a)).toFixed(1)}" height="${H - pt - pb}"/>`).join("")}
    ${tp.length ? `<line class="thr" x1="0" x2="${W - pr}" y1="${yt(HOT).toFixed(1)}" y2="${yt(HOT).toFixed(1)}"/><text class="ax tr" x="${W - 2}" y="${(yt(HOT) + 3).toFixed(1)}" text-anchor="end">${HOT}°</text>
      <text class="ax tr" x="${W - 2}" y="${pt + 8}" text-anchor="end">${fmt(thi, 0)}°</text>` : ""}
    ${pw.length ? `<path d="${path(pw, yp)} L${x(pw[pw.length - 1].m).toFixed(1)} ${H - pb} L${x(pw[0].m).toFixed(1)} ${H - pb} Z" fill="url(#${id})"/>
      <path class="ideal" d="${path(ideal, yp)}"/><path class="line" d="${path(pw, yp)}"/>` : ""}
    ${tp.length ? `<path class="tline" d="${path(tp, yt)}"/>` : ""}
    <line class="base" x1="0" x2="${W - pr}" y1="${H - pb}" y2="${H - pb}"/>
    ${ticks.map((m) => `<text class="ax" x="${x(m).toFixed(1)}" y="${H - 5}" text-anchor="middle">${hm(m)}</text>`).join("")}
  </svg>`);
}
const LEGEND = `<div class="legend"><span><i class="lp"></i>Potência</span><span><i class="li"></i>Sem perda por calor (estim.)</span><span><i class="lt"></i>Temperatura</span></div>`;
function heatText(hs) {
  if (!hs) return "Sem leitura de temperatura neste dia.";
  return `${hs.hotMin ? `Acima de ${HOT} °C por ${dur(hs.hotMin)}` : `Não passou de ${HOT} °C`} · perda estimada por calor ≈ ${fmt(hs.lossKwh, 1)} kWh (${fmt(hs.pct * 100, 0)}%, ${brl(hs.lossKwh * CFG.tarifa)}).`;
}

/* gráfico de barras com linha de média e balão do selecionado. bs: [{lab, tip, v}] */
function barChart(bs, sel, onSel, avg) {
  const W = 340, H = 190, pt = 34, pb = 22, n = bs.length, pr = bs.some((b) => b.tmax != null) ? 24 : 0;
  const max = Math.max(0.001, ...bs.map((b) => b.v + (b.loss || 0)), avg || 0) * 1.04;
  const slot = (W - pr) / n, bw = Math.max(3, Math.min(34, slot * 0.62));
  const y = (v) => pt + (1 - v / max) * (H - pt - pb);
  const every = n > 16 ? Math.ceil(n / 8) : 1;
  const bars = bs.map((b, i) => {
    const cx = slot * i + slot / 2, h = Math.max(b.v > 0 ? 2 : 0, H - pb - y(b.v)), lh = b.loss ? H - pb - y(b.loss) : 0;
    return `<g data-i="${i}" class="b${i === sel ? " sel" : ""}"><rect class="hit" x="${(slot * i).toFixed(1)}" y="0" width="${slot.toFixed(1)}" height="${H}"/>
      <rect class="bar" x="${(cx - bw / 2).toFixed(1)}" y="${(H - pb - h).toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="${Math.min(6, bw / 2).toFixed(1)}"/>
      ${lh >= 0.5 ? `<rect class="loss" x="${(cx - bw / 2).toFixed(1)}" y="${(H - pb - h - lh).toFixed(1)}" width="${bw.toFixed(1)}" height="${lh.toFixed(1)}" rx="${Math.min(4, bw / 2).toFixed(1)}"/>` : ""}
      ${i === sel || (i % every === 0 && (sel == null || every === 1 || Math.abs(i - sel) > 1)) ? `<text class="ax" x="${cx.toFixed(1)}" y="${H - 6}" text-anchor="middle">${esc(b.lab)}</text>` : ""}</g>`;
  }).join("");
  // temperatura máxima por balde (escala à direita)
  let temp = "";
  const tps = bs.map((b, i) => b.tmax != null ? { i, v: b.tmax } : null).filter(Boolean);
  if (tps.length) {
    const tlo = Math.min(20, ...tps.map((p) => p.v)), thi = Math.max(HOT + 10, ...tps.map((p) => p.v));
    const yt = (v) => pt + (1 - (v - tlo) / (thi - tlo)) * (H - pt - pb), xc = (i) => slot * i + slot / 2;
    temp = `<line class="thr" x1="0" x2="${W - pr}" y1="${yt(HOT).toFixed(1)}" y2="${yt(HOT).toFixed(1)}"/>
      <text class="ax tr" x="${W - 2}" y="${(yt(HOT) + 3).toFixed(1)}" text-anchor="end">${HOT}°</text><text class="ax tr" x="${W - 2}" y="${pt + 8}" text-anchor="end">${fmt(thi, 0)}°</text>
      ${tps.length > 1 ? `<polyline class="tline" points="${tps.map((p) => `${xc(p.i).toFixed(1)},${yt(p.v).toFixed(1)}`).join(" ")}"/>` : ""}
      ${tps.map((p) => `<circle class="tdot${p.v >= HOT ? " hot" : ""}" cx="${xc(p.i).toFixed(1)}" cy="${yt(p.v).toFixed(1)}" r="2.6"/>`).join("")}`;
  }
  let tip = "";
  if (sel != null && bs[sel]) {
    const b = bs[sel], cx = slot * sel + slot / 2;
    const txt = `${b.tip}: ${fmt(b.v, 1)} kWh${b.loss >= 0.05 ? ` · calor −${fmt(b.loss, 1)}` : ""}${b.tmax != null ? ` · ${fmt(b.tmax, 0)}°` : ""}`, w = txt.length * 6.1 + 16;
    const bx = Math.min(W - w - 1, Math.max(1, cx - w / 2));
    tip = `<g class="tip"><rect x="${bx.toFixed(1)}" y="2" width="${w.toFixed(1)}" height="22" rx="11"/><text x="${(bx + w / 2).toFixed(1)}" y="17" text-anchor="middle">${esc(txt)}</text></g>`;
  }
  const node = el(`<svg class="chart bars" viewBox="0 0 ${W} ${H}" role="img" aria-label="Energia por período">
    <defs><pattern id="hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="4" height="4" fill="var(--acc)" opacity=".18"/><line x1="0" y1="0" x2="0" y2="4" stroke="var(--acc)" stroke-width="1.6"/></pattern></defs>
    ${avg ? `<line class="avg" x1="0" x2="${W - pr}" y1="${y(avg).toFixed(1)}" y2="${y(avg).toFixed(1)}"/>` : ""}${bars}${temp}${tip}</svg>`);
  node.addEventListener("click", (e) => { const g = e.target.closest("g[data-i]"); if (g) onSel(+g.dataset.i); });
  return node;
}

/* medidor semicircular (temperatura) */
function gauge(v, lo, hi, color) {
  const f = Math.max(0, Math.min(1, (v - lo) / (hi - lo)));
  const R = 46, cx = 60, cy = 58, a = Math.PI * (1 - f);
  const px = cx + R * Math.cos(a), py = cy - R * Math.sin(a);
  return `<svg class="gauge" viewBox="0 0 120 70" aria-hidden="true">
    <path class="trk" d="M${cx - R} ${cy} A${R} ${R} 0 0 1 ${cx + R} ${cy}"/>
    ${f > 0 ? `<path class="val" style="stroke:${color}" d="M${cx - R} ${cy} A${R} ${R} 0 0 1 ${px.toFixed(1)} ${py.toFixed(1)}"/>` : ""}
    <circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="5" fill="var(--card)" stroke="${color}" stroke-width="3"/>
  </svg>`;
}

/* faixa adequada de tensão (ANEEL/PRODIST) para rede 127 V ou 220 V */
const gridBand = (v) => v > 170 ? { nom: 220, lo: 202, hi: 231 } : { nom: 127, lo: 117, hi: 133 };

/* ================= TELAS ================= */
function screenLogin() {
  STATE = EMPTY; DAILY.clear(); QUART.clear(); CHAN.clear();   // não mostra dados de uma sessão anterior
  const node = el(`<div class="login">
    <div class="sky">${heroArt(new Date(), true)}</div>
    <div class="lcard">
      <h1>SolarLog</h1><p class="lead">Monitor da sua usina Ares</p>
      <form id="lf" novalidate>
        <label class="fld"><span>Usuário</span><input id="u" type="email" autocomplete="username" placeholder="seu e-mail" inputmode="email"></label>
        <label class="fld"><span>Senha</span><input id="p" type="password" autocomplete="current-password" placeholder="••••••••"></label>
        <button class="btn" type="submit">Entrar</button>
        <div class="err" id="le" role="alert"></div>
      </form>
      <p class="note">Mesmas credenciais do app Ares Cloud.<br>Ficam só neste aparelho, nesta sessão.</p>
    </div>
  </div>`);
  app.replaceChildren(node);
  $("#lf").addEventListener("submit", async (e) => {
    e.preventDefault();
    const b = $(".btn"), er = $("#le");
    const u = $("#u").value.trim(), p = $("#p").value;
    if (!u || !p) { er.textContent = "Preencha usuário e senha."; return; }
    b.disabled = true; b.textContent = "Entrando…"; er.textContent = "";
    try { await login(u, p); route("home"); }
    catch (ex) { er.textContent = ex.message === "Login falhou" ? "Usuário ou senha inválidos." : "Erro de conexão. Tente de novo."; b.disabled = false; b.textContent = "Entrar"; }
  });
}

const isNight = (now) => { const { rise, set } = sunTimes(now, CFG.lat, CFG.lon); return now < rise || now > set; };
/* ilustração: céu conforme a hora, sol no arco nascer→pôr, casa com painéis */
function heroArt(now, plain = false, gen = false) {
  const { rise, set } = sunTimes(now, CFG.lat, CFG.lon);
  const f = (now - rise) / (set - rise);
  const day = f > 0 && f < 1, dusk = day && (f < 0.1 || f > 0.9);
  const fc = Math.max(0, Math.min(1, f)), sx = 200 + fc * 150, sy = 150 - Math.sin(fc * Math.PI) * 115;   // fora da área do título
  const sky = !day ? ["#1b2344", "#3d3c63"] : dusk ? ["#f5b98d", "#fde3c4"] : ["#a8d4f2", "#f8ead6"];
  const stars = day ? "" : [[40, 30], [90, 60], [150, 22], [210, 48], [262, 18], [300, 70], [360, 40], [120, 95], [380, 100]]
    .map(([x, y], i) => `<circle class="star" style="animation-delay:${(i * 0.7) % 3}s" cx="${x}" cy="${y}" r="${i % 3 ? 1 : 1.6}" fill="#fff" opacity=".8"/>`).join("");
  const body = day
    ? `<g transform="translate(${sx.toFixed(0)} ${sy.toFixed(0)})"><circle class="glow" r="34" fill="#fff6d6" opacity=".55"/>
      <g class="rays" stroke="#ffc93d" stroke-width="3" stroke-linecap="round">${Array.from({ length: 10 }, (_, i) => { const a = i * Math.PI / 5;
        return `<line x1="${(Math.cos(a) * 25).toFixed(1)}" y1="${(Math.sin(a) * 25).toFixed(1)}" x2="${(Math.cos(a) * 31).toFixed(1)}" y2="${(Math.sin(a) * 31).toFixed(1)}"/>`; }).join("")}</g>
      <circle r="20" fill="#ffd34d"/></g>`
    : `<circle cx="330" cy="48" r="16" fill="#f4f1de"/><circle cx="337" cy="43" r="14" fill="${sky[0]}"/>`;
  const clouds = day ? `<g fill="#fff" opacity=".9"><ellipse cx="250" cy="34" rx="22" ry="7"/><ellipse cx="262" cy="29" rx="12" ry="8"/><ellipse cx="60" cy="132" rx="24" ry="8"/><ellipse cx="74" cy="126" rx="14" ry="9"/><ellipse cx="330" cy="104" rx="22" ry="7"/><ellipse cx="342" cy="99" rx="12" ry="8"/></g>` : "";
  const lit = day ? 1 : 0.55;
  const panel = day ? "#2f5f9e" : "#22385e";
  const win = day ? "#cfe6f5" : "#ffd27a";
  return `<svg class="art" viewBox="0 0 400 240" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient></defs>
    <rect width="400" height="240" fill="url(#sky)"/>${stars}${body}${clouds}
    ${plain ? "" : `<g opacity="${lit}">
    <path d="M0 196 C70 170 130 184 200 180 S330 168 400 186 V240 H0Z" fill="#a9d18e"/>
    <path d="M0 210 C90 196 180 204 260 200 S360 198 400 204 V240 H0Z" fill="#86bd6c"/>
    <g fill="#5f9e4d"><rect x="58" y="176" width="4" height="22" fill="#7a5a3a"/><circle cx="60" cy="168" r="16"/><rect x="96" y="182" width="3" height="18" fill="#7a5a3a"/><circle cx="97" cy="176" r="11"/>
      <rect x="318" y="178" width="4" height="22" fill="#7a5a3a"/><circle cx="320" cy="170" r="14"/></g>
    <path d="M352 112v92M340 122h24" stroke="#6b5440" stroke-width="3"/><path d="M342 123 C300 140 280 145 262 150M362 123 C380 140 392 142 400 140" stroke="#5b4a3d" stroke-width="1" fill="none"/>
    ${gen ? `<path class="flow" d="M342 123 C300 140 280 145 262 150" stroke="#ffd34d" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="2 10" fill="none"/>` : ""}
    <rect x="146" y="148" width="118" height="58" fill="#f7efe4"/><rect x="146" y="148" width="118" height="58" fill="none" stroke="#e2d4c2"/>
    <path d="M134 151 L162 112 H248 L276 151Z" fill="#c4553a"/>
    <clipPath id="pc"><path d="M160 145 L178 119 H240 L254 145Z"/></clipPath><path d="M160 145 L178 119 H240 L254 145Z" fill="${panel}"/>
    ${gen && day ? `<g clip-path="url(#pc)"><path class="shine" d="M140 150 L160 112 H178 L158 150Z" fill="#fff" opacity=".45"/></g>` : ""}
    <path d="M181 119 L169 145M202 119 L195 145M221 119 L224 145M170 132 H247" stroke="#9cc0ea" stroke-width="1" opacity=".7"/>
    <rect x="198" y="174" width="18" height="32" rx="2" fill="#b0704a"/>
    <rect x="160" y="164" width="24" height="18" rx="2" fill="${win}"/><rect x="228" y="164" width="24" height="18" rx="2" fill="${win}"/>
    </g>`}
  </svg>`;
}

function skeletonHome() {
  app.replaceChildren(el(`<div class="scr">
    <header class="hero${isNight(new Date()) ? " night" : ""}">${heroArt(new Date())}<div class="htop"><div><h1>${esc(CFG.name || "Minha usina")}</h1><p class="st">Carregando…</p></div></div></header>
    <div class="cards"><div class="card now"><div class="sk" style="height:64px"></div></div>
    <div class="row2"><div class="card"><div class="sk" style="height:56px"></div></div><div class="card"><div class="sk" style="height:56px"></div></div></div>
    <div class="card"><div class="sk" style="height:150px"></div></div></div></div>`), navbar("home"));
}

/* Mostra na hora o último painel carregado (se houver) e atualiza por trás. */
async function screenHome() {
  const v = VIEW;
  if (STATE.updated) renderHome(STATE, true); else skeletonHome();
  let st;
  try { st = await loadDashboard(); }
  catch (ex) {
    if (ex instanceof AuthError) return route("login");
    if (v !== VIEW) return;
    if (!STATE.updated) return errorScreen("home", screenHome);
    renderHome(STATE);
    return toast(`Sem conexão. Dados de ${hhmm(STATE.updated)}`, true);
  }
  if (v !== VIEW) return;
  renderHome(st);
}

function renderHome(st, loading = false) {
  const now = new Date(), today = day0(now);
  const { rise, set } = sunTimes(now, CFG.lat, CFG.lon);
  const online = st.devices.some((d) => d.online);
  const leitura = st.latest ? st.latest.split(" ")[1]?.slice(0, 5) : st.updated ? hhmm(st.updated) : "";
  const pico = Math.max(0, ...st.series.map((p) => p.v));
  const hs = heatStats(st.series, st.temps || []);
  const saveToday = st.kwhToday * CFG.tarifa, co2Today = st.kwhToday * CFG.co2;

  // mês / ano / dia típico (média dos dias anteriores deste mês; no início do mês, últimos 30 dias)
  const mStart = new Date(today.getFullYear(), today.getMonth(), 1), yStart = new Date(today.getFullYear(), 0, 1);
  const monthK = sumDays(mStart, today), yearK = sumDays(yStart, today);
  let prev = dayList(mStart, addDays(today, -1)).map((d) => DAILY.get(ymd(d)) || 0).filter((k) => k > 0);
  if (prev.length < 3) prev = dayList(addDays(today, -30), addDays(today, -1)).map((d) => DAILY.get(ymd(d)) || 0).filter((k) => k > 0);
  const typical = prev.length ? prev.reduce((a, b) => a + b, 0) / prev.length : 0;
  const pct = typical ? st.kwhToday / typical : null;
  const blocks = pct == null ? 0 : Math.round(Math.min(1, pct) * 12);

  // retorno do investimento: economia acumulada pela tarifa atual, ritmo dos últimos 30 dias
  const saved = st.totalKwh * CFG.tarifa;
  const last30 = dayList(addDays(today, -30), addDays(today, -1)).map((d) => DAILY.get(ymd(d)) || 0);
  const rate = last30.reduce((a, b) => a + b, 0) / 30 * CFG.tarifa;
  let roi = `<p class="hint">Informe o valor investido em <a href="#settings">Ajustes</a> para ver quanto do sistema já se pagou.</p>`;
  if (CFG.invest > 0) {
    const p = saved / CFG.invest, left = Math.max(0, CFG.invest - saved);
    const eta = left > 0 && rate > 0 ? addDays(today, Math.ceil(left / rate)) : null;
    roi = `<div class="big2"><b>${fmt(Math.min(p, 9.99) * 100, 0)}%</b><span>${brl(saved)} de ${brl(CFG.invest)}</span></div>
      <div class="prog"><i style="width:${Math.min(100, p * 100).toFixed(1)}%"></i></div>
      <p class="sub">${left > 0 ? `Faltam ${brl(left)}${eta ? ` · previsão: ${MES[eta.getMonth()]} de ${eta.getFullYear()}` : ""}` : "Sistema já se pagou. Daqui pra frente é lucro."}</p>`;
  }
  const [tv, tu] = energy(st.totalKwh);
  const node = el(`<div class="scr">
    <header class="hero${isNight(now) ? " night" : ""}">${heroArt(now, false, st.powerNow > 0)}
      <div class="htop"><div>
        <h1>${esc(CFG.name || "Minha usina")}</h1>
        <p class="st"><i class="led ${online ? "on" : "off"}"></i>${online ? "Online" : "Offline"}${leitura ? ` · leitura das ${leitura}` : ""}</p>
        <p class="sun">Nascer ${hhmm(rise)} · Pôr ${hhmm(set)}</p></div>
        <a class="gear${loading ? " spin" : ""}" href="#settings" aria-label="Ajustes">${I.gear}</a></div>
    </header>
    <div class="cards">
      <section class="card now">
        <span class="bolt">${I.bolt}</span>
        <div class="nw"><span class="k">Gerando agora</span><b>${kw(st.powerNow)}<small>kW</small></b>
          ${CFG.kwp > 0 ? `<span class="s">${fmt(st.powerNow / 10 / CFG.kwp, 0)}% de ${fmt(CFG.kwp, 1)} kWp</span>` : ""}</div>
        <div class="td"><span class="k">Hoje</span><b>${fmt(st.kwhToday, 1)} kWh</b></div>
      </section>
      <div class="row2">
        <section class="card mini">${cardHead(I.coin, "Economia hoje")}<b>${brl(saveToday)}</b><span class="s">${brl(CFG.tarifa)}/kWh</span></section>
        <section class="card mini">${cardHead(I.leaf, "CO₂ evitado hoje")}<b>${fmt(co2Today, co2Today < 10 ? 1 : 0)} kg</b><span class="s">${fmt(CFG.co2, 4)} kg por kWh</span></section>
      </div>
      <section class="card">${cardHead(I.curve, "Curva do dia", `pico ${fmt(pico, 2)} kW`)}<div class="cv"></div></section>
      <section class="card">${cardHead(I.thermo, "Temperatura × geração", hs ? `máx ${fmt(hs.max.v, 0)} °C às ${hm(hs.max.m)}` : "")}<div class="cv2"></div>${LEGEND}
        <p class="sub">${heatText(hs)}</p><a class="more" href="#history" id="heat-more">Ver dias anteriores ${I.chevR}</a></section>
      <section class="card">${cardHead(I.bars, "Comparado a um dia típico", pct == null ? "" : `<b class="pc">${fmt(pct * 100, 0)}%</b>`)}
        <div class="blocks">${Array.from({ length: 12 }, (_, i) => `<i class="${i < blocks ? "on" : ""}"></i>`).join("")}</div>
        <p class="sub">${typical ? `${fmt(st.kwhToday, 1)} kWh de ${fmt(typical, 1)} kWh — média dos dias ${prev.length >= 3 && now.getDate() > 3 ? "deste mês" : "recentes"}` : "Sem histórico suficiente para comparar."}</p></section>
      <section class="card">${cardHead(I.target, "Retorno do investimento")}${roi}</section>
      <div class="row2">
        <section class="card mini">${cardHead(I.cal, "Este mês")}<b>${fmt(monthK, 0)} kWh</b><span class="s">${brl(monthK * CFG.tarifa)}</span></section>
        <section class="card mini">${cardHead(I.cal, "Este ano")}<b>${fmt(yearK, 0)} kWh</b><span class="s">${brl(yearK * CFG.tarifa)}</span></section>
      </div>
      <section class="card">${cardHead(I.globe, "Impacto desde a instalação")}
        <div class="tri"><div><b>${tv} ${tu}</b><span>gerados</span></div>
          <div><b>${fmt(st.totalKwh * CFG.co2 / 1000, 2)} t</b><span>de CO₂ evitados</span></div>
          <div><b>${fmt(st.totalKwh * CFG.co2 / 22, 0)}</b><span>árvores por um ano</span></div></div></section>
      ${st.devices.length ? "" : `<div class="empty">${I.off}<p>Nenhum inversor na sua conta.</p></div>`}
    </div></div>`);
  node.querySelector(".cv").appendChild(lineChart(st.series, { label: "Curva de geração de hoje", d: 2 }));
  node.querySelector(".cv2").appendChild(dualChart(st.series, st.temps || []));
  node.querySelector("#heat-more").addEventListener("click", () => { H.tab = "day"; H.day = null; H.metric = "combo"; });
  app.replaceChildren(node, navbar("home"));
}

/* ---------- inversor ---------- */
let INV_SN = null;
async function screenInverter(force = false) {
  const v = VIEW;
  if (!STATE.devices.length) {
    app.replaceChildren(el(`<div class="scr pad"><h2 class="title">Inversor</h2><div class="card"><div class="sk" style="height:180px"></div></div></div>`), navbar("inverter"));
    try { await loadDashboard(); } catch (ex) { if (ex instanceof AuthError) return route("login"); if (v === VIEW) errorScreen("inverter", () => route("inverter")); return; }
    if (v !== VIEW) return;
  }
  const devs = STATE.devices;
  if (!devs.length) return app.replaceChildren(el(`<div class="scr pad"><h2 class="title">Inversor</h2><div class="empty">${I.off}<p>Nenhum inversor na sua conta.</p></div></div>`), navbar("inverter"));
  if (!devs.some((d) => d.sn === INV_SN)) INV_SN = devs[0].sn;
  const d = devs.find((x) => x.sn === INV_SN);
  const c = CHAN.get(d.sn);
  if (c && !force && Date.now() - c.at < 60e3) return renderInverter(d, c);
  if (c) renderInverter(d, c, true);
  else app.replaceChildren(el(`<div class="scr pad"><h2 class="title">Inversor</h2><div class="card"><div class="sk" style="height:120px"></div></div><div class="card"><div class="sk" style="height:180px"></div></div></div>`), navbar("inverter"));
  try { CHAN.set(d.sn, { at: Date.now(), chans: await fetchChannels(d.sn) }); }
  catch (ex) { if (ex instanceof AuthError) return route("login"); if (v !== VIEW) return; if (c) { renderInverter(d, c); return toast("Sem conexão. Mostrando a última leitura.", true); } return errorScreen("inverter", () => route("inverter")); }
  if (v !== VIEW) return;
  renderInverter(d, CHAN.get(d.sn));
}

function renderInverter(d, c, loading = false) {
  const chans = c.chans;
  const act = chans.filter((x) => num(x.channelVoltage) > 0 || num(x.channelPower) > 0);
  const dc = chans.reduce((s, x) => s + (num(x.channelPower) || 0), 0);
  const cps = chans.map((x) => num(x.cityPower)).filter((x) => x != null && x > 0);
  // cityPower: se igual em todos os canais é do inversor; senão, soma por canal
  const ac0 = !cps.length ? null : cps.every((x) => x === cps[0]) ? cps[0] : cps.reduce((a, b) => a + b, 0);
  const ac = ac0 != null && dc > 0 && ac0 >= dc * 0.5 && ac0 <= dc * 1.05 ? ac0 : null;   // AW-MIP2.5 manda cityPower que não é a saída AC: só usa se plausível
  const eff = ac != null ? ac / dc : null;
  const pk = metricSeries(d.samples || [], METRICS[0]).reduce((m, p) => !m || p.v > m.v ? p : m, null);   // pico de hoje deste inversor (kW)
  const temp = Math.max(...chans.map((x) => num(x.temperature)).filter((x) => x != null), -Infinity);
  const grid = Math.max(...chans.map((x) => num(x.cityVoltage)).filter((x) => x != null), -Infinity);
  const fk = chans.map(FREQ_KEY).find(Boolean), freq = fk ? num(chans.find((x) => x[fk] != null)?.[fk]) : null;
  const peak = Math.max(1, ...chans.map((x) => Math.max(num(x.peakPower) || 0, num(x.channelPower) || 0)));
  const mean = act.length ? act.reduce((s, x) => s + (num(x.channelPower) || 0), 0) / act.length : 0;
  const weak = act.filter((x) => mean > 20 && (num(x.channelPower) || 0) < mean * 0.8);
  const empty = chans.filter((x) => !act.includes(x)).map((x) => x.ch);
  const tLab = temp >= 75 ? ["Crítica", "var(--bad)"] : temp >= 60 ? ["Alta", "var(--warn)"] : ["Normal", "var(--acc)"];
  const band = grid > 0 ? gridBand(grid) : null;
  const gLo = band ? band.nom * 0.8 : 0, gHi = band ? band.nom * 1.15 : 1, gp = (v) => Math.max(0, Math.min(100, (v - gLo) / (gHi - gLo) * 100));
  const gOk = band && grid >= band.lo && grid <= band.hi;
  const totalKwh = chans.reduce((s, x) => s + (num(x.total) || 0), 0) / 1000;
  const rows = [
    ["Número de série", d.sn], ["Modelo", d.model], ["Usina", d.plant],
    ["Comunicação", d.online ? "Online" : "Offline"], ["Potência agora", `${fmt(dc, 0)} W`],
    ["Gerado (acumulado)", totalKwh ? `${fmt(totalKwh, 1)} kWh` : ""], ["Canais com painel", `${act.length} de ${chans.length}`],
    ["Envio de dados", "a cada 5 min"],
  ].filter((r) => r[1]);

  const node = el(`<div class="scr pad">
    <div class="thead"><h2 class="title">Inversor</h2>${loading ? '<span class="dotload"></span>' : ""}</div>
    <p class="lead2">Leitura das ${hhmm(new Date(c.at))} · atualiza a cada 5 min</p>
    ${STATE.devices.length > 1 ? `<div class="chips" role="tablist">${STATE.devices.map((x) =>
      `<button role="tab" data-sn="${esc(x.sn)}" aria-selected="${x.sn === d.sn}"><i class="led ${x.online ? "on" : "off"}"></i>${esc(x.name)}</button>`).join("")}</div>` : ""}
    ${!chans.length ? `<div class="empty">${I.off}<p>Sem leitura dos canais agora.${d.online ? "" : "<br>Inversor offline."}</p></div>` : `
    ${ac == null ? "" : `<section class="card">${cardHead(I.conv, "Conversão")}
      <div class="conv"><div><span class="k">Painéis (DC)</span><b>${kw(dc)} kW</b></div>
        <div class="flow">${eff != null && eff > 0.5 && eff <= 1.02 ? `<span>${fmt(Math.min(eff, 1) * 100, 0)}%</span>` : ""}</div>
        <div class="r"><span class="k">Saída (AC)</span><b>${ac != null ? kw(ac) + " kW" : "—"}</b></div></div>
      <p class="sub">Eficiência do inversor: quanto da energia dos painéis vira energia utilizável.</p></section>`}
    <section class="card">${cardHead(I.panel, "Painéis (canais)", `total ${fmt(dc, 0)} W`)}
      ${chans.map((x) => { const p = num(x.channelPower) || 0, on = act.includes(x); return `<div class="mppt${on ? "" : " dim"}">
        <div class="l"><b>Painel ${x.ch}</b><span class="w">${on ? `${fmt(p, 0)} W` : "sem painel"}</span></div>
        <div class="prog"><i style="width:${(p / peak * 100).toFixed(1)}%"></i></div>
        <span class="s">${fmt(num(x.channelVoltage), 1)} V · ${fmt(num(x.channelElectric), 2)} A</span></div>`; }).join("")}
      <p class="sub">${weak.length ? `Painel ${weak.map((x) => x.ch).join(", ")} abaixo da média dos outros (sombra ou sujeira?).` : act.length > 1 && mean > 20 ? "Painéis equilibrados." : ""}${empty.length ? ` Canais sem painel: ${empty.join(", ")}.` : ""}</p></section>
    <div class="row2">
      <section class="card mini">${cardHead(I.thermo, "Temperatura")}${isFinite(temp) ? `${gauge(temp, 0, 100, tLab[1])}<div class="gv"><b>${fmt(temp, 0)}°</b><span style="color:${tLab[1]}">${tLab[0]}</span></div>` : "<b>—</b>"}</section>
      ${freq ? `<section class="card mini">${cardHead(I.wave, "Frequência")}<b>${fmt(freq, 2)} Hz</b><span class="s">${Math.abs(freq - 60) <= 0.5 ? "Dentro do padrão (60 Hz)" : "Fora do padrão (60 Hz)"}</span></section>`
        : `<section class="card mini">${cardHead(I.trophy, "Pico de hoje")}<b>${pk ? fmt(pk.v, 2) + " kW" : "—"}</b><span class="s">${pk ? `às ${String(Math.floor(pk.m / 60)).padStart(2, "0")}:${String(pk.m % 60).padStart(2, "0")}` : "Sem leituras hoje"}${pk && CFG.kwp > 0 && STATE.devices.length ? ` · ${fmt(pk.v / (CFG.kwp / STATE.devices.length) * 100, 0)}% dos painéis` : ""}</span></section>`}
    </div>
    <section class="card">${cardHead(I.plug, "Rede elétrica")}
      ${band ? `<div class="gridv"><b>${fmt(grid, 1)} V</b><span>${ac != null ? fmt(ac / 1000, 2) + " kW" : ""}</span></div>
      <div class="vbar"><i class="ok" style="left:${gp(band.lo)}%;width:${gp(band.hi) - gp(band.lo)}%"></i><i class="dot" style="left:${gp(grid)}%"></i></div>
      <p class="sub">${gOk ? "Dentro" : "Fora"} da faixa adequada da ANEEL para ${band.nom} V (${band.lo}–${band.hi} V).</p>` : `<b>—</b><p class="sub">Sem leitura da rede agora.</p>`}</section>`}
    <section class="card">${cardHead(I.chip, "Equipamento")}
      <dl class="kv">${rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl></section>
  </div>`);
  node.querySelectorAll(".chips button").forEach((b) => b.addEventListener("click", () => { INV_SN = b.dataset.sn; screenInverter(); }));
  app.replaceChildren(node, navbar("inverter"));
}

/* ---------- histórico ---------- */
const H = { tab: "week", off: 0, sel: null, metric: "combo", day: null };   // day: YYYY-MM-DD (null = hoje)
try { Object.assign(H, { tab: localStorage.getItem("hist_tab") || "week" }); } catch {}
const TABS = [["day", "Dia"], ["week", "Semana"], ["month", "Mês"], ["year", "Ano"], ["total", "Total"]];
let FIRST_YEAR = null;

/* período: início/fim, rótulo e baldes [{lab, tip, a, b}] */
function period(tab, off) {
  const t = day0(new Date());
  if (tab === "week") {
    const s = addDays(t, -t.getDay() - 7 * off), e = addDays(s, 6);
    return { a: s, b: e, label: off === 0 ? "Esta semana" : off === 1 ? "Semana passada" : `${dm(s)} – ${dm(e)}`, prevName: ["à", "da", "semana anterior"],
      bs: dayList(s, e).map((d) => ({ lab: `${DOW[d.getDay()]} ${d.getDate()}`, tip: `${DOW[d.getDay()]} ${d.getDate()}`, a: d, b: d })) };
  }
  if (tab === "month") {
    const s = new Date(t.getFullYear(), t.getMonth() - off, 1), e = new Date(s.getFullYear(), s.getMonth() + 1, 0);
    return { a: s, b: e, label: `${MES[s.getMonth()]} de ${s.getFullYear()}`, prevName: ["ao", "do", "mês anterior"],
      bs: dayList(s, e).map((d) => ({ lab: String(d.getDate()), tip: `${d.getDate()} ${MES[d.getMonth()].slice(0, 3)}`, a: d, b: d })) };
  }
  if (tab === "year") {
    const y = t.getFullYear() - off;
    return { a: new Date(y, 0, 1), b: new Date(y, 11, 31), label: String(y), prevName: ["ao", "do", "ano anterior"],
      bs: MES.map((m, i) => ({ lab: String(i + 1).padStart(2, "0"), tip: `${m.slice(0, 3)}/${y}`, a: new Date(y, i, 1), b: new Date(y, i + 1, 0) })) };
  }
  const y0 = FIRST_YEAR || t.getFullYear(), ys = []; for (let y = y0; y <= t.getFullYear(); y++) ys.push(y);
  return { a: new Date(y0, 0, 1), b: t, label: "Desde a instalação", bs: ys.map((y) => ({ lab: String(y), tip: String(y), a: new Date(y, 0, 1), b: new Date(y, 11, 31) })) };
}

async function screenHistory() {
  const v = VIEW;
  renderHistory(true);
  try {
    if (H.tab === "day") { if (!STATE.updated) await loadDashboard(); }
    else if (H.tab === "total") {
      if (FIRST_YEAR == null) {   // volta ano a ano até achar um ano sem geração (máx. 10)
        const y = new Date().getFullYear(); let first = y;
        for (let k = 0; k < 10; k++) {
          await ensureRange(new Date(y - k, 0, 1), new Date(y - k, 11, 31));
          if (sumDays(new Date(y - k, 0, 1), new Date(y - k, 11, 31)) > 0) first = y - k; else if (k > 0) break;
        }
        FIRST_YEAR = first;
      }
    } else {
      const p = period(H.tab, H.off), q = period(H.tab, H.off + 1);
      await ensureRange(q.a, new Date(Math.min(p.b, new Date())));
    }
  } catch (ex) {
    if (ex instanceof AuthError) return route("login");
    if (v !== VIEW) return;
    renderHistory();
    return toast("Sem conexão com a nuvem Ares.", true);
  }
  if (v !== VIEW) return;
  renderHistory();
}

function renderHistory(loading = false) {
  const node = el(`<div class="scr pad">
    <div class="thead"><h2 class="title">Histórico</h2>${loading ? '<span class="dotload"></span>' : ""}</div>
    <div class="seg" role="tablist">${TABS.map(([id, lb]) => `<button role="tab" data-t="${id}" aria-selected="${H.tab === id}">${lb}</button>`).join("")}</div>
    <div class="body"></div></div>`);
  node.querySelectorAll(".seg button").forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.t === H.tab) return;
    H.tab = b.dataset.t; H.off = 0; H.sel = null;
    try { localStorage.setItem("hist_tab", H.tab); } catch {}
    screenHistory();
  }));
  const body = node.querySelector(".body");
  if (H.tab === "day") histDay(body, loading); else histBars(body, loading);
  app.replaceChildren(node, navbar("history"));
}

function histDay(body, loading) {
  const today = ymd(new Date()), days = loadDays();
  const keys = [...new Set([...Object.keys(days), today])].filter((k) => k <= today).sort();
  const key = H.day && keys.includes(H.day) ? H.day : today, isToday = key === today, i = keys.indexOf(key);
  const rec = days[key] || {};
  const pw = isToday ? STATE.series : toPts(rec.p), tp = isToday ? STATE.temps || [] : toPts(rec.t);
  // métricas: combinado + as que existirem (hoje vêm das amostras; dias guardados só têm potência e temperatura)
  const ms = [{ id: "combo", label: "Potência × temperatura" }, ...(isToday
    ? METRICS.filter((m) => m.id === "temp" ? tp.length : STATE.samples.some((s) => m.pick(s) != null && (m.agg !== "avg" || m.pick(s) > 0)))
    : METRICS.filter((m) => (m.id === "power" && pw.length) || (m.id === "temp" && tp.length)))];
  if (!ms.some((m) => m.id === H.metric)) H.metric = "combo";
  const m = ms.find((x) => x.id === H.metric);
  const d = new Date(key + "T12:00"), y = ymd(addDays(new Date(), -1));
  const label = isToday ? "Hoje" : key === y ? "Ontem" : `${DOW[d.getDay()]}, ${dm(d)}`;
  const nav = `<div class="pnav">${i > 0 ? `<button class="iconbtn" data-k="${keys[i - 1]}" aria-label="Dia anterior">${I.chevL}</button>` : "<span></span>"}
    <b>${label}</b>${!isToday ? `<button class="iconbtn" data-k="${keys[i + 1]}" aria-label="Próximo dia">${I.chevR}</button>` : "<span></span>"}</div>`;
  const chips = `<div class="chips sc">${ms.map((x) => `<button data-m="${x.id}" aria-selected="${x.id === m.id}">${x.label}</button>`).join("")}</div>`;
  let n;
  if (!pw.length && !tp.length) {
    n = el(`<div>${nav}${loading && isToday ? `<div class="card"><div class="sk" style="height:180px"></div></div>` : `<div class="empty">${I.hist}<p>Sem leituras neste dia.</p></div>`}</div>`);
  } else if (m.id === "combo") {
    const hs = heatStats(pw, tp);
    n = el(`<div>${nav}${chips}
      <section class="card">${cardHead(I.thermo, "Potência × temperatura", hs ? `máx ${fmt(hs.max.v, 0)} °C às ${hm(hs.max.m)}` : "")}<div class="cv"></div>${LEGEND}</section>
      <div class="row3">
        <div class="card mini"><span class="k">Temp. máx.</span><b>${hs ? fmt(hs.max.v, 0) + " °C" : "—"}</b></div>
        <div class="card mini"><span class="k">Acima de ${HOT} °C</span><b>${hs ? dur(hs.hotMin) : "—"}</b></div>
        <div class="card mini"><span class="k">Perda estim.</span><b>${hs ? fmt(hs.lossKwh, 1) + " kWh" : "—"}</b></div></div>
      <p class="hint">${heatText(hs)}<br>Estimativa: a potência dos painéis cai ${fmt(CFG.tcoef, 2)}% por °C acima de 25 °C (ajuste em <a href="#settings">Ajustes</a>). Usa a temperatura do microinversor, preso sob os painéis, como aproximação da temperatura deles. A linha tracejada mostra quanto teria gerado sem o calor.</p></div>`);
    n.querySelector(".cv").appendChild(dualChart(pw, tp));
  } else {
    const pts = isToday && m.id !== "temp" ? metricSeries(STATE.samples, m) : m.id === "temp" ? tp : pw, vs = pts.map((p) => p.v);
    const avg = vs.length ? vs.reduce((a, b) => a + b, 0) / vs.length : null;
    n = el(`<div>${nav}${chips}
      <section class="card">${cardHead(I.curve, m.label, vs.length ? `máx ${fmt(Math.max(...vs), m.d)} ${m.unit}` : "")}<div class="cv"></div></section>
      <div class="row3">${[["Mínimo", vs.length ? Math.min(...vs) : null], ["Média", avg], ["Máximo", vs.length ? Math.max(...vs) : null]]
        .map(([k, v]) => `<div class="card mini"><span class="k">${k}</span><b>${fmt(v, m.d)} ${m.unit}</b></div>`).join("")}</div></div>`);
    n.querySelector(".cv").appendChild(lineChart(pts, { label: m.label, d: m.d }));
  }
  n.appendChild(el(`<p class="hint">A nuvem Ares só fornece a curva do dia atual. O SolarLog guarda cada dia neste aparelho quando o app é aberto (até 45 dias).</p>`));
  n.querySelectorAll(".chips button").forEach((b) => b.addEventListener("click", () => { H.metric = b.dataset.m; renderHistory(); }));
  n.querySelectorAll(".pnav button").forEach((b) => b.addEventListener("click", () => { H.day = b.dataset.k === today ? null : b.dataset.k; renderHistory(); }));
  body.appendChild(n);
}

function histBars(body, loading) {
  const p = period(H.tab, H.off), t = day0(new Date());
  const sums = loadSums(), daily = H.tab === "week" || H.tab === "month";
  const bs = p.bs.map((b) => {
    const v = b.a > t ? 0 : sumDays(b.a, b.b > t ? t : b.b);
    const hs = b.a > t ? [] : dayList(b.a, b.b > t ? t : b.b).map((d) => [ymd(d), sums[ymd(d)]]).filter(([, x]) => x);
    return { ...b, v, hs, loss: hs.reduce((a, [, x]) => a + x[2], 0), tmax: daily && hs.length ? hs[0][1][0] : null };
  });
  const live = bs.filter((b) => b.a <= t);
  const total = live.reduce((s, b) => s + b.v, 0);
  const withGen = live.filter((b) => b.v > 0);
  const avg = withGen.length ? withGen.reduce((s, b) => s + b.v, 0) / withGen.length : 0;
  const best = withGen.reduce((m, b) => !m || b.v > m.v ? b : m, null);
  const curI = bs.findIndex((b) => b.a <= t && t <= b.b);
  let sel = H.sel != null && H.sel < bs.length ? H.sel : curI >= 0 ? curI : best ? bs.indexOf(best) : null;
  // comparação: período anterior, cortado no mesmo ponto do período atual
  let cmp = "";
  if (H.tab !== "total") {
    const q = period(H.tab, H.off + 1), elapsed = Math.round((Math.min(p.b, t) - p.a) / 864e5);
    const prevK = sumDays(q.a, new Date(Math.min(q.b, addDays(q.a, elapsed))));
    if (prevK > 0 && total > 0) {
      const d = (total / prevK - 1) * 100;
      cmp = `<section class="card mini wide">${cardHead(I.bars, `Em relação ${p.prevName[0]} ${p.prevName[2]}`)}<b class="${d >= 0 ? "up" : "down"}">${d >= 0 ? "▲" : "▼"} ${fmt(Math.abs(d), 0)}%</b>
        <span class="s">${fmt(prevK, 1)} kWh no mesmo trecho ${p.prevName[1]} ${p.prevName[2]}</span></section>`;
    }
  }
  // calor no período: só dias com temperatura guardada no aparelho
  const hdays = bs.flatMap((b) => b.hs);
  let heat = "";
  if (hdays.length) {
    const loss = hdays.reduce((a, [, x]) => a + x[2], 0), hot = hdays.filter(([, x]) => x[1] > 0).length;
    const gen = hdays.reduce((a, [k]) => a + kwhOn(k), 0);
    const [hk, hx] = hdays.reduce((m, d) => d[1][0] > m[1][0] ? d : m);
    const hd = new Date(hk + "T12:00");
    heat = `<section class="card">${cardHead(I.thermo, "Calor no período", `${hdays.length} dia(s) com leitura`)}
      <div class="row3 in"><div><span class="k">Perda estimada</span><b>${fmt(loss, 1)} kWh</b><span class="s">${fmt(gen + loss > 0 ? loss / (gen + loss) * 100 : 0, 0)}% · ${brl(loss * CFG.tarifa)}</span></div>
        <div><span class="k">Dias acima de ${HOT} °C</span><b>${hot}</b><span class="s">de ${hdays.length}</span></div>
        <div><span class="k">Mais quente</span><b>${fmt(hx[0], 0)} °C</b><span class="s">${DOW[hd.getDay()]}, ${dm(hd)}</span></div></div>
      <p class="sub">Temperatura e perda vêm dos dias guardados neste aparelho (desde ${dm(new Date(Object.keys(sums).sort()[0] + "T12:00"))}). Dia em que o app não foi aberto fica sem esse dado.</p></section>`;
  }
  const unitN = { week: "dia", month: "dia", year: "mês", total: "ano" }[H.tab];
  const bestN = { week: "Melhor dia", month: "Melhor dia", year: "Melhor mês", total: "Melhor ano" }[H.tab];
  const [tv, tu] = energy(total);
  const n = el(`<div>
    <div class="pnav">${H.tab === "total" ? "<span></span>" : `<button class="iconbtn" data-o="1" aria-label="Período anterior">${I.chevL}</button>`}
      <b>${esc(p.label)}</b>${H.tab === "total" || H.off === 0 ? "<span></span>" : `<button class="iconbtn" data-o="-1" aria-label="Próximo período">${I.chevR}</button>`}</div>
    <section class="card">${cardHead(I.bars, H.tab === "year" ? "Energia por mês" : H.tab === "total" ? "Energia por ano" : "Energia por dia", avg ? '<span class="lg">— média</span>' : "")}<div class="cv"></div>
      ${hdays.length ? `<div class="legend"><span><i class="lb"></i>Geração</span><span><i class="lh"></i>Perda por calor (estim.)</span>${daily ? '<span><i class="lt"></i>Temp. máx.</span>' : ""}</div>` : ""}
      <p class="sub c">Toque numa barra para ver o valor</p></section>
    ${heat}
    <div class="row2">
      <section class="card mini">${cardHead(I.coin, "Total")}<b>${tv} ${tu}</b><span class="s ok">${brl(total * CFG.tarifa)}</span></section>
      <section class="card mini">${cardHead(I.cal, `Média por ${unitN}`)}<b>${fmt(avg, avg >= 100 ? 0 : 1)} kWh</b><span class="s">${withGen.length} ${unitN === "mês" ? "mes(es)" : unitN + "(s)"} com geração</span></section>
    </div>
    ${best ? `<section class="card mini wide">${cardHead(I.trophy, `${bestN}: ${esc(best.tip)}`)}<b>${fmt(best.v, 1)} kWh</b><span class="s ok">${brl(best.v * CFG.tarifa)}</span></section>` : ""}
    ${cmp}
    ${!loading && !total ? `<div class="empty">${I.hist}<p>Sem geração registrada na nuvem Ares neste período.</p></div>` : ""}
  </div>`);
  const draw = () => n.querySelector(".cv").replaceChildren(barChart(bs, sel, (i) => { H.sel = sel = i; draw(); }, avg));
  draw();
  n.querySelectorAll(".pnav button").forEach((b) => b.addEventListener("click", () => { H.off = Math.max(0, H.off + +b.dataset.o); H.sel = null; screenHistory(); }));
  body.appendChild(n);
}

/* ---------- alertas: detectados pelo app nas leituras do dia, guardados neste aparelho ---------- */
const ALERT_T = {
  nogrid: ["Sem rede elétrica", I.noplug], lowv: ["Tensão da rede baixa", I.plug],
  highv: ["Tensão da rede alta", I.plug], hot: ["Temperatura alta", I.thermo],
};
const loadAlerts = () => { try { return JSON.parse(localStorage.getItem("solarlog_alerts") || "[]"); } catch { return []; } };
function recordAlerts(devices) {
  const found = [];
  for (const d of devices) {
    const byT = new Map();
    for (const s of d.samples || []) {
      const p = byT.get(s.createTime) || byT.set(s.createTime, { grid: null, temp: null }).get(s.createTime);
      const g = num(s.cityVoltage), tp = num(s.temperature);
      if (g != null) p.grid = Math.max(p.grid ?? -1, g);
      if (tp != null) p.temp = Math.max(p.temp ?? -99, tp);
    }
    const pts = [...byT].sort((a, b) => a[0] < b[0] ? -1 : 1);
    const gs = pts.map(([, p]) => p.grid).filter((g) => g > 50).sort((a, b) => a - b);
    if (!pts.length) continue;
    const band = gridBand(gs.length ? gs[gs.length >> 1] : 220);
    const rules = {
      nogrid: (p) => p.grid != null && p.grid < 50, lowv: (p) => p.grid >= 50 && p.grid < band.lo,
      highv: (p) => p.grid > band.hi, hot: (p) => p.temp >= 75,
    };
    for (const [type, test] of Object.entries(rules)) {
      let run = null;
      const close = () => { if (run) found.push({ id: `${d.sn}|${type}|${run.a}`, sn: d.sn, dev: d.name, type, at: run.a, mins: Math.max(5, Math.round((tmin(run.b) - tmin(run.a)) + 5)) }); run = null; };
      for (const [t, p] of pts) {
        if (test(p)) { if (run && tmin(t) - tmin(run.b) <= 15) run.b = t; else { close(); run = { a: t, b: t }; } }
        else close();
      }
      close();
    }
  }
  const all = new Map(loadAlerts().map((a) => [a.id, a]));
  for (const a of found) all.set(a.id, a);
  const cut = ymd(addDays(new Date(), -365));
  const keep = [...all.values()].filter((a) => a.at.slice(0, 10) >= cut).sort((a, b) => a.at < b.at ? 1 : -1).slice(0, 500);
  try { localStorage.setItem("solarlog_alerts", JSON.stringify(keep)); } catch {}
}
const todayAlerts = () => { const k = ymd(new Date()); return loadAlerts().filter((a) => a.at.startsWith(k)); };

async function screenAlerts() {
  const v = VIEW;
  renderAlerts(!STATE.updated);
  if (STATE.updated) return;
  try { await loadDashboard(); } catch (ex) { if (ex instanceof AuthError) return route("login"); }
  if (v === VIEW) renderAlerts();
}
function renderAlerts(loading = false) {
  const list = loadAlerts();
  const offline = STATE.devices.filter((d) => !d.online);
  const dur = (m) => m >= 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m} min`;
  const groups = new Map();
  for (const a of list) { const k = a.at.slice(0, 7); (groups.get(k) || groups.set(k, []).get(k)).push(a); }
  const node = el(`<div class="scr pad">
    <div class="thead"><h2 class="title">Alertas</h2>${loading ? '<span class="dotload"></span>' : ""}</div>
    <p class="lead2">${list.length} nos últimos 12 meses</p>
    ${offline.map((d) => `<div class="alert live"><span class="ai">${I.off}</span><div><b>${esc(d.name)} offline</b><span>Sem comunicação com a nuvem Ares agora</span></div></div>`).join("")}
    ${[...groups].map(([k, as]) => `<h3 class="mh">${MES[+k.slice(5, 7) - 1].replace(/^./, (c) => c.toUpperCase())} de ${k.slice(0, 4)}</h3>
      ${as.map((a) => { const dt = new Date(a.at.replace(" ", "T")); const [t, ic] = ALERT_T[a.type] || [a.type, I.info];
        return `<div class="alert"><span class="ai">${ic}</span><div><b>${t}</b><span>${dm(dt)}, ${hhmm(dt)} · ${dur(a.mins)}${STATE.devices.length > 1 ? ` · ${esc(a.dev)}` : ""}</span></div></div>`; }).join("")}`).join("")}
    ${!list.length && !offline.length ? `<div class="empty">${I.bell}<p>Nenhum alerta registrado.</p></div>` : ""}
    <p class="hint">O SolarLog verifica as leituras do dia sempre que o app é aberto: falta de rede, tensão fora da faixa da ANEEL e temperatura alta. O registro fica só neste aparelho.</p>
  </div>`);
  app.replaceChildren(node, navbar("alerts"));
}

/* ---------- ajustes ---------- */
function screenSettings() {
  const pnum = (s) => { const v = parseFloat(String(s).replace(/\./g, "").replace(",", ".")); return isFinite(v) && v >= 0 ? v : 0; };
  const pdec = (s) => { const v = parseFloat(String(s).replace(",", ".")); return isFinite(v) && v >= 0 ? v : 0; };
  const field = (id, label, help, val, mode = "decimal", ph = "") => `<section class="card">
    <label class="fld"><span>${label}</span><small>${help}</small>
    <input id="${id}" inputmode="${mode}" value="${esc(val)}" placeholder="${esc(ph)}"></label></section>`;
  const node = el(`<div class="scr pad">
    <div class="thead"><h2 class="title">Ajustes</h2><a class="iconbtn" href="#${LAST_TAB}" aria-label="Fechar">${I.close}</a></div>
    <h3 class="mh">Usina</h3>
    ${field("s-name", "Nome da usina", "Aparece no topo do app.", CFG.name, "text", "Ex.: Casa")}
    ${field("s-kwp", "Potência instalada (kWp)", "Soma dos painéis. Usada no “% da capacidade”.", CFG.kwp ? fmt(CFG.kwp, 2) : "", "decimal", "Ex.: 8,5")}
    <h3 class="mh">Tarifa de energia</h3>
    ${field("s-tar", "Tarifa (R$ por kWh)", "Valor da sua conta de luz, com impostos. Usada para calcular a economia.", fmt(CFG.tarifa, 2), "decimal", "0,90")}
    <h3 class="mh">Retorno do investimento</h3>
    ${field("s-inv", "Valor investido no sistema (R$)", "Se foi financiado, o mais realista é usar o total pago com juros.", CFG.invest ? fmt(CFG.invest, 2) : "", "decimal", "26.000,00")}
    <h3 class="mh">Painéis</h3>
    ${field("s-tc", "Coeficiente de temperatura (% por °C)", "Na ficha técnica do painel (Pmax), ex.: −0,30%/°C. Usado na perda estimada por calor.", fmt(CFG.tcoef, 2), "decimal", "0,30")}
    <h3 class="mh">Impacto ambiental</h3>
    ${field("s-co2", "Fator de emissão (kg CO₂ por kWh)", "Padrão: média da rede brasileira (SIN/MCTI), 0,0385.", fmt(CFG.co2, 4), "decimal", "0,0385")}
    <h3 class="mh">Localização</h3>
    <section class="card"><div class="loc"><span class="ic">${I.pin}</span><div><b>${CFG.geo ? "Sua localização" : "Padrão (São Paulo)"}</b><small>Usada só para o nascer e o pôr do sol.</small></div>
      <button class="btn sm" id="s-geo" type="button">Usar a minha</button></div></section>
    <h3 class="mh">Aparência</h3>
    <div class="seg" role="radiogroup">${[["system", "Sistema"], ["light", "Claro"], ["dark", "Escuro"]].map(([id, lb]) =>
      `<button role="radio" data-th="${id}" aria-checked="${CFG.theme === id}" aria-selected="${CFG.theme === id}">${lb}</button>`).join("")}</div>
    <h3 class="mh">Conta</h3>
    <section class="card"><button class="danger" id="s-out" type="button">${I.logout}<span><b>Sair da conta</b><small>Remove a sessão deste aparelho.</small></span></button></section>
    <p class="hint">Dados da nuvem Ares (a mesma do app Ares Cloud). Leituras do inversor a cada 5 minutos. Os ajustes ficam só neste aparelho.</p>
  </div>`);
  const bind = (id, fn) => node.querySelector("#" + id).addEventListener("change", (e) => { fn(e.target.value); saveCfg(); toast("Salvo"); });
  bind("s-name", (v) => (CFG.name = v.trim().slice(0, 40)));
  bind("s-kwp", (v) => (CFG.kwp = pdec(v)));
  bind("s-tar", (v) => (CFG.tarifa = pdec(v)));
  bind("s-inv", (v) => (CFG.invest = pnum(v)));
  bind("s-co2", (v) => (CFG.co2 = pdec(v)));
  bind("s-tc", (v) => (CFG.tcoef = Math.min(1, pdec(String(v).replace(/^[−-]/, ""))) || 0.3));
  node.querySelector("#s-geo").addEventListener("click", () => {
    if (!navigator.geolocation) return toast("Localização indisponível neste aparelho.", true);
    navigator.geolocation.getCurrentPosition((p) => {
      CFG.lat = +p.coords.latitude.toFixed(2); CFG.lon = +p.coords.longitude.toFixed(2); CFG.geo = true; saveCfg();
      toast("Localização salva"); if (CUR === "settings") screenSettings();
    }, () => toast("Não consegui obter a localização.", true), { timeout: 10000 });
  });
  node.querySelectorAll(".seg button").forEach((b) => b.addEventListener("click", () => {
    CFG.theme = b.dataset.th; saveCfg(); applyTheme();
    node.querySelectorAll(".seg button").forEach((x) => { x.setAttribute("aria-checked", x === b); x.setAttribute("aria-selected", x === b); });
  }));
  node.querySelector("#s-out").addEventListener("click", () => { S.token = null; S.uid = null; route("login"); });
  app.replaceChildren(node);
}

function errorScreen(tab, retry) {
  const node = el(`<div class="scr pad"><div class="empty">${I.off}<p>Não consegui falar com o servidor Ares.<br>Verifique a internet e tente de novo.</p>
    <button class="btn" style="max-width:220px;margin:20px auto 0">Tentar de novo</button></div></div>`);
  node.querySelector(".btn").addEventListener("click", retry);
  app.replaceChildren(node, navbar(tab));
}

/* ---------- toast ---------- */
let toastT;
function toast(msg, bad = false) {
  const old = $(".toast"); if (old) old.remove();
  const t = el(`<div class="toast${bad ? " bad" : ""}" role="status">${esc(msg)}</div>`);
  document.body.appendChild(t);
  clearTimeout(toastT); toastT = setTimeout(() => t.remove(), 2600);
}
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ---------- router ---------- */
const ROUTES = { home: screenHome, inverter: screenInverter, history: screenHistory, alerts: screenAlerts, settings: screenSettings };
let navLock = false; // ignora o hashchange que o próprio route dispara
function route(name, arg) {
  if (!ROUTES[name] && name !== "login") name = "home";
  if (name !== "login" && !S.token) name = "login";
  VIEW++;
  CUR = name;
  if (name !== "settings" && name !== "login") LAST_TAB = name;
  if (location.hash.slice(1) !== (name === "login" ? "" : name)) {
    navLock = true;
    location.hash = name === "login" ? "" : name;
    setTimeout(() => (navLock = false), 0);
  }
  window.scrollTo(0, 0);
  if (name === "login") return screenLogin();
  return ROUTES[name](arg);
}
window.addEventListener("hashchange", () => {
  if (navLock) return;                       // auto-induzido pelo route
  route(location.hash.slice(1) || "home");
});

/* atualização automática: a cada 5 min com o app visível, e ao voltar para ele */
let lastAuto = Date.now();
function autoRefresh() {
  if (document.visibilityState !== "visible" || !S.token || Date.now() - lastAuto < 5 * 60e3) return;
  lastAuto = Date.now();
  if (CUR === "home") screenHome();
  else if (CUR === "inverter") screenInverter(true);
  else loadDashboard().catch(() => {});
}
setInterval(autoRefresh, 30e3);
document.addEventListener("visibilitychange", autoRefresh);

/* ---------- boot ---------- */
/* dias guardados antes do resumo de calor existir: calcula uma vez */
try { const sums = loadSums(); for (const [k, r] of Object.entries(loadDays())) if (!sums[k]) saveSum(k, heatStats(toPts(r.p), toPts(r.t))); } catch {}
route(S.token ? (location.hash.slice(1) || "home") : "login");
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
