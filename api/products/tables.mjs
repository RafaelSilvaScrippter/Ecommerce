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
  ("product_id" INTEGER PRIMARY KEY,
    "comment" TEXT NOT NULL,
    FOREIGN KEY("product_id") REFERENCES "products" ("id")
  ) STRICT;
  CREATE TABLE IF NOT EXISTS "cart"
  ("product_id" INTEGER PRIMARY KEY,
    "quantity" INTEGER,
    FOREIGN KEY("product_id") REFERENCES "products" ("id")
  ) STRICT;
`;
