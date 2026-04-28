import * as SQLite from "expo-sqlite";

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
  `);

  initialized = true;
  return db;
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

  const existingUser = await getUserByUserId(input.userId);
  if (existingUser) {
    throw new Error("This user ID is already taken.");
  }

  await db.runAsync(
    `INSERT INTO users
      (full_name, user_id, age, gender, sampraday, dob, password)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      input.fullName.trim(),
      input.userId.trim(),
      input.age,
      input.gender,
      input.sampraday,
      input.dob.trim(),
      input.password,
    ]
  );
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
