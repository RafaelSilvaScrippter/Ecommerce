export const tableUsers =
  /*sql */
  `
  CREATE TABLE IF NOT EXISTS "users"
  ("user_id" INTEGER PRIMARY KEY,
    "name" TEXT NOT NULL,
    "second_name" TEXT NOT NULL,
    "email" TEXT UNIQUE NOT NULL,
    "senha" TEXT NOT NULL,
    "CPF" INTEGER UNIQUE NOT NULL
  )

`;
