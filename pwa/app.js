/* SolarLog — PWA monitor Ares. Reusa a API oficial; histórico vem da nuvem Ares. */
"use strict";
const BASE = "https://appcloud.areswatt.com/prod-api/";
const $ = (s, r = document) => r.querySelector(s);
const el = (h) => { const t = document.createElement("template"); t.innerHTML = h.trim(); return t.content.firstChild; };
const app = $("#app");

/* ---------- ícones (stroke 1.6, uma gramática) ---------- */
const I = {
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.64-6.36M21 3v4h-4"/></svg>',
  logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8M5 10v10h14V10"/></svg>',
  hist: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18M7 15l4-5 3 3 5-7"/></svg>',
  chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="#f5a623" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>',
  off: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12h8"/></svg>',
};

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

/* data local (não UTC), YYYY-MM-DD */
const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/* ---------- coleta ---------- */
async function fetchDevices() {
  const r = await api("app/home/v3/appUserAllDevices", { params: { userId: S.uid } });
  return (r.data || []).map((d) => ({
    sn: d.snCode, name: d.deviceName || d.snCode, plant: d.plantName || "",
    online: d.state === true, id: d.id,
  }));
}
/* amostras do dia por device: array achatado de pontos por canal.
   Cada ponto: {createTime, channelNumber, channelPower, channelPowerGeneration(Wh acum), ...} */
async function fetchToday(sn) {
  const r = await api("app/plant_statistics/devicePowerToday", { params: { snCodes: [sn] } });
  return r.code === 200 && Array.isArray(r.data) ? r.data : [];
}
/* leitura ao vivo por canal (tela de detalhe): tem impedância, pico etc. */
async function fetchChannels(sn) {
  const out = [];
  for (let ch = 1; ch <= 4; ch++) {
    const r = await api("app/plant_statistics/currentDeviceDetail", { params: { snCode: sn, channelNumber: ch } });
    if (r.code === 200 && r.data) out.push({ ch, ...r.data });  // canal vazio não interrompe os seguintes
  }
  return out;
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
/* kWh/dia da conta (soma dos inversores), mais recente primeiro. */
async function fetchHistory(days) {
  const end = new Date(), start = new Date();
  start.setDate(end.getDate() - (days - 1));
  const devices = await fetchDevices();
  const perDev = await Promise.all(devices.map((d) => fetchDeviceHistory(d.sn, ymd(start), ymd(end))));
  const byDate = new Map();
  for (const rows of perDev) for (const r of rows) {
    const date = `${r.year}-${r.date}`;
    byDate.set(date, (byDate.get(date) || 0) + Math.max(0, Number(r.channelPowerGeneration) || 0));
  }
  return [...byDate].map(([date, wh]) => ({ date, kwh: wh / 1000 })).sort((a, b) => a.date < b.date ? 1 : -1);
}

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
  return { totalWh, todayWh, powerNow };
}
/* série temporal única: W somado por horário, entre todos os devices/canais */
function timeSeries(samples) {
  const map = new Map();
  for (const s of samples) map.set(s.createTime, (map.get(s.createTime) || 0) + Number(s.channelPower || 0));
  return [...map.entries()].sort((a, b) => a[0] < b[0] ? -1 : 1)
    .map(([t, w]) => ({ t: t.split(" ")[1]?.slice(0, 5) || t, w }));
}
const fmt = (n, d = 0) => (n == null || isNaN(n)) ? "—" : Number(n).toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });

/* ---------- estado em memória ---------- */
let STATE = { devices: [], series: [], powerNow: 0, kwhToday: 0, totalKwh: 0, updated: null };

async function loadDashboard() {
  const devices = await fetchDevices();
  let allSamples = [], totalWh = 0, todayWh = 0;
  for (const d of devices) {
    const samples = await fetchToday(d.sn);
    d.samples = samples;
    const sm = summarize(samples);
    d.powerNow = sm.powerNow;
    totalWh += sm.totalWh; todayWh += sm.todayWh;
    allSamples = allSamples.concat(samples);
  }
  const series = timeSeries(allSamples);
  const powerNow = devices.reduce((s, d) => s + (d.powerNow || 0), 0);
  STATE = { devices, series, powerNow, kwhToday: todayWh / 1000, totalKwh: totalWh / 1000, updated: new Date() };
  return STATE;
}

/* ================= TELAS ================= */
let TAB = "home";

