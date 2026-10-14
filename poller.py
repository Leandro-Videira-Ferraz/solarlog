#!/usr/bin/env python3
"""Coletor de geracao Ares Cloud -> SQLite. Stdlib only.

Uso:
  ARES_USER=... ARES_PASS=... python poller.py            # 1 coleta
  ARES_USER=... ARES_PASS=... python poller.py --loop 300  # a cada 300s
"""
import json, os, sqlite3, sys, time, urllib.request, urllib.error, urllib.parse
from datetime import datetime

BASE = "https://appcloud.areswatt.com/prod-api/"
DB = os.path.join(os.path.dirname(__file__), "ares.db")
SCHEMA = os.path.join(os.path.dirname(__file__), "schema.sql")


class AuthError(Exception):
    pass


def api(path, token=None, method="GET", params=None):
    url = BASE + path
    data = None
    headers = {"lang": "pt-BR"}
    if token:
        headers["Authorization"] = "Bearer " + token
    if method == "GET" and params:
        url += "?" + urllib.parse.urlencode(params, doseq=True)
    elif params is not None:
        data = json.dumps(params).encode()
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        if e.code in (401, 403):
            raise AuthError(path)
        raise


def login(user, pw):
    r = api("app/user/login", method="POST", params={"username": user, "password": pw})
    if r.get("code") != 200:
        raise SystemExit("login falhou: " + str(r.get("msg")))
    return r["token"]


def db():
    con = sqlite3.connect(DB)
    with open(SCHEMA, encoding="utf-8") as f:
        con.executescript(f.read())
    return con


def collect(con, token, user_id):
    now = datetime.now().isoformat(timespec="seconds")
    devs = api("app/home/v3/appUserAllDevices", token, params={"userId": user_id})
    for d in devs.get("data", []):
        sn = d.get("snCode")
        if not sn:
            continue
        con.execute(
            "INSERT INTO device(sn_code,name,model_type,plant_name,last_seen) VALUES(?,?,?,?,?) "
            "ON CONFLICT(sn_code) DO UPDATE SET name=excluded.name,"
            "model_type=excluded.model_type,plant_name=excluded.plant_name,last_seen=excluded.last_seen",
            (sn, d.get("deviceName"), d.get("modelType"), d.get("plantName"), now),
        )
        # canais 1..4; canal vazio não interrompe os seguintes
        for ch in range(1, 5):
            r = api("app/plant_statistics/currentDeviceDetail", token,
                    params={"snCode": sn, "channelNumber": ch})
            v = r.get("data")
            if r.get("code") != 200 or not v:
                continue
            con.execute(
                "INSERT OR IGNORE INTO reading(sn_code,channel,ts,channel_power,channel_volt,"
                "channel_amp,city_volt,city_power,temperature,peak_power,total_wh) "
                "VALUES(?,?,?,?,?,?,?,?,?,?,?)",
                (sn, ch, now, v.get("channelPower"), v.get("channelVoltage"),
                 v.get("channelElectric"), v.get("cityVoltage"), v.get("cityPower"),
                 v.get("temperature"), v.get("peakPower"), v.get("total")),
            )
        print(f"{now} {sn}: ok")
    con.commit()


def main():
    user, pw = os.environ.get("ARES_USER"), os.environ.get("ARES_PASS")
    if not user or not pw:
        raise SystemExit("defina ARES_USER e ARES_PASS")
    loop = None
    if len(sys.argv) >= 3 and sys.argv[1] == "--loop":
        loop = int(sys.argv[2])
    con = db()
    token = login(user, pw)
    user_id = api("getInfo", token)["user"]["userId"]
    while True:
        try:
            collect(con, token, user_id)
        except AuthError:                       # token expirou: re-loga uma vez
            try:
                token = login(user, pw)
                user_id = api("getInfo", token)["user"]["userId"]
            except Exception as e:              # login falhou: espera o intervalo, não martela
                print("re-login falhou:", e)
        except Exception as e:                  # timeout, DNS, JSON, campo ausente: não derruba o daemon
            print("erro na coleta:", e)
        if loop is None:
            break
        time.sleep(loop)


if __name__ == "__main__":
    main()
