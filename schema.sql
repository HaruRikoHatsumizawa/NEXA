CREATE TABLE IF NOT EXISTS datasets (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT NOT NULL,
 sheet_name TEXT NOT NULL,
 columns_json TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS rows_data (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 dataset_id INTEGER NOT NULL,
 row_json TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 FOREIGN KEY(dataset_id) REFERENCES datasets(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS energy_readings (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 dispositivo TEXT NOT NULL,
 energia_kwh REAL NOT NULL,
 custo_brl REAL NOT NULL DEFAULT 0,
 potencia_w REAL NOT NULL DEFAULT 0,
 tensao_v REAL NOT NULL DEFAULT 0,
 corrente_a REAL NOT NULL DEFAULT 0,
 timestamp TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_rows_dataset_id ON rows_data(dataset_id);
CREATE INDEX IF NOT EXISTS idx_datasets_name_sheet ON datasets(name,sheet_name);
CREATE INDEX IF NOT EXISTS idx_energy_timestamp ON energy_readings(timestamp);
