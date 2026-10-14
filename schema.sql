-- Banco de geração dos microinversores Ares Cloud. SQLite.
PRAGMA journal_mode=WAL;

CREATE TABLE IF NOT EXISTS device (
  sn_code    TEXT PRIMARY KEY,
  name       TEXT,
  model_type TEXT,
  plant_name TEXT,
  last_seen  TEXT
);

-- Uma linha por amostra de poll, por canal. channel_power em W, total_wh acumulado (Wh).
CREATE TABLE IF NOT EXISTS reading (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  sn_code       TEXT NOT NULL REFERENCES device(sn_code),
  channel       INTEGER NOT NULL,
  ts            TEXT NOT NULL,              -- ISO local, hora da coleta
  channel_power REAL,                       -- W
  channel_volt  REAL,                       -- V
  channel_amp   REAL,                       -- A
  city_volt     REAL,
  city_power    REAL,
  temperature   REAL,
  peak_power    REAL,
  total_wh      REAL,                        -- acumulado do canal, em Wh
  UNIQUE(sn_code, channel, ts)
);
CREATE INDEX IF NOT EXISTS ix_reading_sn_ts ON reading(sn_code, ts);

-- Energia diária em kWh: delta (max-min) do acumulado POR CANAL, somado por inversor, /1000.
-- Agrupar por canal é essencial: total_wh é por canal; sem isso o MAX-MIN mede a diferença
-- entre canais, não a geração do dia.
CREATE VIEW IF NOT EXISTS daily_energy AS
WITH per_ch AS (
  SELECT sn_code, channel, substr(ts,1,10) AS day,
         MAX(total_wh) - MIN(total_wh) AS wh
  FROM reading
  GROUP BY sn_code, channel, substr(ts,1,10)
)
SELECT sn_code, day, SUM(wh) / 1000.0 AS kwh
FROM per_ch
GROUP BY sn_code, day;
