import * as SQLite from "expo-sqlite";

const DEFAULT_DEITY_NAME = "श्री राम";

export type UserRecord = {
  id: number;
  full_name: string;
  user_id: string;
  age: number;
  gender: string;
  sampraday: string;
  dob: string;
  password: string;
  created_at: string;
};

export type CreateUserInput = {
  fullName: string;
  userId: string;
  age: number;
  gender: string;
  sampraday: string;
  dob: string;
  password: string;
};

export type DeityRecord = {
  id: number;
  user_id: string;
  name: string;
  is_active: number;
  created_at: string;
};

export type ChantSummary = {
  deityId: number;
  deityName: string;
  totalChants: number;
  currentLapCount: number;
  totalMalas: number;
  isActive: boolean;
};

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;
let initialized = false;

async function getDatabase() {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync("govinda-auth.db");
  }

  return databasePromise;
}

export async function initializeAuthDatabase() {
  const db = await getDatabase();

  if (initialized) {
    return db;
  }

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      user_id TEXT NOT NULL UNIQUE,
      age INTEGER NOT NULL,
      gender TEXT NOT NULL,
      sampraday TEXT NOT NULL,
      dob TEXT NOT NULL,
      password TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS current_session (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      user_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    );
    CREATE TABLE IF NOT EXISTS deity_preferences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, name),
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    );
    CREATE TABLE IF NOT EXISTS chant_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      deity_id INTEGER NOT NULL,
      total_chants INTEGER NOT NULL DEFAULT 0,
      current_lap_count INTEGER NOT NULL DEFAULT 0,
      total_malas INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, deity_id),
      FOREIGN KEY (user_id) REFERENCES users(user_id),
      FOREIGN KEY (deity_id) REFERENCES deity_preferences(id)
    );
  `);

  initialized = true;
  return db;
}

async function ensureDefaultDeity(userId: string) {
  const db = await initializeAuthDatabase();
  const normalizedUserId = userId.trim();

  const existing = await db.getFirstAsync<DeityRecord>(
    "SELECT * FROM deity_preferences WHERE user_id = ? LIMIT 1",
    [normalizedUserId]
  );

  if (!existing) {
    await db.runAsync(
      `INSERT INTO deity_preferences (user_id, name, is_active)
       VALUES (?, ?, 1)`,
      [normalizedUserId, DEFAULT_DEITY_NAME]
    );
  }
}

export async function getUserByUserId(userId: string) {
  const db = await initializeAuthDatabase();

  return db.getFirstAsync<UserRecord>(
    "SELECT * FROM users WHERE user_id = ? LIMIT 1",
    [userId.trim()]
  );
}

export async function createUser(input: CreateUserInput) {
  const db = await initializeAuthDatabase();
  const normalizedUserId = input.userId.trim();

  const existingUser = await getUserByUserId(normalizedUserId);
  if (existingUser) {
    throw new Error("यह यूज़र आईडी पहले से उपयोग में है।");
  }

  await db.runAsync(
    `INSERT INTO users
      (full_name, user_id, age, gender, sampraday, dob, password)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      input.fullName.trim(),
      normalizedUserId,
      input.age,
      input.gender,
      input.sampraday,
      input.dob.trim(),
      input.password,
    ]
  );

  await ensureDefaultDeity(normalizedUserId);
}

export async function signInWithCredentials(userId: string, password: string) {
  const db = await initializeAuthDatabase();

  return db.getFirstAsync<UserRecord>(
    "SELECT * FROM users WHERE user_id = ? AND password = ? LIMIT 1",
    [userId.trim(), password]
  );
}

export async function setCurrentSession(userId: string) {
  const db = await initializeAuthDatabase();

  await db.runAsync(
    `INSERT OR REPLACE INTO current_session (id, user_id, created_at)
     VALUES (1, ?, CURRENT_TIMESTAMP)`,
    [userId.trim()]
  );
}

export async function clearCurrentSession() {
  const db = await initializeAuthDatabase();
  await db.runAsync("DELETE FROM current_session WHERE id = 1");
}

export async function getCurrentSessionUser() {
  const db = await initializeAuthDatabase();

  return db.getFirstAsync<UserRecord>(
    `SELECT users.* FROM current_session
     JOIN users ON users.user_id = current_session.user_id
     WHERE current_session.id = 1
     LIMIT 1`
  );
}

