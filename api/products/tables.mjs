export const ProductsTables = /*sql */ `
  CREATE TABLE IF NOT EXISTS "products"
  ("id" INTEGER PRIMARY KEY,
    "slug" TEXT NOT NULL UNIQUE,
    "price" REAL NOT NULL,
    "name" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "description" TEXT NOT NULL
  ) STRICT;
  CREATE TABLE IF NOT EXISTS "comments"
  ("id_comment" INTEGER PRIMARY KEY,
    "product_id" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    FOREIGN KEY("product_id") REFERENCES "products" ("id") ON DELETE CASCADE,
     FOREIGN KEY("user_id") REFERENCES "users" ("user_id") ON DELETE CASCADE
  ) STRICT;
  CREATE TABLE IF NOT EXISTS "cart"
  ("product_id" INTEGER PRIMARY KEY,
    "quantity" INTEGER,
    FOREIGN KEY("product_id") REFERENCES "products" ("id")
  ) STRICT;
`;
