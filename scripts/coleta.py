#!/usr/bin/env python3
"""Coleta do dia na nuvem Ares -> JSON mensal, lido pelo app (branch `data`). Stdlib only.

Uso (o workflow coleta.yml roda a cada 30 min, de dia, com TZ=America/Sao_Paulo):
  ARES_USER=... ARES_PASS=... python scripts/coleta.py <pasta>   # grava <pasta>/AAAA-MM.json

Formato, igual ao que o app guarda no aparelho (só números; sem nome, SN ou login):
  {"AAAA-MM-DD": {"p": [[minuto do dia, kW], ...], "t": [[minuto, °C], ...], "kwh": 12.3}}
p: potência somada dos inversores; t: maior temperatura entre eles; kwh: energia do dia.
"""
import json, os, sys
from collections import defaultdict
from datetime import datetime

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from poller import api, login  # noqa: E402  (mesma API do coletor SQLite)


def num(v):
    try:
        return None if v is None or v == "" else float(v)
    except (TypeError, ValueError):
        return None


def minute(t):
    h, m = t.split(" ")[1].split(":")[:2]
    return int(h) * 60 + int(m)


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else "dados"
    # secrets colados com espaço/quebra de linha nas pontas fazem a Ares recusar o login
    user, pw = (os.environ.get("ARES_USER") or "").strip(), (os.environ.get("ARES_PASS") or "").strip("\r\n")
    if not user or not pw:
        raise SystemExit("defina ARES_USER e ARES_PASS (secrets do repositório)")
    token = login(user, pw)
    uid = api("getInfo", token)["user"]["userId"]
    devices = [d["snCode"] for d in api("app/home/v3/appUserAllDevices", token, params={"userId": uid}).get("data") or [] if d.get("snCode")]

    now = datetime.now()
    day = now.strftime("%Y-%m-%d")
    power = defaultdict(float)            # createTime -> W somado
    temp = {}                             # createTime -> maior °C
    wh = 0.0
    for sn in devices:
        r = api("app/plant_statistics/devicePowerToday", token, params={"snCodes": sn})
        rows = [s for s in (r.get("data") or []) if str(s.get("createTime", "")).startswith(day)]
        by_ch = defaultdict(list)
        for s in rows:
            power[s["createTime"]] += num(s.get("channelPower")) or 0
            t = num(s.get("temperature"))
            if t is not None:
                temp[s["createTime"]] = max(temp.get(s["createTime"], -99), t)
            g = num(s.get("channelPowerGeneration"))
            if g and g > 0:
                by_ch[s.get("channelNumber")].append((s["createTime"], g))
        for arr in by_ch.values():        # energia do dia = último - primeiro acumulado, por canal
            arr.sort()
            wh += max(0, arr[-1][1] - arr[0][1])

    path = os.path.join(out, now.strftime("%Y-%m") + ".json")
    os.makedirs(out, exist_ok=True)
    try:
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
    except (OSError, ValueError):
        data = {}
    prev = data.get(day, {})

    t_pts = sorted([minute(k), round(v, 1)] for k, v in temp.items())
    if not t_pts and devices:
        # curva do dia sem temperatura: guarda a leitura ao vivo de cada execução
        t_pts = [p for p in prev.get("t", [])]
        m = now.hour * 60 + now.minute
        vals = []
        for sn in devices:
            d = api("app/plant_statistics/currentDeviceDetail", token, params={"snCode": sn, "channelNumber": 1}).get("data") or {}
            v = num(d.get("temperature"))
            if v is not None:
                vals.append(v)
        if vals and not any(abs(p[0] - m) < 4 for p in t_pts):
            t_pts.append([m, round(max(vals), 1)])
        t_pts.sort()

    p_pts = sorted([minute(k), round(v / 1000, 3)] for k, v in power.items())
    if not p_pts and not t_pts:
        print(f"{day}: sem leituras ainda")
        return
    data[day] = {"p": p_pts or prev.get("p", []), "t": t_pts, "kwh": round(wh / 1000, 2) or prev.get("kwh", 0)}
    with open(path, "w", encoding="utf-8") as f:
        json.dump(dict(sorted(data.items())), f, separators=(",", ":"))
    print(f"{day}: {len(p_pts)} pontos de potência, {len(t_pts)} de temperatura, {data[day]['kwh']} kWh")


if __name__ == "__main__":
    main()
