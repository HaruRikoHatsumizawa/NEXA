CREATE TABLE IF NOT EXISTS datasets (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS dataset_sheets (id INTEGER PRIMARY KEY AUTOINCREMENT,dataset_id INTEGER NOT NULL,sheet_name TEXT NOT NULL,columns_json TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT (datetime('now')),FOREIGN KEY(dataset_id) REFERENCES datasets(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS rows_data (id INTEGER PRIMARY KEY AUTOINCREMENT,sheet_id INTEGER NOT NULL,row_json TEXT NOT NULL,FOREIGN KEY(sheet_id) REFERENCES dataset_sheets(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS energy_readings (id INTEGER PRIMARY KEY AUTOINCREMENT,dispositivo TEXT NOT NULL,energia_kwh REAL NOT NULL,custo_brl REAL NOT NULL DEFAULT 0,potencia_w REAL NOT NULL DEFAULT 0,tensao_v REAL NOT NULL DEFAULT 0,corrente_a REAL NOT NULL DEFAULT 0,timestamp TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_dataset_sheets_dataset ON dataset_sheets(dataset_id);
CREATE INDEX IF NOT EXISTS idx_rows_sheet ON rows_data(sheet_id);
CREATE INDEX IF NOT EXISTS idx_energy_timestamp ON energy_readings(timestamp);