import * as SQLite from "expo-sqlite";

const DEFAULT_DEITY_NAME = "श्री राम";

export type UserRecord = {
  id: number;
  full_name: string;
  user_id: string;
  mobile_number: string;
  age: number;
  gender: string;
  sampraday: string;
  dob: string;
  password: string;
  created_at: string;
};

export type DebugUserRecord = UserRecord;

export type CreateUserInput = {
  fullName: string;
  userId: string;
  mobileNumber: string;
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

const USER_ID_REGEX = /^[a-zA-Z0-9._-]{4,24}$/;
const NAME_REGEX = /^[\p{L}\s.'-]{2,}$/u;
const MOBILE_REGEX = /^[0-9]{10}$/;
const PASSWORD_REGEX = /^[0-9]{4,}$/;

function parseDob(input: string) {
  const normalized = input.trim().replace(/\s+/g, "");
  const match = normalized.match(/^(\d{2})[/-](\d{2})[/-](\d{4})$/);
  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  const validDate =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  if (!validDate) {
    return null;
  }

  return { day, month, year, date };
}

function getAgeFromDob(dobDate: Date) {
  const today = new Date();
  let years = today.getFullYear() - dobDate.getFullYear();
  const monthDiff = today.getMonth() - dobDate.getMonth();
  const dayDiff = today.getDate() - dobDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    years -= 1;
  }

  return years;
}

function validateCreateUserInput(input: CreateUserInput) {
  const fullName = input.fullName.trim();
  const userId = input.userId.trim();
  const mobileNumber = input.mobileNumber.trim();
  const dob = input.dob.trim();

  if (!fullName || !userId || !mobileNumber || !dob || !input.password) {
    throw new Error("कृपया सभी आवश्यक जानकारी भरें।");
  }

  if (!NAME_REGEX.test(fullName)) {
    throw new Error("कृपया सही पूरा नाम दर्ज करें।");
  }

  if (!USER_ID_REGEX.test(userId)) {
    throw new Error("यूज़र आईडी 4-24 अक्षरों की होनी चाहिए।");
  }

  if (!MOBILE_REGEX.test(mobileNumber)) {
    throw new Error("कृपया सही मोबाइल नंबर दर्ज करें (10 अंक)।");
  }

  if (!Number.isInteger(input.age) || input.age < 5 || input.age > 120) {
    throw new Error("कृपया सही आयु दर्ज करें (5 से 120 के बीच)।");
  }

  if (!input.gender.trim() || !input.sampraday.trim()) {
    throw new Error("कृपया लिंग और सम्प्रदाय चुनें।");
  }

  const parsedDob = parseDob(dob);
  if (!parsedDob) {
    throw new Error("जन्म तिथि DD/MM/YYYY या DD-MM-YYYY प्रारूप में दर्ज करें।");
  }

  if (parsedDob.year < 1900 || parsedDob.date > new Date()) {
    throw new Error("कृपया सही जन्म तिथि दर्ज करें।");
  }

  const ageFromDob = getAgeFromDob(parsedDob.date);
  if (Math.abs(ageFromDob - input.age) > 1) {
    throw new Error("आयु और जन्म तिथि मेल नहीं खाती।");
  }

  if (!PASSWORD_REGEX.test(input.password)) {
    throw new Error(
      "फिलहाल पासवर्ड केवल अंकों में रखें (कम से कम 4 अंक)।"
    );
  }
}

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
      mobile_number TEXT NOT NULL UNIQUE,
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

  const userColumns = await db.getAllAsync<{ name: string }>(
    "PRAGMA table_info(users)"
  );
  const hasMobileColumn = userColumns.some(
    (column) => column.name === "mobile_number"
  );
  if (!hasMobileColumn) {
    await db.execAsync(
      "ALTER TABLE users ADD COLUMN mobile_number TEXT NOT NULL DEFAULT ''"
    );
  }

  // Backfill legacy rows that still have empty mobile_number so unique index creation won't fail.
  await db.execAsync(`
    UPDATE users
    SET mobile_number = 'legacy-' || id
    WHERE mobile_number IS NULL OR trim(mobile_number) = '';
  `);

  await db.execAsync(
    "CREATE UNIQUE INDEX IF NOT EXISTS idx_users_mobile_number_unique ON users(mobile_number)"
  );

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

export async function getUserByMobileNumber(mobileNumber: string) {
  const db = await initializeAuthDatabase();

  return db.getFirstAsync<UserRecord>(
    "SELECT * FROM users WHERE mobile_number = ? LIMIT 1",
    [mobileNumber.trim()]
  );
}

export async function createUser(input: CreateUserInput) {
  const db = await initializeAuthDatabase();
  validateCreateUserInput(input);
  const normalizedUserId = input.userId.trim();
  const normalizedMobileNumber = input.mobileNumber.trim();

  const existingUser = await getUserByUserId(normalizedUserId);
  if (existingUser) {
    throw new Error("यह यूज़र आईडी पहले से उपयोग में है।");
  }

  const existingMobileUser = await getUserByMobileNumber(normalizedMobileNumber);
  if (existingMobileUser) {
    throw new Error("यह मोबाइल नंबर पहले से उपयोग में है।");
  }

  await db.runAsync(
    `INSERT INTO users
      (full_name, user_id, mobile_number, age, gender, sampraday, dob, password)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.fullName.trim(),
      normalizedUserId,
      normalizedMobileNumber,
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

export async function signInWithNameAndPassword(
  fullName: string,
  password: string
) {
  const db = await initializeAuthDatabase();

  return db.getFirstAsync<UserRecord>(
    `SELECT * FROM users
     WHERE lower(trim(full_name)) = lower(trim(?))
       AND password = ?
     ORDER BY created_at DESC
     LIMIT 1`,
    [fullName.trim(), password]
  );
}

export async function signInWithMobileAndPassword(
  mobileNumber: string,
  password: string
) {
  const db = await initializeAuthDatabase();

  return db.getFirstAsync<UserRecord>(
    `SELECT * FROM users
     WHERE mobile_number = ?
       AND password = ?
     LIMIT 1`,
    [mobileNumber.trim(), password]
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

export async function resetAllLocalData() {
  const db = await initializeAuthDatabase();
  await db.execAsync(`
    DELETE FROM chant_progress;
    DELETE FROM deity_preferences;
    DELETE FROM current_session;
    DELETE FROM users;
  `);
}

export async function getAllUsersForDebug(): Promise<DebugUserRecord[]> {
  const db = await initializeAuthDatabase();
  return db.getAllAsync<DebugUserRecord>(
    `SELECT *
     FROM users
     ORDER BY datetime(created_at) DESC, id DESC`
  );
}
