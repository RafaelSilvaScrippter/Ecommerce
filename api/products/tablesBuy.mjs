export const tablesBuy = /*sql */ `
  CREATE TABLE IF NOT EXISTS "buyProducts"
  ("id" INTEGER PRIMARY KEY,
    "product_buy" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    FOREIGN KEY("product_buy") REFERENCES "products" ("id")
  )

`;