export async function getDeitiesForUser(userId: string) {
  const db = await initializeAuthDatabase();
  await ensureDefaultDeity(userId);

  return db.getAllAsync<DeityRecord>(
    `SELECT * FROM deity_preferences
     WHERE user_id = ?
     ORDER BY is_active DESC, created_at ASC`,
    [userId.trim()]
  );
}

export async function addDeityForUser(userId: string, deityName: string) {
  const db = await initializeAuthDatabase();
  const trimmedName = deityName.trim();

  if (!trimmedName) {
    throw new Error("कृपया इष्ट नाम दर्ज करें।");
  }

  const existing = await db.getFirstAsync<DeityRecord>(
    `SELECT * FROM deity_preferences
     WHERE user_id = ? AND lower(name) = lower(?)
     LIMIT 1`,
    [userId.trim(), trimmedName]
  );

  if (existing) {
    throw new Error("यह इष्ट नाम पहले से मौजूद है।");
  }

  await db.runAsync(
    `INSERT INTO deity_preferences (user_id, name, is_active)
     VALUES (?, ?, 0)`,
    [userId.trim(), trimmedName]
  );
}

export async function setActiveDeityForUser(userId: string, deityId: number) {
  const db = await initializeAuthDatabase();

  await db.runAsync(
    "UPDATE deity_preferences SET is_active = 0 WHERE user_id = ?",
    [userId.trim()]
  );

  await db.runAsync(
    "UPDATE deity_preferences SET is_active = 1 WHERE user_id = ? AND id = ?",
    [userId.trim(), deityId]
  );
}

export async function getChantSummariesForUser(
  userId: string
): Promise<ChantSummary[]> {
  const db = await initializeAuthDatabase();
  await ensureDefaultDeity(userId);

  const rows = await db.getAllAsync<{
    deity_id: number;
    deity_name: string;
    total_chants: number | null;
    current_lap_count: number | null;
    total_malas: number | null;
    is_active: number;
  }>(
    `SELECT
       deity_preferences.id AS deity_id,
       deity_preferences.name AS deity_name,
       COALESCE(chant_progress.total_chants, 0) AS total_chants,
       COALESCE(chant_progress.current_lap_count, 0) AS current_lap_count,
       COALESCE(chant_progress.total_malas, 0) AS total_malas,
       deity_preferences.is_active AS is_active
     FROM deity_preferences
     LEFT JOIN chant_progress
       ON chant_progress.deity_id = deity_preferences.id
      AND chant_progress.user_id = deity_preferences.user_id
     WHERE deity_preferences.user_id = ?
     ORDER BY deity_preferences.is_active DESC, deity_preferences.created_at ASC`,
    [userId.trim()]
  );

  return rows.map((row) => ({
    deityId: row.deity_id,
    deityName: row.deity_name,
    totalChants: row.total_chants ?? 0,
    currentLapCount: row.current_lap_count ?? 0,
    totalMalas: row.total_malas ?? 0,
    isActive: Boolean(row.is_active),
  }));
}

export async function getActiveChantSummary(userId: string) {
  const summaries = await getChantSummariesForUser(userId);
  return summaries.find((summary) => summary.isActive) ?? null;
}

export async function incrementActiveDeityChant(userId: string) {
  const db = await initializeAuthDatabase();
  const activeSummary = await getActiveChantSummary(userId);

  if (!activeSummary) {
    throw new Error("कृपया पहले सेटिंग्स में एक इष्ट नाम चुनें।");
  }

  const nextTotalChants = activeSummary.totalChants + 1;
  const rolledOver = activeSummary.currentLapCount + 1 > 107;
  const nextCurrentLapCount = rolledOver
    ? 0
    : activeSummary.currentLapCount + 1;
  const nextTotalMalas = rolledOver
    ? activeSummary.totalMalas + 1
    : activeSummary.totalMalas;

  await db.runAsync(
    `INSERT INTO chant_progress
      (user_id, deity_id, total_chants, current_lap_count, total_malas, updated_at)
     VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(user_id, deity_id)
     DO UPDATE SET
       total_chants = excluded.total_chants,
       current_lap_count = excluded.current_lap_count,
       total_malas = excluded.total_malas,
       updated_at = CURRENT_TIMESTAMP`,
    [
      userId.trim(),
      activeSummary.deityId,
      nextTotalChants,
      nextCurrentLapCount,
      nextTotalMalas,
    ]
  );

  return {
    ...activeSummary,
    totalChants: nextTotalChants,
    currentLapCount: nextCurrentLapCount,
    totalMalas: nextTotalMalas,
  };
}
