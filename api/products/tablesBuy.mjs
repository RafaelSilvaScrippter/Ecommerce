export const tablesBuy = /*sql */ `
  CREATE TABLE IF NOT EXISTS "buyProducts"
  ("id" INTEGER PRIMARY KEY,
    "product_buy" INTEGER  UNIQUE NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT "aguardando a confirmaçao",
    "user_id" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE CASCADE,
    FOREIGN KEY("product_buy") REFERENCES "products" ("id") ON DELETE CASCADE
  )

`;
