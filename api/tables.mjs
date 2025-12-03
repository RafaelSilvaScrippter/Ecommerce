export const tableUsers =
  /*sql */
  `
  CREATE TABLE IF NOT EXISTS "sessions"
  ("id" INTEGER PRIMARY KEY,
    "user_id" INTEGER,
    "session_hash" TEXT NOT NULL,
    FOREIGN KEY ("user_id") REFERENCES "users" ("user_id")
  );
  CREATE TABLE IF NOT EXISTS "users"
  ("user_id" INTEGER PRIMARY KEY,
    "name" TEXT NOT NULL,
    "second_name" TEXT NOT NULL,
    "email" TEXT UNIQUE NOT NULL,
    "senha" TEXT NOT NULL,
    "CPF" INTEGER UNIQUE NOT NULL
  )

`;