function screenLogin() {
  const node = el(`<div class="login">
    <div class="brand">${I.sun}<h1>SolarLog</h1><p>Monitor da sua usina Ares</p></div>
    <form id="lf" novalidate>
      <div class="field"><label class="kcaps" for="u">Usuário</label>
        <input id="u" type="email" autocomplete="username" placeholder="seu e-mail" inputmode="email"></div>
      <div class="field"><label class="kcaps" for="p">Senha</label>
        <input id="p" type="password" autocomplete="current-password" placeholder="••••••••"></div>
      <button class="btn" type="submit">Entrar</button>
      <div class="err" id="le" role="alert"></div>
    </form>
    <p class="note">Mesmas credenciais do app Ares Cloud.<br>Ficam só neste aparelho, nesta sessão.</p>
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

function topbar(onRefresh) {
  const bar = el(`<div class="bar">
    <div class="mark"><span class="dot"></span>SolarLog</div><div class="sp"></div>
    <button class="iconbtn" id="rf" title="Atualizar" aria-label="Atualizar">${I.refresh}</button>
    <button class="iconbtn" id="lo" title="Sair" aria-label="Sair">${I.logout}</button>
  </div>`);
  bar.querySelector("#rf").addEventListener("click", onRefresh);
  bar.querySelector("#lo").addEventListener("click", () => { S.token = null; S.uid = null; route("login"); });
  return bar;
}

function chart(series) {
  const W = 488, H = 150, pad = { l: 4, r: 4, t: 10, b: 18 };
  if (!series.length) return el(`<svg class="chart" viewBox="0 0 ${W} ${H}"></svg>`);
  const maxW = Math.max(10, ...series.map((p) => p.w));
  const n = series.length;
  const x = (i) => pad.l + (i / Math.max(1, n - 1)) * (W - pad.l - pad.r);
  const y = (w) => pad.t + (1 - w / maxW) * (H - pad.t - pad.b);
  const pts = series.map((p, i) => [x(i), y(p.w)]);
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = `M${pts[0][0].toFixed(1)} ${(H - pad.b).toFixed(1)} ` +
    pts.map((p) => "L" + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ") +
    ` L${pts[n - 1][0].toFixed(1)} ${(H - pad.b).toFixed(1)} Z`;
  const peakI = series.reduce((m, p, i) => p.w > series[m].w ? i : m, 0);
  const gy = [0.25, 0.5, 0.75].map((f) => pad.t + f * (H - pad.t - pad.b));
  const labIdx = [0, Math.floor(n / 2), n - 1];
  return el(`<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Curva de geração de hoje">
    <defs><linearGradient id="g-amber" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f5a623" stop-opacity=".34"/><stop offset="1" stop-color="#f5a623" stop-opacity="0"/>
    </linearGradient></defs>
    ${gy.map((yy) => `<line class="grid" x1="0" y1="${yy.toFixed(1)}" x2="${W}" y2="${yy.toFixed(1)}"/>`).join("")}
    <path class="area" d="${area}"/><path class="line" d="${line}"/>
    <circle class="peak" cx="${x(peakI).toFixed(1)}" cy="${y(series[peakI].w).toFixed(1)}" r="3"/>
    ${labIdx.map((i) => `<text class="axis" x="${x(i).toFixed(1)}" y="${H - 5}" text-anchor="${i === 0 ? "start" : i === n - 1 ? "end" : "middle"}">${series[i].t}</text>`).join("")}
  </svg>`);
}

function deviceRow(d) {
  const z = !d.powerNow ? " z" : "";
  const node = el(`<button class="dev">
    <span class="led ${d.online ? "on" : "off"}"></span>
    <span class="nm"><b>${esc(d.name)}</b><span>${esc(d.sn)}</span></span>
    <span class="pw${z}">${fmt(d.powerNow)}<span class="u">W</span></span>
    <span class="chev">${I.chev}</span>
  </button>`);
  node.addEventListener("click", () => route("device", d.sn));
  return node;
}

function navbar(active) {
  const nav = el(`<nav class="nav">
    <a href="#home" class="${active === "home" ? "on" : ""}">${I.home}Painel</a>
    <a href="#history" class="${active === "history" ? "on" : ""}">${I.hist}Histórico</a>
  </nav>`);
  return nav;
}

function skeletonDash() {
  app.replaceChildren(
    topbar(() => {}),
    el(`<div class="readout"><div class="lab"><span class="kcaps">Gerando agora</span></div>
      <div class="sk" style="height:76px;width:72%"></div>
      <div class="sub"><div class="sk" style="height:34px;width:40%"></div><div class="sk" style="height:34px;width:40%"></div></div></div>`),
    el(`<hr class="seam">`),
    el(`<div class="panel"><div class="sk" style="height:150px"></div></div>`),
    navbar("home"),
  );
}

async function screenDashboard() {
  skeletonDash();
  let st;
  try { st = await loadDashboard(); }
  catch (ex) { if (ex instanceof AuthError) return route("login"); return errorScreen("home", screenDashboard); }
  const off = !st.powerNow;
  const node = el(`<div>
    <div class="readout">
      <div class="lab"><span class="live${off ? "" : " gen"}"></span><span class="kcaps">Gerando agora</span></div>
      <div class="big${off ? " off" : ""}">${fmt(st.powerNow)}<span class="u">W</span></div>
      <div class="sub">
        <div class="stat"><span class="k kcaps">Hoje</span><span class="v">${fmt(st.kwhToday, 1)}<span class="u">kWh</span></span></div>
        <div class="stat"><span class="k kcaps">Total</span><span class="v">${fmt(st.totalKwh, 0)}<span class="u">kWh</span></span></div>
      </div>
    </div>
    <hr class="seam">
    <section class="panel">
      <div class="phead"><span class="t">Curva de hoje</span><span class="meta">pico ${fmt(Math.max(0, ...st.series.map((p) => p.w)))} W</span></div>
    </section>
    <hr class="seam">
    <section class="devs" aria-label="Inversores"></section>
  </div>`);
  node.querySelector(".panel").appendChild(chart(st.series));
  const devs = node.querySelector(".devs");
  if (st.devices.length) st.devices.forEach((d) => devs.appendChild(deviceRow(d)));
  else devs.appendChild(el(`<div class="empty">${I.off}<p>Nenhum inversor na sua conta.</p></div>`));
  app.replaceChildren(topbar(() => route("home")), node, navbar("home"));
  if (st.updated) toast(`Atualizado ${st.updated.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`);
}

async function screenDevice(sn) {
  const d = STATE.devices.find((x) => x.sn === sn);
  const head = topbar(() => route("device", sn));
  app.replaceChildren(head, el(`<div class="detail"><div class="sk" style="height:140px;margin-bottom:12px"></div><div class="sk" style="height:140px"></div></div>`), navbar("home"));
  let chans;
  try { chans = d?.channels || await fetchChannels(sn); }
  catch (ex) { if (ex instanceof AuthError) return route("login"); return errorScreen("home", () => screenDevice(sn)); }
  const node = el(`<div class="detail">
    <div class="phead" style="margin:4px 2px 16px"><span class="t">${esc(d?.name || sn)}</span>
      <span class="meta">${d?.online ? "online" : "offline"}</span></div>
  </div>`);
  if (!chans.length) node.appendChild(el(`<div class="empty">${I.off}<p>Sem leitura dos canais agora.</p></div>`));
  chans.forEach((c) => {
    const hot = Number(c.temperature) >= 60;
    node.appendChild(el(`<div class="chan"><h3>Canal ${c.ch}</h3>
      <div class="metrics">
        <div class="metric"><span class="k kcaps">Potência</span><span class="v">${fmt(c.channelPower)}<span class="u">W</span></span></div>
        <div class="metric"><span class="k kcaps">Tensão PV</span><span class="v">${fmt(c.channelVoltage, 1)}<span class="u">V</span></span></div>
        <div class="metric"><span class="k kcaps">Corrente</span><span class="v">${fmt(c.channelElectric, 2)}<span class="u">A</span></span></div>
        <div class="metric"><span class="k kcaps">Rede</span><span class="v">${fmt(c.cityVoltage, 1)}<span class="u">V</span></span></div>
        <div class="metric"><span class="k kcaps">Temperatura</span><span class="v${hot ? " hot" : ""}">${fmt(c.temperature, 1)}<span class="u">°C</span></span></div>
        <div class="metric"><span class="k kcaps">Acumulado</span><span class="v">${fmt(Number(c.total) / 1000, 1)}<span class="u">kWh</span></span></div>
      </div></div>`));
  });
  app.replaceChildren(head, node, navbar("home"));
}

const HIST_RANGES = [30, 90];
let histDays = 30, histReq = 0;
try { histDays = HIST_RANGES.includes(+localStorage.getItem("hist_days")) ? +localStorage.getItem("hist_days") : 30; } catch {}
async function screenHistory() {
  const my = ++histReq;
  const ph = el(`<div class="panel" style="padding-bottom:4px">
    <div class="phead"><span class="t">Geração diária</span><span class="meta"></span></div>
    <div class="seg" role="group" aria-label="Período">${HIST_RANGES.map((n) =>
      `<button type="button" data-d="${n}" aria-pressed="${n === histDays}">${n} dias</button>`).join("")}</div>
  </div>`);
  ph.querySelectorAll(".seg button").forEach((b) => b.addEventListener("click", () => {
    if (+b.dataset.d === histDays) return;
    histDays = +b.dataset.d;
    try { localStorage.setItem("hist_days", histDays); } catch {}
    screenHistory();
  }));
  app.replaceChildren(topbar(() => route("history")), ph,
    el(`<div class="hist">${'<div class="sk" style="height:22px;margin:15px 2px"></div>'.repeat(6)}</div>`), navbar("history"));
  let rows;
  try { rows = await fetchHistory(histDays); }
  catch (ex) { if (ex instanceof AuthError) return route("login"); if (my === histReq) errorScreen("history", screenHistory); return; }
  if (my !== histReq) return;                                       // outro período foi pedido depois
  if (TAB !== "history") return;                                    // usuário saiu durante o fetch
  const node = el(`<div class="hist"></div>`);
  if (!rows.length) {
    node.appendChild(el(`<div class="empty">${I.hist}<p>Sem geração registrada na nuvem Ares<br>nos últimos ${histDays} dias.</p></div>`));
  } else {
    const max = Math.max(0.001, ...rows.map((r) => r.kwh));
    rows.forEach((r) => {
      const dt = new Date(r.date + "T12:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
      node.appendChild(el(`<div class="hrow">
        <div class="d"><b>${esc(dt)}</b><span>${esc(r.date)}</span></div>
        <div class="bar-wrap"><div class="bar-fill" style="width:${(r.kwh / max * 100).toFixed(0)}%"></div></div>
        <div class="kwh">${fmt(r.kwh, 1)}<span class="u">kWh</span></div>
      </div>`));
    });
  }
  const total = rows.reduce((s, r) => s + r.kwh, 0);
  ph.querySelector(".meta").textContent = `${rows.length} dia(s) · ${fmt(total, 0)} kWh`;
  app.replaceChildren(topbar(() => route("history")), ph, node, navbar("history"));
}

function errorScreen(tab, retry) {
  const node = el(`<div class="empty">${I.off}<p>Não consegui falar com o servidor Ares.<br>Verifique a internet e tente de novo.</p>
    <button class="btn" style="max-width:200px;margin:20px auto 0">Tentar de novo</button></div>`);
  node.querySelector(".btn").addEventListener("click", retry);
  app.replaceChildren(topbar(retry), node, navbar(tab));
}

/* ---------- toast ---------- */
let toastT;
function toast(msg, bad = false) {
  const old = $(".toast"); if (old) old.remove();
  const t = el(`<div class="toast${bad ? " bad" : ""}">${bad ? '<span class="ld"></span>' : ""}${esc(msg)}</div>`);
  document.body.appendChild(t);
  clearTimeout(toastT); toastT = setTimeout(() => t.remove(), 2600);
}
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ---------- router ---------- */
let navLock = false; // ignora o hashchange que o próprio route dispara
function route(name, arg) {
  if (name !== "login" && !S.token) name = "login";
  TAB = name === "history" ? "history" : "home";
  if (name !== "device") {
    navLock = true;
    location.hash = name === "login" ? "" : name;
    setTimeout(() => (navLock = false), 0);
  }
  if (name === "login") return screenLogin();
  if (name === "history") return screenHistory();
  if (name === "device") return screenDevice(arg);
  return screenDashboard();
}
window.addEventListener("hashchange", () => {
  if (navLock) return;                       // auto-induzido pelo route
  const h = location.hash.slice(1);
  route(!S.token ? "login" : h === "history" ? "history" : "home");
});

/* ---------- boot ---------- */
route(S.token ? "home" : "login");
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
